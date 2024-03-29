import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { db } from "../db.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

dotenv.config();

// Function to create a new query
export const createQuery = async (req, res) => {
  const newQuery = req.body;
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  newQuery.createdDateTime = `${currentDate} ${currentTime}`;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userEmail = decodedToken.email;

    await db.collection("queries").insertOne({ ...newQuery, userEmail });

    await sendEmail(userEmail, newQuery);
    res
      .status(201)
      .json({ message: "Query created successfully", query: newQuery });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Function to get queries for the logged-in user
export const getQueries = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const loggedInUserEmail = decodedToken.email;

    const userQueries = await db
      .collection("queries")
      .find({ userEmail: loggedInUserEmail })
      .toArray();

    res.json(userQueries);
  } catch (error) {
    console.error("Error retrieving user's queries:", error);
    res.status(500).json({ message: "Error retrieving user's queries" });
  }
};

// Function to delete a query by ID
export const deleteQuery = async (req, res) => {
  const { id } = req.params;
  try {
    // Use 'new' to instantiate ObjectId
    const queryId = new ObjectId(id);

    const result = await db.collection("queries").deleteOne({ _id: queryId });

    if (result.deletedCount > 0) {
      res.json({ message: `Query with ID ${id} deleted successfully` });
    } else {
      res.status(404).json({ message: `Query with ID ${id} not found` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting query", error: error.message });
  }
};

// Function to send an email
const sendEmail = async (userEmail, newQuery) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: "Query Created",
      text: `Your query "${newQuery.title}" has been created successfully.\nOur team will contact you soon and resolve your doubts ASAP.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    // Handle the error as needed
  }
};

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

    const queries = await db
      .collection("queries")
      .find({ userEmail: loggedInUserEmail }) // Filter queries based on the logged-in user's email
      .toArray();

    res.json(queries);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching queries", error: error.message });
  }
};

// Function to delete a query by ID
export const deleteQuery = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db
      .collection("queries")
      .deleteOne({ _id: ObjectId(id) });
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
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: userEmail,
      to: process.env.EMAIL,
      subject: "Query Created",
      text: `Your query "${newQuery.title}" has been created successfully.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    // Handle the error as needed
  }
};

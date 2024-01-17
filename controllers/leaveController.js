import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { db } from "../db.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

dotenv.config();

// Email configuration using nodemailer (Gmail as an example)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

export const leaveApplication = async (req, res) => {
  const newApplication = req.body;

  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userEmail = decodedToken?.email;

    if (!userEmail) {
      console.error("User email not found in decoded token");
      return res
        .status(401)
        .json({ message: "Unauthorized: User email not found" });
    }

    console.log("User Email:", userEmail);

    await db.collection("leaveApplications").insertOne({
      ...newApplication,
      userEmail,
    });

    // Send email when a new application is submitted
    await sendEmail(userEmail, newApplication);

    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Function to delete a leave application by ID
export const deleteLeaveApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const leaveAppId = new ObjectId(id);

    const result = await db
      .collection("leaveApplications")
      .deleteOne({ _id: leaveAppId });

    if (result.deletedCount > 0) {
      res.json({
        message: `Leave application with ID ${id} deleted successfully`,
      });
    } else {
      res
        .status(404)
        .json({ message: `Leave application with ID ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error deleting leave application",
      error: error.message,
    });
  }
};

// Function to get leave applications for the authenticated user
export const getAllLeaveApplications = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const loggedInUserEmail = decodedToken?.email;

    if (!loggedInUserEmail) {
      console.error("User email not found in decoded token");
      return res
        .status(401)
        .json({ message: "Unauthorized: User email not found" });
    }

    const userApplications = await db
      .collection("leaveApplications")
      .find({ userEmail: loggedInUserEmail })
      .toArray();

    res.json(userApplications);
  } catch (error) {
    console.error("Error retrieving user's leave applications:", error);
    res
      .status(500)
      .json({ message: "Error retrieving user's leave applications" });
  }
};

// Function to send an email
const sendEmail = async (userEmail, application) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail, // Ensure userEmail is defined and contains a valid email address
      subject: "New Leave Application Submitted",
      text: `Dear User,

Your leave application details are as follows:
Days: ${application.days}
From: ${application.from}
To: ${application.to}
Reason: ${application.options}
`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    // Handle the error as needed
  }
};

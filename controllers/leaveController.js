import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { db } from "../db.js";
import jwt from "jsonwebtoken";

dotenv.config();

// Email configuration using nodemailer (Gmail as an example)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Function to send an email
const sendEmail = (userEmail, application) => {
  const mailOptions = {
    from: userEmail, // Sender email
    to: process.env.EMAIL, // Recipient's email
    subject: "New Leave Application Submitted",
    text: `Dear User,\n\nYour leave application details are as follows:\n\nDays: ${application.days}\nFrom: ${application.from}\nTo: ${application.to}\nReason: ${application.options}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error occurred while sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// Endpoint to handle Leave Applications form submission
export const leaveApplication = async (req, res) => {
  const newApplication = req.body;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userEmail = decodedToken.email;

    await db.collection("leaveApplications").insertOne({
      ...newApplication,
      userEmail,
    });

    // Send email when a new application is submitted
    sendEmail(userEmail, newApplication);

    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Function to get leave applications for the authenticated user
export const getUserLeaveApplications = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userEmail = decodedToken.email;

    const userApplications = await db
      .collection("leaveApplications")
      .find({ userEmail })
      .toArray();

    res.json(userApplications);
  } catch (error) {
    console.error("Error retrieving user's leave applications:", error);
    res
      .status(500)
      .json({ message: "Error retrieving user's leave applications" });
  }
};

import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { db } from "../db.js";

dotenv.config();
let applications = [];

// Endpoint to handle Leave Applications form submission
export const leaveAplication = async (req, res) => {
  const newApplication = req.body;
  applications.push(newApplication);

  // Assuming the user's email is included in the authentication token

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

// Function to get all LeaveApplications
export const getAllLeaveApplications = async (req, res) => {
  try {
    const allApplications = await db
      .collection("leaveApplications")
      .find()
      .toArray();
    res.json(allApplications);
  } catch (error) {
    console.error("Error retrieving leave applications:", error);
    res.status(500).json({ message: "Error retrieving leave applications" });
  }
};

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
    to: process.env.EMAIL, //  recipient's email
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

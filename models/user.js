import { db } from "../db.js";
import bcrypt from "bcrypt";

export async function createUser(userData) {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const result = await db.collection("users").insertOne(userData);
    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function findUserByEmail(email) {
  try {
    const user = await db.collection("users").findOne({ email });
    return user;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
}

export async function comparePasswords(plainPassword, hashedPassword) {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
}

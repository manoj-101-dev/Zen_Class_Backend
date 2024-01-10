import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.URI;

async function dbConnection() {
  try {
    const client = new MongoClient(connectionString);
    await client.connect();
    console.log("Database Connected");
    return client.db("zen_class");
  } catch (error) {
    console.error("Error Connecting Database:", error);
    throw error;
  }
}

export const db = await dbConnection();

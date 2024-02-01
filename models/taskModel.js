import { ObjectId } from "mongodb";
import { db } from "../db.js";

async function createTask(taskData) {
  const tasksCollection = db.collection("tasks");

  const result = await tasksCollection.insertOne(taskData);
  return result;
}

async function getTasks(userId) {
  const tasksCollection = db.collection("tasks");

  return tasksCollection.find({ userId: userId }).toArray();
}

async function deleteTask(taskId) {
  const tasksCollection = db.collection("tasks");

  const result = await tasksCollection.findOneAndDelete({
    _id: new ObjectId(taskId),
  });
  return result.value;
}

export { createTask, getTasks, deleteTask };

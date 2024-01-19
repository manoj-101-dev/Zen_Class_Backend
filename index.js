import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).send("Your service is live");
});

// Allow CORS for all routes
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use("/", authRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

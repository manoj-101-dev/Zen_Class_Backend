import {
  findUserByEmail,
  createUser,
  comparePasswords,
} from "../models/user.js";
import { generateToken } from "../auth/jwt.js";

export async function signup(req, res) {
  const { email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await createUser({ email, password });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User email in login:", user.email); // Ensure this line is reached

    const passwordMatch = await comparePasswords(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.email);
    const userData = {
      _id: user._id,
    };

    res
      .status(200)
      .json({ message: "Login successful", user: userData, token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
}

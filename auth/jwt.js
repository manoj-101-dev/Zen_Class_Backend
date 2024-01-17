import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRET_KEY;

export function generateToken(userId) {
  return jwt.sign({ userId }, secretKey); // Token includes only userId and expires in 1 hour
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null;
  }
}
export function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token is missing" });
  }
  next();
}

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRET_KEY;

export function generateToken(userId, email) {
  return jwt.sign({ userId, email }, secretKey);
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);

    return decoded;
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    return null;
  }
}

export function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token is missing" });
  }

  const tokenSubstring = token.substring("Bearer ".length);
  const decodedToken = verifyToken(tokenSubstring);

  if (!decodedToken) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

  // Attach the decoded token to the request for further use if needed
  req.decodedToken = decodedToken;

  next();
}

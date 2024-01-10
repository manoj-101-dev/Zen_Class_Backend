import express from "express";
import { signup, login } from "../controllers/authController.js";
import {
  createQuery,
  getQueries,
  deleteQuery,
} from "../controllers/queriesController.js";
import {
  getAllLeaveApplications,
  leaveAplication,
} from "../controllers/leaveController.js";
import { authenticateToken } from "../auth/jwt.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);
// Applying authenticateToken middleware to routes that require authentication
// router.use(authenticateToken);
router.post("/queries", createQuery);
router.get("/queries", getQueries);
router.delete("/queries/:id", deleteQuery);
router.post("/leaveAplication", leaveAplication);
router.get("/AllLeaveAplication", getAllLeaveApplications);

export default router;

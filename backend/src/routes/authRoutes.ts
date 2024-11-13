import express from "express";
const router = express.Router();
import {
  register,
  login,
  logout,
  profile,
} from "../controllers/authController";
import { verifyAccessToken } from "../middlewares/verifyToken";

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyAccessToken, profile);
router.post("/logout", logout);

export default router;

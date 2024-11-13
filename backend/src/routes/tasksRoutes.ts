import express from "express";
const router = express.Router();

import {
  getTasks,
  getTask,
  postTask,
  putTask,
  deleteTask,
} from "../controllers/taskController";
import { verifyAccessToken } from "../middlewares/verifyToken";
import checkRole from "../middlewares/check-role";

router.get("/", getTasks);
router.get("/:taskId", verifyAccessToken, getTask);
router.post("/", verifyAccessToken, postTask);
router.put("/:taskId", verifyAccessToken, checkRole("ADMIN"), putTask);
router.delete(
  "/:taskId/:userId",
  verifyAccessToken,
  checkRole("ADMIN"),
  deleteTask,
);

export default router;

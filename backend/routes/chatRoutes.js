import express from "express";
import { sendMessage, createTasksFromChat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/message", sendMessage);
router.post("/create-tasks", createTasksFromChat);

export default router;

import express from "express";
import {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo,
    getTodosGrouped
} from "../controllers/todoController.js";

const router = express.Router();
router.get("/", getAllTodos);
router.get("/grouped", getTodosGrouped);
router.get("/:id", getTodoById);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
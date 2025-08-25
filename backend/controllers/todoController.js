import { Todo } from "../models/todoModel.js";

// Get all todos
export const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: todos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching todos",
            error: error.message
        });
    }
};

// Create a new todo
export const createTodo = async (req, res) => {
    try {
        const { title, description, status, priority, aiGenerated, originalMessage } = req.body;
        
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }
        
        const todo = new Todo({
            title,
            description: description || "",
            status: status || "todo",
            priority: priority || "medium",
            aiGenerated: aiGenerated || false,
            originalMessage: originalMessage || ""
        });
        
        const savedTodo = await todo.save();
        
        res.status(201).json({
            success: true,
            data: savedTodo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating todo",
            error: error.message
        });
    }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Todo deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting todo",
            error: error.message
        });
    }
};
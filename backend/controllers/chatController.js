import { GoogleGenerativeAI } from '@google/generative-ai';
import { Todo } from '../models/todoModel.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Todo management tools
const tools = {
    getAllTodos: async () => {
        const todos = await Todo.find().sort({ createdAt: -1 });
        return todos;
    },
    
    createTodo: async (todo) => {
        const newTodo = new Todo({
            title: todo,
            description: "",
            status: "todo",
            priority: "medium",
            aiGenerated: true
        });
        const savedTodo = await newTodo.save();
        return savedTodo._id.toString();
    },
    
    deleteTodoById: async (id) => {
        await Todo.findByIdAndDelete(id);
        return true;
    },
    
    searchTodo: async (query) => {
        const todos = await Todo.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        return todos;
    },
    
    updateTodoStatus: async (id, status) => {
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        return updatedTodo;
    },
    
    updateTodoPriority: async (id, priority) => {
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { priority },
            { new: true }
        );
        return updatedTodo;
    },
    
    markTaskCompleted: async (searchTerm) => {
        // Find task by searching title/description
        const tasks = await Todo.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ],
            status: { $ne: 'done' } // Only find non-completed tasks
        });
        
        if (tasks.length === 0) {
            return { error: "No matching incomplete tasks found" };
        }
        
        // If multiple matches, return the first one (most relevant)
        const taskToUpdate = tasks[0];
        const updatedTodo = await Todo.findByIdAndUpdate(
            taskToUpdate._id,
            { status: 'done' },
            { new: true }
        );
        
        return { 
            success: true, 
            task: updatedTodo,
            message: `Marked "${updatedTodo.title}" as completed`
        };
    },
    
    markTaskInProgress: async (searchTerm) => {
        const tasks = await Todo.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ],
            status: 'todo'
        });
        
        if (tasks.length === 0) {
            return { error: "No matching todo tasks found" };
        }
        
        const taskToUpdate = tasks[0];
        const updatedTodo = await Todo.findByIdAndUpdate(
            taskToUpdate._id,
            { status: 'in_progress' },
            { new: true }
        );
        
        return { 
            success: true, 
            task: updatedTodo,
            message: `Marked "${updatedTodo.title}" as in progress`
        };
    }
};

const SYSTEM_PROMPT = `
You are an AI To-Do List Assistant with START, PLAN, ACTION, Observation and Output State.
Wait for the user prompt and first PLAN using available tools.
After Planning, Take the action with appropriate tools and wait for the Observation based on Action.
Once you get the Observation, Return the AI response based on START prompt and observations.

You can manage tasks by adding, viewing, updating and deleting them.
You must strictly follow the JSON output format.

Todo DB Schema:
_id: ObjectId (Primary Key)
title: String
description: String  
status: String (enum: 'todo', 'in_progress', 'done')
priority: String (enum: 'low', 'medium', 'high')
aiGenerated: Boolean
createdAt: Date
updatedAt: Date

Available Tools:
- getAllTodos(): Returns all the Todos from Database
- createTodo(todo: string): Creates a new Todo in the Database and takes todo title as a string and returns the ID of the created Todo
- deleteTodoById(id: string): Deletes a Todo by ID given in the Database
- searchTodo(query: string): Searches for all todos matching the query string in title or description
- updateTodoStatus(id: string, status: string): Updates todo status ('todo', 'in_progress', 'done')
- updateTodoPriority(id: string, priority: string): Updates todo priority ('low', 'medium', 'high')
- markTaskCompleted(searchTerm: string): Finds and marks a task as completed by searching title/description
- markTaskInProgress(searchTerm: string): Finds and marks a task as in progress by searching title/description

You must respond with valid JSON objects only. Types of responses:
- {"type": "plan", "plan": "description of what you plan to do"}
- {"type": "action", "function": "functionName", "input": "input parameter"}
- {"type": "output", "output": "final response to user"}

Example Flow:
START
{"type": "user", "user": "Add a task for shopping groceries"}
{"type": "plan", "plan": "I will create a new todo for shopping groceries using the createTodo tool"}
{"type": "action", "function": "createTodo", "input": "Shopping groceries"}
{"type": "observation", "observation": "507f1f77bcf86cd799439011"}
{"type": "output", "output": "I've successfully added 'Shopping groceries' to your todo list!"}

Always be helpful, concise, and focus on task management. When users ask to view todos, get all todos first. When they want to search, use searchTodo. When they want to add tasks, use createTodo. When users say they completed something, use markTaskCompleted with keywords from their message. When users say they're working on something, use markTaskInProgress.
`;

export const sendMessage = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        // Initialize the model
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        // Build conversation history
        const messages = [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT }] }
        ];

        // Add conversation history
        for (const msg of conversationHistory) {
            messages.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        }

        // Add current user message
        const userMessage = { type: 'user', user: message };
        messages.push({
            role: 'user',
            parts: [{ text: JSON.stringify(userMessage) }]
        });

        let finalResponse = null;
        let tasksModified = false;
        let iterations = 0;
        const maxIterations = 5; // Prevent infinite loops

        while (iterations < maxIterations) {
            iterations++;

            // Get AI response
            const chat = await model.generateContent({
                contents: messages
            });
            
            const result = chat.response.text();
            
            // Add AI response to conversation
            messages.push({
                role: 'model',
                parts: [{ text: result }]
            });

            let action;
            try {
                action = JSON.parse(result);
            } catch (parseError) {
                console.error('Failed to parse AI response:', result);
                throw new Error('Invalid AI response format');
            }

            if (action.type === 'output') {
                finalResponse = action.output;
                break;
            } else if (action.type === 'action') {
                const fn = tools[action.function];
                if (!fn) {
                    throw new Error(`Invalid tool: ${action.function}`);
                }
                
                // Execute the tool
                let observation;
                try {
                    if (action.function === 'updateTodoStatus' || action.function === 'updateTodoPriority') {
                        // These functions need two parameters
                        const [id, value] = action.input.split(',').map(s => s.trim());
                        observation = await fn(id, value);
                    } else {
                        observation = await fn(action.input);
                    }
                    
                    // Mark tasks as modified for task-changing operations
                    const taskModifyingActions = ['createTodo', 'deleteTodoById', 'updateTodoStatus', 'updateTodoPriority', 'markTaskCompleted', 'markTaskInProgress'];
                    if (taskModifyingActions.includes(action.function)) {
                        tasksModified = true;
                    }
                } catch (toolError) {
                    observation = `Error: ${toolError.message}`;
                }

                // Add observation to conversation
                const observationMessage = { type: 'observation', observation: observation };
                messages.push({
                    role: 'user',
                    parts: [{ text: JSON.stringify(observationMessage) }]
                });
            } else if (action.type === 'plan') {
                // Planning step, continue to next iteration
                continue;
            } else {
                throw new Error(`Unknown action type: ${action.type}`);
            }
        }

        if (!finalResponse) {
            finalResponse = "I apologize, but I couldn't complete your request. Please try again.";
        }

        res.status(200).json({
            success: true,
            data: {
                message: finalResponse,
                tasksModified: tasksModified,
                conversationHistory: messages.map(msg => ({
                    role: msg.role === 'model' ? 'assistant' : 'user',
                    content: msg.parts[0].text
                }))
            }
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to process message",
            error: error.message
        });
    }
};

export const createTasksFromChat = async (req, res) => {
    try {
        const { tasks, originalMessage } = req.body;
        
        if (!tasks || !Array.isArray(tasks)) {
            return res.status(400).json({
                success: false,
                message: "Tasks array is required"
            });
        }

        const createdTasks = [];
        
        for (const taskData of tasks) {
            const todo = new Todo({
                title: taskData.title,
                description: taskData.description || "",
                priority: taskData.priority || "medium",
                status: "todo",
                aiGenerated: true,
                originalMessage: originalMessage || ""
            });
            
            const savedTodo = await todo.save();
            createdTasks.push(savedTodo);
        }

        res.status(201).json({
            success: true,
            data: createdTasks,
            message: `Created ${createdTasks.length} task${createdTasks.length > 1 ? 's' : ''} successfully`
        });

    } catch (error) {
        console.error('Create tasks error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create tasks",
            error: error.message
        });
    }
};

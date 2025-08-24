import { useState, useMemo } from 'react'
import { nanoid } from 'nanoid'

const initialTasks = [
    { id: nanoid(), title: 'Go shopping for groceries', description: 'Milk, bread, eggs', status: 'todo', priority: 'medium' },
    { id: nanoid(), title: 'Plan weekend trip', description: 'Book hotel and car', status: 'todo', priority: 'low' },
    { id: nanoid(), title: 'Design landing hero', description: 'Refine accents and motion', status: 'in_progress', priority: 'high' },
    { id: nanoid(), title: 'Update README', description: 'Add setup instructions', status: 'done', priority: 'low' },
]

export function useTasks() {
    const [tasks, setTasks] = useState(initialTasks)

    const groupedTasks = useMemo(() => {
        const groups = { todo: [], in_progress: [], done: [] }
        tasks.forEach(task => groups[task.status].push(task))
        return groups
    }, [tasks])

    const createTask = (taskData = {}) => {
        const newTask = {
            id: nanoid(),
            title: taskData.title || 'New task',
            description: taskData.description || '',
            status: taskData.status || 'todo',
            priority: taskData.priority || 'medium',
            createdAt: Date.now(),
        }
        setTasks(prev => [newTask, ...prev])
        return newTask
    }

    const updateTask = (id, updates) => {
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, ...updates } : task
        ))
    }

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(task => task.id !== id))
    }

    const moveTask = (taskId, newStatus, newIndex = null) => {
        const task = tasks.find(t => t.id === taskId)
        if (!task) return

        if (newIndex === null) {
            // Simple status change
            updateTask(taskId, { status: newStatus })
            return
        }

        // Reorder within column or move between columns
        const updatedTasks = tasks.filter(t => t.id !== taskId)
        const updatedTask = { ...task, status: newStatus }
        const targetColumnTasks = groupedTasks[newStatus].filter(t => t.id !== taskId)

        targetColumnTasks.splice(newIndex, 0, updatedTask)
        const otherTasks = updatedTasks.filter(t => t.status !== newStatus)

        setTasks([...otherTasks, ...targetColumnTasks])
    }

    return {
        tasks,
        groupedTasks,
        createTask,
        updateTask,
        deleteTask,
        moveTask
    }
}
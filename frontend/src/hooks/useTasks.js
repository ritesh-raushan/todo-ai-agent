import { useState, useMemo, useEffect } from 'react'
import { toast } from 'sonner'

const API_BASE = 'http://localhost:5000/api'

export function useTasks() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchTodos = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_BASE}/todos`)
            const result = await response.json()
            
            if (result.success) {
                setTasks(result.data)
                setError(null)
            } else {
                setError('Failed to fetch todos')
            }
        } catch (err) {
            setError('Failed to connect to server')
            toast.error('Connection failed')
            console.error('Fetch todos error:', err)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchTodos()
    }, [])

    const groupedTasks = useMemo(() => {
        const groups = { todo: [], in_progress: [], done: [] }
        tasks.forEach(task => groups[task.status].push(task))
        return groups
    }, [tasks])

    const createTask = async (taskData = {}) => {
        try {
            const response = await fetch(`${API_BASE}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: taskData.title || 'New task',
                    description: taskData.description || '',
                    status: taskData.status || 'todo',
                    priority: taskData.priority || 'medium'
                })
            })
            
            const result = await response.json()
            
            if (result.success) {
                setTasks(prev => [result.data, ...prev])
                return result.data
            } else {
                throw new Error(result.message)
            }
        } catch (err) {
            setError('Failed to create task')
            toast.error('Failed to create task')
            console.error('Create task error:', err)
            return null
        }
    }

    const updateTask = async (id, updates) => {
        try {
            const response = await fetch(`${API_BASE}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            })
            
            const result = await response.json()
            
            if (result.success) {
                setTasks(prev => prev.map(task =>
                    task._id === id ? result.data : task
                ))
            } else {
                throw new Error(result.message)
            }
        } catch (err) {
            setError('Failed to update task')
            toast.error('Failed to update task')
            console.error('Update task error:', err)
        }
    }

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`${API_BASE}/todos/${id}`, {
                method: 'DELETE'
            })
            
            const result = await response.json()
            
            if (result.success) {
                // Get task title before removing it
                const deletedTask = tasks.find(task => task._id === id)
                setTasks(prev => prev.filter(task => task._id !== id))
                // No toast for delete - visual feedback is enough
            } else {
                throw new Error(result.message)
            }
        } catch (err) {
            setError('Failed to delete task')
            toast.error('Failed to delete task')
            console.error('Delete task error:', err)
        }
    }

    const moveTask = async (taskId, newStatus, newIndex = null) => {
        const task = tasks.find(t => t._id === taskId)
        if (!task) return
        await updateTask(taskId, { status: newStatus })
    }

    const refreshTasks = () => {
        fetchTodos()
    }

    return {
        tasks,
        groupedTasks,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
        refreshTasks,
        loading,
        error
    }
}
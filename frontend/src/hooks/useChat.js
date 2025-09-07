import { useState } from 'react'
import { toast } from 'sonner'

const API_BASE = 'http://localhost:5000/api'

export function useChat() {
    const [isLoading, setIsLoading] = useState(false)
    const [conversationHistory, setConversationHistory] = useState([])

    const sendMessage = async (message) => {
        try {
            setIsLoading(true)
            const response = await fetch(`${API_BASE}/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message,
                    conversationHistory 
                })
            })
            
            const result = await response.json()
            
            if (result.success) {
                // Update conversation history
                if (result.data.conversationHistory) {
                    setConversationHistory(result.data.conversationHistory)
                }
                
                return {
                    message: result.data.message,
                    tasksModified: result.data.tasksModified,
                    conversationHistory: result.data.conversationHistory
                }
            } else {
                throw new Error(result.message)
            }
        } catch (err) {
            console.error('Chat error:', err)
            toast.error('Failed to send message')
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const createTasksFromChat = async (tasks, originalMessage) => {
        try {
            const response = await fetch(`${API_BASE}/chat/create-tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tasks, originalMessage })
            })
            
            const result = await response.json()
            
            if (result.success) {
                toast.success(result.message)
                return result.data
            } else {
                throw new Error(result.message)
            }
        } catch (err) {
            console.error('Create tasks error:', err)
            toast.error('Failed to create tasks')
            throw err
        }
    }

    return {
        sendMessage,
        createTasksFromChat,
        isLoading
    }
}

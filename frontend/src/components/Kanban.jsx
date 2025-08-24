import { useState, useMemo, useImperativeHandle, forwardRef } from 'react'
import { Column } from './kanban/Column'
import { TaskCard } from './kanban/TaskCard'
import { FadeIn } from '../components/motion/Transitions'
import { nanoid } from 'nanoid'
import { TaskEditor } from './kanban/TaskEditor'

const initialColumns = [
    { id: 'todo', name: 'To Do' },
    { id: 'in_progress', name: 'In Progress' },
    { id: 'done', name: 'Done' },
]

const seededTasks = [
    { id: nanoid(), title: 'Go shopping for groceries', description: 'Milk, bread, eggs', status: 'todo', priority: 'medium' },
    { id: nanoid(), title: 'Plan weekend trip', description: 'Book hotel and car', status: 'todo', priority: 'low' },
    { id: nanoid(), title: 'Design landing hero', description: 'Refine accents and motion', status: 'in_progress', priority: 'high' },
    { id: nanoid(), title: 'Update README', description: 'Add setup instructions', status: 'done', priority: 'low' },
]

export const Kanban = forwardRef((props, ref) => {
    const [tasks, setTasks] = useState(seededTasks)
    const [editorOpen, setEditorOpen] = useState(false)
    const [editingTask, setEditingTask] = useState(null)

    const grouped = useMemo(() => {
        const map = { todo: [], in_progress: [], done: [] }
        for (const t of tasks) map[t.status].push(t)
        return map
    }, [tasks])

    const createTask = (taskData) => {
        const newTask = {
            id: nanoid(),
            ...taskData
        }
        setTasks(prev => [...prev, newTask])
    }

    const updateTask = (taskId, updatedData) => {
        setTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, ...updatedData } : task
        ))
    }

    const deleteTask = (taskId) => {
        setTasks(prev => prev.filter(task => task.id !== taskId))
    }

    const toggleTaskComplete = (task) => {
        const newStatus = task.status === 'done' ? 'todo' : 'done'
        updateTask(task.id, { status: newStatus })
    }

    useImperativeHandle(ref, () => ({
        openCreate: () => {
            setEditingTask({ status: 'todo', priority: 'medium' })
            setEditorOpen(true)
        },
        openEdit: (task) => {
            setEditingTask(task)
            setEditorOpen(true)
        },
    }))

    return (
        <FadeIn style={{ width: '100%' }}>
            <div className="kanban">
                    {initialColumns.map(col => (
                        <Column key={col.id} id={col.id} title={col.name} tasks={grouped[col.id]}
                            renderItem={(task, index) => (
                                    <TaskCard
                                        key={task.id}
                                        id={`${col.id}:${task.id}`}
                                        task={task}
                                        index={index}
                                        onEdit={(task) => {
                                            setEditingTask(task)
                                            setEditorOpen(true)
                                        }}
                                        onDelete={(task) => deleteTask(task.id)}
                                        onToggleComplete={toggleTaskComplete}
                                    />
                            )}
                        />
                    ))}
            </div>
            {editorOpen && (
                <div className="modal-overlay" onClick={() => setEditorOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <TaskEditor
                            value={editingTask}
                            onCancel={() => setEditorOpen(false)}
                            onSubmit={(updated) => {
                                setEditorOpen(false)
                                if (updated?.id) updateTask(updated.id, updated)
                                else createTask(updated)
                            }}
                        />
                    </div>
                </div>
            )}
        </FadeIn>
    )
})

export default Kanban
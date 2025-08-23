import { useState, useMemo } from 'react'
import { Column } from './kanban/Column'
import { TaskCard } from './kanban/TaskCard'
import { FadeIn } from '../components/motion/Transitions'
import { nanoid } from 'nanoid'

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

export function Kanban() {
    const [tasks, setTasks] = useState(seededTasks)

    const grouped = useMemo(() => {
        const map = { todo: [], in_progress: [], done: [] }
        for (const t of tasks) map[t.status].push(t)
        return map
    }, [tasks])

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
                                    />
                            )}
                        />
                    ))}
            </div>
        </FadeIn>
    )
}

export default Kanban
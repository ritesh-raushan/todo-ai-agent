import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

const PRIORITY_STYLES = {
    high: { bg: 'rgba(239,68,68,0.18)', glow: '0 0 0 6px rgba(239,68,68,0.10)' },
    medium: { bg: 'rgba(124,58,237,0.30)', glow: '0 0 0 6px rgba(124,58,237,0.12)' },
    low: { bg: 'rgba(109,40,217,0.25)', glow: '0 0 0 6px rgba(109,40,217,0.10)' }
}

export function TaskCard({ id, task, onEdit, onDelete, onToggleDone }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
    }

    const handleAction = (action, event) => {
        event.stopPropagation()
        action(task)
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <div
                className={`card ${isDragging ? 'ghost' : ''}`}
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
            >
                {/* Priority indicator rail */}
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: 'rgba(var(--primary), 0.6)',
                    borderTopLeftRadius: 14,
                    borderBottomLeftRadius: 14
                }} />

                {/* Task header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <PriorityChip priority={task.priority} />
                        <div style={{ fontWeight: 700, fontFamily: 'Space Mono, monospace' }}>
                            {task.title}
                        </div>
                    </div>
                    <TaskActions
                        task={task}
                        onEdit={(e) => handleAction(onEdit, e)}
                        onDelete={(e) => handleAction(onDelete, e)}
                        onToggleDone={(e) => handleAction(onToggleDone, e)}
                    />
                </div>

                {/* Task description */}
                {task.description && (
                    <div style={{ marginTop: 8, color: 'rgb(180, 188, 200)' }}>
                        {task.description}
                    </div>
                )}
            </div>
        </motion.div>
    )
}

function PriorityChip({ priority }) {
    const priorityStyle = PRIORITY_STYLES[priority]

    return (
        <span
            className="chip"
            style={{
                position: 'relative',
                background: priorityStyle.bg,
                borderColor: 'rgba(255,255,255,0.16)',
                textTransform: 'capitalize'
            }}
        >
            <span style={{ position: 'absolute', inset: -2, borderRadius: 999, boxShadow: priorityStyle.glow }} />
            <span style={{ position: 'relative' }}>{priority}</span>
        </span>
    )
}

function TaskActions({ task, onEdit, onDelete, onToggleDone }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
                className="button button-ghost cursor-pointer"
                onClick={onToggleDone}
                title="Toggle complete"
                style={{
                    padding: '6px 8px',
                    background: task.status === 'done' ? 'rgba(16,185,129,0.35)' : undefined
                }}
            >
                <CheckCircle2 size={14} />
            </button>
            <button
                className="button button-ghost cursor-pointer"
                onClick={onEdit}
                title="Edit task"
                style={{ padding: '6px 8px' }}
            >
                <Pencil size={14} />
            </button>
            <button
                className="button button-ghost cursor-pointer"
                onClick={onDelete}
                title="Delete task"
                style={{ padding: '6px 8px', background: 'rgba(239,68,68,0.2)' }}
            >
                <Trash2 size={14} />
            </button>
        </div>
    )
}

export default TaskCard
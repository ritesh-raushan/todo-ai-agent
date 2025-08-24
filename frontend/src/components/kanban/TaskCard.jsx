import { CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import { ScaleOnHover } from '../motion/Transitions'

const priorityStyle = {
    high: { bg: 'rgba(239,68,68,0.18)', glow: '0 0 0 6px rgba(239,68,68,0.10)' },
    medium: { bg: 'rgba(124,58,237,0.30)', glow: '0 0 0 6px rgba(124,58,237,0.12)' },
    low: { bg: 'rgba(109,40,217,0.25)', glow: '0 0 0 6px rgba(109,40,217,0.10)' }
}

export function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {

    return (
        <ScaleOnHover>
            <div className="card">
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'rgba(var(--primary), 0.6)', borderTopLeftRadius: 14, borderBottomLeftRadius: 14 }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="chip" style={{ position: 'relative', background: priorityStyle[task.priority].bg, borderColor: 'rgba(255,255,255,0.16)', textTransform: 'capitalize' }}>
                            <span style={{ position: 'absolute', inset: -2, borderRadius: 999, boxShadow: priorityStyle[task.priority].glow }} />
                            <span style={{ position: 'relative' }}>{task.priority}</span>
                        </span>
                        <div style={{ fontWeight: 700, fontFamily: 'Space Mono, monospace' }}>{task.title}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button 
                            className="button button-ghost" 
                            title="Toggle complete" 
                            style={{ padding: '6px 8px', background: task.status === 'done' ? 'rgba(16,185,129,0.35)' : undefined }}
                            onClick={() => onToggleComplete?.(task)}
                        >
                            <CheckCircle2 size={14} />
                        </button>
                        <button 
                            className="button button-ghost" 
                            title="Edit task" 
                            style={{ padding: '6px 8px' }}
                            onClick={() => onEdit?.(task)}
                        >
                            <Pencil size={14} />
                        </button>
                        <button 
                            className="button button-ghost" 
                            title="Delete task" 
                            style={{ padding: '6px 8px', background: 'rgba(239,68,68,0.2)' }}
                            onClick={() => onDelete?.(task)}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
                {task.description && (
                    <div style={{ marginTop: 8, color: 'rgb(180, 188, 200)' }}>{task.description}</div>
                )}
            </div>
        </ScaleOnHover>
    )
}

export default TaskCard
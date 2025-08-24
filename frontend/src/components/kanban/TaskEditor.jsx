import { useEffect, useState } from 'react'

export function TaskEditor({ value, onSubmit, onCancel }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('medium')
    const [status, setStatus] = useState('todo')

    useEffect(() => {
        if (value) {
            setTitle(value.title || '')
            setDescription(value.description || '')
            setPriority(value.priority || 'medium')
            setStatus(value.status || 'todo')
        }
    }, [value])

    function handleSubmit(e) {
        e.preventDefault()
        onSubmit?.({ ...value, title, description, priority, status })
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Task</div>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '10px 12px', borderRadius: 10, color: 'white' }} />
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={4}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '10px 12px', borderRadius: 10, color: 'white', resize: 'vertical' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <select value={priority} onChange={e => setPriority(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '10px 12px', borderRadius: 10, color: 'white' }}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                <select value={status} onChange={e => setStatus(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '10px 12px', borderRadius: 10, color: 'white' }}>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                <button type="button" onClick={onCancel} className="button button-ghost">Cancel</button>
                <button type="submit" className="button button-primary">Save</button>
            </div>
        </form>
    )
}

export default TaskEditor
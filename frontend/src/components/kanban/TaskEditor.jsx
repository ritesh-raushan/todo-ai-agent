import { useEffect, useState } from 'react'

const PRIORITY_OPTIONS = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
]

const STATUS_OPTIONS = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
]

export function TaskEditor({ value, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo'
    })

    useEffect(() => {
        if (value) {
            setFormData({
                title: value.title || '',
                description: value.description || '',
                priority: value.priority || 'medium',
                status: value.status || 'todo'
            })
        }
    }, [value])

    const handleChange = (field, newValue) => {
        setFormData(prev => ({ ...prev, [field]: newValue }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit?.({ ...value, ...formData })
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Task</div>

            <FormInput
                value={formData.title}
                onChange={(value) => handleChange('title', value)}
                placeholder="Title"
                required
            />

            <FormTextarea
                value={formData.description}
                onChange={(value) => handleChange('description', value)}
                placeholder="Description"
                rows={4}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <FormSelect
                    value={formData.priority}
                    onChange={(value) => handleChange('priority', value)}
                    options={PRIORITY_OPTIONS}
                />
                <FormSelect
                    value={formData.status}
                    onChange={(value) => handleChange('status', value)}
                    options={STATUS_OPTIONS}
                />
            </div>

            <FormActions onCancel={onCancel} />
        </form>
    )
}

function FormInput({ value, onChange, placeholder, required = false }) {
    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '10px 12px',
                borderRadius: 10,
                color: 'white'
            }}
        />
    )
}

function FormTextarea({ value, onChange, placeholder, rows }) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '10px 12px',
                borderRadius: 10,
                color: 'white',
                resize: 'vertical'
            }}
        />
    )
}

function FormSelect({ value, onChange, options }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '10px 12px',
                borderRadius: 10,
                color: 'white'
            }}
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}

function FormActions({ onCancel }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <button type="button" onClick={onCancel} className="button button-ghost cursor-pointer">
                Cancel
            </button>
            <button type="submit" className="button button-primary cursor-pointer">
                Save
            </button>
        </div>
    )
}

export default TaskEditor
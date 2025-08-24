import { useState, forwardRef, useImperativeHandle } from 'react'
import { DndContext, rectIntersection, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { motion } from 'framer-motion'

import { useTasks } from '../hooks/useTasks'
import { useModal } from '../hooks/useModal'
import { parseDragId, parseDropId, createDragId } from '../utils/dragHelpers'

import { Column } from './kanban/Column'
import { TaskCard } from './kanban/TaskCard'
import { Modal } from './ui/Modal'
import { TaskEditor } from './kanban/TaskEditor'

const COLUMNS = [
    { id: 'todo', name: 'To Do' },
    { id: 'in_progress', name: 'In Progress' },
    { id: 'done', name: 'Done' },
]

export const Kanban = forwardRef(function Kanban(_props, ref) {
    const { groupedTasks, createTask, updateTask, deleteTask, moveTask } = useTasks()
    const modal = useModal()
    const [activeTaskId, setActiveTaskId] = useState(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 },
        })
    )

    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
        openCreate: () => modal.open({ status: 'todo', priority: 'medium' }),
        openEdit: (task) => modal.open(task),
    }))

    const handleDragStart = (event) => {
        setActiveTaskId(event.active.id)
    }

    const handleDragCancel = () => {
        setActiveTaskId(null)
    }

    const handleDragEnd = (event) => {
        const { active, over } = event
        setActiveTaskId(null)

        if (!over) return

        const { taskId: draggedTaskId } = parseDragId(active.id)
        const { columnId: targetColumnId, index: targetIndex } = parseDropId(over.id)

        moveTask(draggedTaskId, targetColumnId, targetIndex)
    }

    const handleTaskAction = {
        edit: (task) => modal.open(task),
        delete: (task) => deleteTask(task.id),
        toggleDone: (task) => updateTask(task.id, {
            status: task.status === 'done' ? 'todo' : 'done'
        }),
    }

    const handleFormSubmit = (formData) => {
        if (formData.id) {
            updateTask(formData.id, formData)
        } else {
            createTask(formData)
        }
        modal.close()
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="kanban"
        >
            <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={handleDragStart}
                onDragCancel={handleDragCancel}
                onDragEnd={handleDragEnd}
            >
                {COLUMNS.map(column => (
                    <Column
                        key={column.id}
                        id={column.id}
                        title={column.name}
                        tasks={groupedTasks[column.id]}
                        renderItem={(task, index) => (
                            <SortableContext
                                key={task.id}
                                items={groupedTasks[column.id].map(t => createDragId(column.id, t.id))}
                                strategy={verticalListSortingStrategy}
                            >
                                <TaskCard
                                    id={createDragId(column.id, task.id)}
                                    task={task}
                                    onEdit={handleTaskAction.edit}
                                    onDelete={handleTaskAction.delete}
                                    onToggleDone={handleTaskAction.toggleDone}
                                />
                            </SortableContext>
                        )}
                    />
                ))}

                <DragOverlay dropAnimation={null}>
                    {activeTaskId && (
                        <div className="card dragging">
                            <div style={{ fontWeight: 600 }}>Moving…</div>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>

            <Modal open={modal.isOpen} onClose={modal.close}>
                <TaskEditor
                    value={modal.data}
                    onCancel={modal.close}
                    onSubmit={handleFormSubmit}
                />
            </Modal>
        </motion.div>
    )
})

export default Kanban
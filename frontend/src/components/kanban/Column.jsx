import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'

export function Column({ id, title, tasks, renderItem }) {
    const { setNodeRef, isOver } = useDroppable({ id })

    return (
        <div className="column" ref={setNodeRef} style={{ outline: isOver ? '2px dashed rgba(255,255,255,0.2)' : 'none', outlineOffset: -6 }}>
            <div className="column-header">
                <div className="column-title">
                    <span>{title}</span>
                </div>
                <div className="chip" aria-label={`${tasks.length} tasks`}>{tasks.length}</div>
            </div>
            <div className="column-scroll">
                {tasks.map((task, index) => renderItem(task, index))}
            </div>
        </div>
    )
}

export default Column
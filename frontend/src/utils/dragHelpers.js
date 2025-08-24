export function parseDragId(dragId) {
    const [columnId, taskId] = dragId.split(':')
    return { columnId, taskId }
}

export function parseDropId(dropId) {
    const parts = dropId.split(':')
    if (parts.length === 1) {
        // Dropped on column
        return { columnId: parts[0], index: null }
    }
    // Dropped on specific position
    return { columnId: parts[0], index: parseInt(parts[1]) }
}

export function createDragId(columnId, taskId) {
    return `${columnId}:${taskId}`
}

export function createDropId(columnId, index = null) {
    return index !== null ? `${columnId}:${index}` : columnId
}
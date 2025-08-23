export function Column({ title, tasks, renderItem }) {

    return (
        <div className="column">
            <div className="column-header">
                <div className="column-title">
                    <span>{title}</span>
                </div>
                <div className="chip" >{tasks.length}</div>
            </div>
            <div className="column-scroll">
                {tasks.map((task, index) => renderItem(task, index))}
            </div>
        </div>
    )
}

export default Column
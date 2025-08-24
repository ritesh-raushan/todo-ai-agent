import './App.css'
import { PlusCircle } from 'lucide-react'
import { Kanban } from './components/Kanban'
import { useRef } from 'react'

function App() {
  const kanbanRef = useRef(null)
  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="navbar">
          <span className="navbar-title">AI Todo Kanban</span>
          <button onClick={() => kanbanRef.current?.openCreate()} className="button button-primary" style={{ marginLeft: 10 }}>
            <PlusCircle size={16} />
            Add Task
          </button>
        </nav>
      </header>
      <main>
        <Kanban ref={kanbanRef} />
      </main>
    </div>
  )
}

export default App
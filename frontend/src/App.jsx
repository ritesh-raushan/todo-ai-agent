import './App.css'
import { PlusCircle } from 'lucide-react'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="navbar">
          <span className="navbar-title">AI Todo Kanban</span>
          <button className="button button-primary" style={{ marginLeft: 10 }}>
            <PlusCircle size={16} />
            Add Task
          </button>
        </nav>
      </header>
    </div>
  )
}

export default App
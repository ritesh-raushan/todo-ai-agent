import './App.css'
import { PlusCircle } from 'lucide-react'
import { Kanban } from './components/Kanban'
import { useRef } from 'react'
import { useTasks } from './hooks/useTasks'
import ChatBox from './components/ChatBox'
import { Toaster } from 'sonner'

function App() {
  const kanbanRef = useRef(null)
  const taskManager = useTasks()

  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="navbar">
          <span className="navbar-title">AI Todo Kanban</span>
          <button onClick={() => kanbanRef.current?.openCreate()} className="button button-primary" style={{ marginLeft: 10, cursor: 'pointer' }}>
            <PlusCircle size={16} />
            Add Task
          </button>
        </nav>
      </header>
      <main className="app-main">
        <Kanban ref={kanbanRef} taskManager={taskManager} />
      </main>

      <ChatBox />
      <Toaster 
        theme="dark"
        position="top-right"
        richColors
        expand={false}
        duration={3000}
        visibleToasts={4}
      />
    </div>
  )
}

export default App
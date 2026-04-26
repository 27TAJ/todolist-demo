import { useState } from 'react'

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Read a book', done: false, dueDate: null },
    { id: 2, text: 'Go for a walk', done: true, dueDate: null },
    { id: 3, text: 'Write some code', done: false, dueDate: null },
  ])
  const [input, setInput] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('all')
  // editing state
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editDueDate, setEditDueDate] = useState('')

  const addTodo = () => {
    const text = input.trim()
    if (!text) return
    setTodos([...todos, { id: Date.now(), text, done: false, dueDate: dueDate || null }])
    setInput('')
    setDueDate('')
  }

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id))

  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
    setEditDueDate(todo.dueDate || '')
  }

  const saveEdit = () => {
    setTodos(todos.map((t) => (t.id === editingId ? { ...t, text: editText.trim() || t.text, dueDate: editDueDate || null } : t)))
    setEditingId(null)
    setEditText('')
    setEditDueDate('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
    setEditDueDate('')
  }

  const clearCompleted = () => setTodos(todos.filter((t) => !t.done))

  const visible = todos.filter((t) =>
    filter === 'active' ? !t.done : filter === 'completed' ? t.done : true,
  )

  const remaining = todos.filter((t) => !t.done).length
  const hasCompleted = todos.some((t) => t.done)

  const tabClass = (name) =>
    `px-3 py-1 rounded-md text-sm font-medium transition ${
      filter === name
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-200'
    }`

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Todo List</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs doing?"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md"
            aria-label="Due date (optional)"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setFilter('all')} className={tabClass('all')}>
            All
          </button>
          <button onClick={() => setFilter('active')} className={tabClass('active')}>
            Active
          </button>
          <button onClick={() => setFilter('completed')} className={tabClass('completed')}>
            Completed
          </button>
        </div>

        <ul className="space-y-2">
          {visible.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`flex-1 text-left ${
                  todo.done ? 'line-through text-slate-400' : 'text-slate-800'
                }`}
              >
                {editingId === todo.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="px-2 py-1 border rounded-md"
                    />
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="px-2 py-1 border rounded-md"
                    />
                    <button onClick={saveEdit} className="px-2 bg-green-600 text-white rounded-md">Save</button>
                    <button onClick={cancelEdit} className="px-2 bg-gray-200 rounded-md">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>{todo.text}</span>
                  </div>
                )}
              </button>
              {/* show due date next to task when not completed and not editing */}
              {!todo.done && todo.dueDate && editingId !== todo.id && (
                <span className="text-sm text-slate-400">{new Date(todo.dueDate).toLocaleDateString()}</span>
              )}
              {editingId !== todo.id && (
                <>
                  <button onClick={() => startEdit(todo)} className="text-sm text-indigo-600 px-2">Edit</button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-slate-400 hover:text-red-500 text-lg font-bold px-2"
                    aria-label="Delete todo"
                  >
                    ×
                  </button>
                </>
              )}
            </li>
          ))}
          {visible.length === 0 && (
            <li className="text-center text-slate-400 py-4 text-sm">
              Nothing here.
            </li>
          )}
        </ul>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>{remaining} {remaining === 1 ? 'item' : 'items'} left</span>
          <button
            onClick={clearCompleted}
            disabled={!hasCompleted}
            className="text-sm text-red-400 hover:text-red-600 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-red-400"
          >
            Clear completed
          </button>
        </div>
      </div>
    </div>
  )
}

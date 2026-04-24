import { useState } from "react";

const FILTERS = ["All", "Active", "Completed"];
const PRIORITIES = ["none", "low", "high"];

const PRIORITY_CONFIG = {
  high: {
    label: "High",
    icon: "!",
    pill: "bg-red-950 text-red-400 border border-red-800",
    btn: "bg-red-950 text-red-400 border-red-800",
  },
  low: {
    label: "Low",
    icon: "↓",
    pill: "bg-zinc-800 text-zinc-400 border border-zinc-700",
    btn: "bg-zinc-800 text-zinc-400 border-zinc-700",
  },
  none: {
    label: "None",
    icon: "—",
    pill: null,
    btn: "bg-zinc-900 text-zinc-600 border-zinc-800 hover:border-zinc-600",
  },
};

function PriorityButton({ priority, onClick, className = "" }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <button
      onClick={onClick}
      aria-label={`Priority: ${cfg.label}. Click to cycle.`}
      title={`Priority: ${cfg.label}`}
      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${cfg.btn} ${className}`}
    >
      {cfg.icon}
    </button>
  );
}

export default function ToDoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");
  const [newPriority, setNewPriority] = useState("none");

  const cycleNewPriority = () =>
    setNewPriority(PRIORITIES[(PRIORITIES.indexOf(newPriority) + 1) % PRIORITIES.length]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos([...todos, { id: Date.now(), text, completed: false, priority: newPriority }]);
    setInput("");
    setNewPriority("none");
  };

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTodo = (id) =>
    setTodos(todos.filter((t) => t.id !== id));

  const cyclePriority = (id) =>
    setTodos(todos.map((t) =>
      t.id === id
        ? { ...t, priority: PRIORITIES[(PRIORITIES.indexOf(t.priority) + 1) % PRIORITIES.length] }
        : t
    ));

  const RANK = { high: 0, low: 1, none: 2 };

  const filteredTodos = todos
    .filter((t) => {
      if (filter === "Active") return !t.completed;
      if (filter === "Completed") return t.completed;
      return true;
    })
    .sort((a, b) => RANK[a.priority] - RANK[b.priority]);

  const remainingCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-8">
          to-do
        </h1>

        {/* Input row */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a task…"
            className="flex-1 bg-zinc-900 text-white placeholder-zinc-500 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
          />
          <PriorityButton priority={newPriority} onClick={cycleNewPriority} className="py-2.5 px-3 rounded-lg" />
          <button
            onClick={addTodo}
            className="bg-white text-zinc-950 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-200 active:scale-95 transition-all"
          >
            Add
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-4 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === f
                  ? "bg-white text-zinc-950"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Todo list */}
        <ul className="space-y-2">
          {filteredTodos.length === 0 && (
            <li className="text-center text-zinc-600 text-sm py-10">
              {filter === "Completed" ? "Nothing completed yet." : "Nothing here yet."}
            </li>
          )}
          {filteredTodos.map((todo) => {
            const cfg = PRIORITY_CONFIG[todo.priority];
            return (
              <li
                key={todo.id}
                className={`flex items-center gap-3 bg-zinc-900 border rounded-lg px-4 py-3 group transition-colors hover:border-zinc-700 ${
                  todo.priority === "high" ? "border-red-900" : "border-zinc-800"
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                    todo.completed
                      ? "bg-white border-white"
                      : "border-zinc-600 hover:border-zinc-400"
                  }`}
                >
                  {todo.completed && (
                    <svg className="w-3 h-3 text-zinc-950" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                {/* Text */}
                <span
                  className={`flex-1 text-sm transition-colors ${
                    todo.completed ? "line-through text-zinc-600" : "text-zinc-100"
                  }`}
                >
                  {todo.text}
                </span>

                {/* Priority badge — always visible when set */}
                {cfg.pill ? (
                  <button
                    onClick={() => cyclePriority(todo.id)}
                    aria-label={`Priority: ${cfg.label}. Click to cycle.`}
                    className={`text-xs px-2 py-0.5 rounded-md border transition-all ${cfg.pill}`}
                  >
                    {cfg.label}
                  </button>
                ) : (
                  <button
                    onClick={() => cyclePriority(todo.id)}
                    aria-label="Set priority"
                    className="text-xs px-2 py-0.5 rounded-md border border-zinc-800 text-zinc-700 opacity-0 group-hover:opacity-100 transition-all hover:text-zinc-400 hover:border-zinc-600"
                  >
                    priority
                  </button>
                )}

                {/* Delete */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="Delete task"
                  className="text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Footer count */}
        {todos.length > 0 && (
          <p className="text-xs text-zinc-600 mt-4 px-1">
            {remainingCount} {remainingCount === 1 ? "task" : "tasks"} remaining
          </p>
        )}
      </div>
    </div>
  );
}

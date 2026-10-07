import { useState } from "react";
import Column from "./components/Column";
import TaskForm from "./components/TaskForm";
import { COLUMNS } from "./columns";
 
const initialTasks = [
  { id: 1, title: "Diseñar la base de datos", status: "done", priority: "alta" },
  { id: 2, title: "Crear el login", status: "doing", priority: "media" },
  { id: 3, title: "Escribir pruebas", status: "todo", priority: "baja" },
  { id: 4, title: "Preparar la demo", status: "todo", priority: "alta" },
];
 
export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
 
  function addTask(title, priority) {
    const exists = tasks.some(
      (t) => t.title.toLowerCase() === title.toLowerCase()
    );

    if (exists) {
      return "Ya existe una tarea con ese título.";
    }

    const newTask = { id: Date.now(), title, status: "todo", priority };
    setTasks([...tasks, newTask]);
    return null;
  }
 
  function moveTask(id, newStatus) {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  }
 
  function removeTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  // NUEVA FUNCIÓN: Filtra el array dejando solo las tareas que NO estén en "done"
  function clearDoneTasks() {
    setTasks(tasks.filter((t) => t.status !== "done"));
  }
 
  // Verificamos si hay tareas hechas para saber si mostramos/habilitamos el botón
  const hasDoneTasks = tasks.some((t) => t.status === "done");

  return (
    <main>
      <h1>Kanban ({tasks.length} Tareas)</h1>
      <TaskForm onAdd={addTask} />

      {/* Botón para vaciar la columna Hecho */}
      <div style={{ margin: "1rem 0" }}>
        <button 
          onClick={clearDoneTasks} 
          disabled={!hasDoneTasks}
          style={{
            backgroundColor: hasDoneTasks ? "#e74c3c" : "#ccc",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
            cursor: hasDoneTasks ? "pointer" : "not-allowed"
          }}
        >
          Vaciar columna Hecho
        </button>
      </div>

      <div className="board">
        {COLUMNS.map((c) => (
          <Column
            key={c.id}
            title={c.title}
            tasks={tasks.filter((t) => t.status === c.id)}
            onMove={moveTask}
            onRemove={removeTask}
          />
        ))}
      </div>
    </main>
  );
}
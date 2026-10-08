import { useEffect, useMemo, useState } from "react";
import Column from "./components/Column";
import TaskForm from "./components/TaskForm";
import { COLUMNS } from "./columns";
import { useLocalStorage } from "./hooks/useLocalStorage";
 
const initialTasks = [
  { id: 1, title: "Diseñar la base de datos", status: "done", priority: "alta" },
  { id: 2, title: "Crear el login", status: "doing", priority: "media" },
  { id: 3, title: "Escribir pruebas", status: "todo", priority: "baja" },
  { id: 4, title: "Preparar la demo", status: "todo", priority: "alta" },
];
 
export default function App() {
  const [tasks, setTasks] = useLocalStorage("kanban-tasks", initialTasks);
  const [query, setQuery] = useLocalStorage("kanban-search-query", "");
 
  useEffect(() => {
// Filtramos las tareas que NO están en la columna "Hecho"
  const pendingTasks = tasks.filter(t => t.status !== "done");
  
// Ponemos el número de pendientes en el título
   document.title = `Kanban (${pendingTasks.length} pendientes)`;
  }, [tasks]); // Se ejecuta cada vez que agregas, mueves o borras tareas
 
  const filteredTasks = useMemo(
    () =>
      tasks.filter((t) =>
        t.title.toLowerCase().includes(query.toLowerCase())
      ),
    [tasks, query]
  );

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

  function resetBoard() {
  // 1. Volvemos el estado de las tareas a su lista original
  setTasks(initialTasks);
  
  // 2. Opcional: Si hiciste el Reto 1, también limpiamos el buscador
  setQuery(""); 
  }
 
  // Verificamos si hay tareas hechas para saber si mostramos/habilitamos el botón
  const hasDoneTasks = tasks.some((t) => t.status === "done");

  return (
    <main>
      <h1>Kanban ({tasks.length} Tareas)</h1>
      <TaskForm onAdd={addTask} />

       <input
        className="search"
        placeholder="Buscar tareas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      

      {/* Botón para vaciar la columna Hecho */}
      <div style={{ margin: "1rem 0" }}>

        {/* BOTÓN DEL RETO 2 */}
        <button 
          onClick={resetBoard}
          style={{ margin: "10px 0", padding: "8px 12px", cursor: "pointer", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "4px" }}
        >
        Restablecer tablero
        </button>

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
            tasks={filteredTasks.filter((t) => t.status === c.id)}
            onMove={moveTask}
            onRemove={removeTask}
          />
        ))}
      </div>
    </main>
  );
}
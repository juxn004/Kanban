import { useState } from "react";
 
export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("media");
  const [error, setError] = useState(""); // Ahora el estado error guarda un string (el mensaje)
 
  function handleSubmit(e) {
    e.preventDefault();
    
    if (title.trim() === "") {
      setError("El título de la tarea no puede estar vacío.");
      return;
    }
 
    // Intentamos agregar la tarea y guardamos el posible mensaje de error que retorne App
    const errorMessage = onAdd(title.trim(), priority);

    if (errorMessage) {
      setError(errorMessage); // Mostramos el error si la tarea ya existía
      return;
    }

    // Si todo fue exitoso, limpiamos el error y el input
    setError("");
    setTitle("");
  }
 
  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (error) setError(""); // Limpiamos el error mientras el usuario escribe
        }}
        placeholder="Nueva tarea..."
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="alta">Alta</option>
        <option value="media">Media</option>
        <option value="baja">Baja</option>
      </select>
      <button>Agregar</button>

      {/* Mensaje de error dinámico en rojo */}
      {error && (
        <p style={{ color: "red", fontSize: "0.85rem", marginTop: "4px" }}>
          {error}
        </p>
      )}
    </form>
  );
}
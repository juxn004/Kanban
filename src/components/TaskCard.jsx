import { useState } from "react";
import { COLUMNS } from "../columns";
 
export default function TaskCard({ task, onMove, onRemove, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  function handleSave() {
    if (editedTitle.trim() !== "") {
      onEdit(task.id, editedTitle);
    } else {
      setEditedTitle(task.title); // Si lo dejan vacío, restauramos el anterior
    }
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditedTitle(task.title);
      setIsEditing(false);
    }
  }

  return (
    <article className={`card prio-${task.priority}`}>
      {isEditing ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ width: "100%", padding: "2px 4px", fontSize: "inherit" }}
        />
      ) : (
        <strong 
          onDoubleClick={() => setIsEditing(true)}
          title="Haz doble clic para editar"
          style={{ cursor: "pointer", display: "inline-block", width: "100%" }}
        >
          {task.title}
        </strong>
      )}

      <small>Prioridad: {task.priority}</small>
      <div className="card-actions">
        <select
          value={task.status}
          onChange={(e) => onMove(task.id, e.target.value)}
        >
          {COLUMNS.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <button onClick={() => onRemove(task.id)}>Eliminar</button>
      </div>
    </article>
  );
}
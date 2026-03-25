import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask, updateTaskLocally } from "@/store/tasksSlice";
import { TaskCard } from "./TaskCard";

const columns = [
  { id: "todo", label: "Pending", color: "border-t-slate-500" },
  { id: "in_progress", label: "Work in Progress", color: "border-t-blue-500" },
  { id: "done", label: "Completed", color: "border-t-emerald-500" },
];

export const KanbanBoard = ({ tasks, filter }) => {
  const dispatch = useDispatch();
  const [draggedId, setDraggedId] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id); // REQUIRED for HTML5 DnD
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, statusId) => {
    e.preventDefault();
    
    // Get dragged item ID
    const droppedId = draggedId || e.dataTransfer.getData("text/plain");
    if (!droppedId) return;

    const task = tasks.find((t) => t.id === droppedId);
    if (!task) return;

    const isDone = statusId === "done";

    // Only update if it actually changed
    if (task.status !== statusId || task.completed !== isDone) {
      // 1. Optimistic UI update (Instant feedback)
      dispatch(updateTaskLocally({ taskId: droppedId, updates: { status: statusId, completed: isDone } }));
      
      // 2. Server API sync
      dispatch(updateTask({ id: droppedId, updates: { status: statusId, completed: isDone } }));
    }
    setDraggedId(null);
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 min-h-[60vh] snap-x pt-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => {
          let s = t.status || "todo";
          if (s === "in_review") s = "in_progress"; // Fallback for deprecated column
          // Backwards compatibility for old tasks created before the status field existed
          if (t.completed && s !== "done") s = "done";
          if (!t.completed && s === "done") s = "todo";
          return s === col.id;
        });

        return (
           <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="flex-shrink-0 w-80 glass-card bg-muted/10 border-t-[4px] p-4 flex flex-col gap-4 rounded-3xl snap-center"
            style={{ borderTopColor: "rgba(0,0,0,0)" }} // Will use tailwind class
          >
            <div className={`border-t-[4px] ${col.color} absolute top-0 left-0 right-0 h-0`} />
            <div className="flex items-center justify-between font-black uppercase tracking-widest text-sm text-muted-foreground px-2">
              {col.label}
              <span className="bg-background px-2 py-0.5 rounded-full text-xs shrink-0 shadow-inner">
                {colTasks.length}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {colTasks.map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, t.id)}
                  className="cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform duration-300"
                >
                  <TaskCard
                    task={t}
                    onToggleComplete={() => {
                       const newStatus = !t.completed ? "done" : "todo";
                       dispatch(updateTask({ id: t.id, updates: { completed: !t.completed, status: newStatus } }));
                    }}
                    onDelete={() => {}} // Disabled inside Kanban for safety, or wrap in confirm
                    hideDelete={true}
                  />
                </div>
              ))}
              {colTasks.length === 0 && (
                <div className="flex-1 border-2 border-dashed border-border/40 rounded-2xl flex items-center justify-center p-8 text-muted-foreground text-xs font-bold uppercase tracking-widest text-center opacity-50">
                  Drop Here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

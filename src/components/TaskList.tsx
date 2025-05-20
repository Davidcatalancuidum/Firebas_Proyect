
"use client";

import React from 'react';
import type { Task } from '@/types/task';
import type { Worker } from '@/types/worker';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  workers: Worker[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onReorderTasks: (draggedId: string, targetId: string) => void;
}

export default function TaskList({ tasks, workers, onToggleComplete, onDeleteTask, onReorderTasks }: TaskListProps) {
  const [draggedItemId, setDraggedItemId] = React.useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id); 
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (draggedItemId && draggedItemId !== targetId) {
      onReorderTasks(draggedItemId, targetId);
    }
    setDraggedItemId(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p className="text-lg">Aún no hay tareas. ¡Añade una nueva tarea para empezar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {tasks.sort((a, b) => a.order - b.order).map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          workers={workers}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}

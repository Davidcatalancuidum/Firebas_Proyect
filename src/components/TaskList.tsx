"use client";

import type React from 'react';
import type { Task } from '@/types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onReorderTasks: (draggedId: string, targetId: string) => void;
}

export default function TaskList({ tasks, onToggleComplete, onDeleteTask, onReorderTasks }: TaskListProps) {
  const [draggedItemId, setDraggedItemId] = React.useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id); // Necessary for Firefox
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
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
        <p className="text-lg">No tasks yet. Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-0"> {/* Remove space-y-4 if TaskItem has mb */}
      {tasks.sort((a, b) => a.order - b.order).map((task) => (
        <TaskItem
          key={task.id}
          task={task}
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

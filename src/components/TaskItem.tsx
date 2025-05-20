"use client";

import type React from 'react';
import type { Task } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Trash2, UserCircle2 } from 'lucide-react'; // Added UserCircle2
import { Button } from './ui/button';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetId: string) => void;
}

export default function TaskItem({ 
  task, 
  onToggleComplete, 
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop
}: TaskItemProps) {
  return (
    <Card 
      draggable 
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task.id)}
      className="mb-3 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-grab active:cursor-grabbing"
      data-testid={`task-item-${task.id}`}
    >
      <CardContent className="p-4 flex items-start space-x-4"> {/* Changed items-center to items-start for better layout with assignee */}
        <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" aria-hidden="true" /> {/* Added mt-1 for alignment */}
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          aria-labelledby={`task-name-${task.id}`}
          className="mt-1 flex-shrink-0" // Added mt-1 for alignment
        />
        <div className="flex-grow">
          <label
            htmlFor={`task-${task.id}`}
            id={`task-name-${task.id}`}
            className={`text-base ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
          >
            {task.name}
          </label>
          
          {task.assignedTo && (
            <div className="mt-1.5 flex items-center text-xs text-muted-foreground">
              <UserCircle2 className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span>Asignado a: {task.assignedTo}</span>
            </div>
          )}

          {task.tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {task.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDeleteTask(task.id)}
          aria-label={`Eliminar tarea ${task.name}`} // Translated
          className="flex-shrink-0"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardContent>
    </Card>
  );
}

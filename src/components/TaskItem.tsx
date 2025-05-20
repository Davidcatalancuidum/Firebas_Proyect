
"use client";

import type React from 'react';
import type { Task } from '@/types/task';
import type { Worker } from '@/types/worker';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Trash2, UserCircle2, Tag, CalendarDays } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface TaskItemProps {
  task: Task;
  workers: Worker[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetId: string) => void;
}

export default function TaskItem({ 
  task, 
  workers,
  onToggleComplete, 
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop
}: TaskItemProps) {
  
  const assignedWorker = task.assignedToId ? workers.find(w => w.id === task.assignedToId) : null;

  const formattedDueDate = task.dueDate 
    ? format(parseISO(task.dueDate), "dd MMM yyyy", { locale: es }) 
    : null;

  return (
    <Card 
      draggable 
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task.id)}
      className={cn(
        "mb-3 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-grab active:cursor-grabbing bg-card",
        task.completed && "bg-card/60 opacity-70"
      )}
      data-testid={`task-item-${task.id}`}
    >
      <CardContent className="p-4 flex items-start space-x-3">
        <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1.5" aria-hidden="true" />
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          aria-labelledby={`task-name-${task.id}`}
          className="mt-1.5 flex-shrink-0"
        />
        <div className="flex-grow space-y-1.5">
          <label
            htmlFor={`task-${task.id}`}
            id={`task-name-${task.id}`}
            className={`text-base font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
          >
            {task.name}
          </label>
          
          {assignedWorker && (
            <div className="flex items-center text-xs text-muted-foreground">
              <UserCircle2 className="h-4 w-4 mr-1.5 flex-shrink-0 text-primary" />
              <span>{assignedWorker.name} <span className="text-muted-foreground/70">({assignedWorker.department})</span></span>
            </div>
          )}

          {formattedDueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-1.5 flex-shrink-0 text-accent" />
              <span>Vence: {formattedDueDate}</span>
            </div>
          )}

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center mt-1">
              <Tag className="h-3.5 w-3.5 text-muted-foreground/80"/>
              {task.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5">
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
          aria-label={`Eliminar tarea ${task.name}`}
          className="flex-shrink-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

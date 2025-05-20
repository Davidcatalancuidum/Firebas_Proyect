"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Task } from '@/types/task';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { useToast } from "@/hooks/use-toast";
import { ListChecks } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'diaMaestroTasks';

export default function DiaMaestroPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from local storage:", error);
      toast({
        title: "Error Loading Tasks",
        description: "Could not load tasks from your browser's storage.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to local storage:", error);
        toast({
          title: "Error Saving Tasks",
          description: "Could not save tasks to your browser's storage.",
          variant: "destructive",
        });
      }
    }
  }, [tasks, isMounted, toast]);

  const handleAddTask = useCallback((name: string, tags: string[]) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      name,
      tags,
      completed: false,
      order: tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) + 1 : 0,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    toast({
      title: "Task Added",
      description: `"${name}" has been added to your list.`,
    });
  }, [tasks, toast]);

  const handleToggleComplete = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);
  
  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    toast({
      title: "Task Deleted",
      description: "The task has been removed.",
      variant: "destructive"
    });
  }, [toast]);


  const handleReorderTasks = useCallback((draggedId: string, targetId: string) => {
    setTasks(prevTasks => {
      const draggedTaskIndex = prevTasks.findIndex(task => task.id === draggedId);
      const targetTaskIndex = prevTasks.findIndex(task => task.id === targetId);

      if (draggedTaskIndex === -1 || targetTaskIndex === -1) return prevTasks;

      const newTasks = [...prevTasks];
      const [draggedTask] = newTasks.splice(draggedTaskIndex, 1);
      
      // Adjust index if dragged item was before target in the original array
      const adjustedTargetIndex = draggedTaskIndex < targetTaskIndex ? targetTaskIndex -1 : targetTaskIndex;
      
      newTasks.splice(adjustedTargetIndex, 0, draggedTask);

      // Update order property
      return newTasks.map((task, index) => ({ ...task, order: index }));
    });
  }, []);

  if (!isMounted) {
    // You can return a loading spinner or a simplified layout here
    // to avoid hydration mismatches if localStorage access is too slow.
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ListChecks className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-3xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center justify-center">
          <ListChecks className="h-10 w-10 mr-3 text-primary" />
          Día Maestro
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          Master your day, one task at a time.
        </p>
      </header>

      <main>
        <TaskForm onAddTask={handleAddTask} />
        <TaskList 
          tasks={tasks} 
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
          onReorderTasks={handleReorderTasks} 
        />
      </main>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Día Maestro. Crafted with care.</p>
      </footer>
    </div>
  );
}

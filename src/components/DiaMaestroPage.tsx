
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Task } from '@/types/task';
import type { Worker } from '@/types/worker';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Navbar from './Navbar';
import { useToast } from "@/hooks/use-toast";
import { ListChecks } from 'lucide-react';

const LOCAL_STORAGE_KEY_TASKS = 'diaMaestroTasks';
const LOCAL_STORAGE_KEY_WORKERS = 'diaMaestroWorkers';


export default function DiaMaestroPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
      const storedWorkers = localStorage.getItem(LOCAL_STORAGE_KEY_WORKERS);
      if (storedWorkers) {
        setWorkers(JSON.parse(storedWorkers));
      }
    } catch (error) {
      console.error("Error al cargar datos del almacenamiento local:", error);
      toast({
        title: "Error al Cargar Datos",
        description: "No se pudieron cargar los datos del almacenamiento de tu navegador.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_TASKS, JSON.stringify(tasks));
      } catch (error) {
        console.error("Error al guardar tareas en el almacenamiento local:", error);
        toast({
          title: "Error al Guardar Tareas",
          description: "No se pudieron guardar las tareas en el almacenamiento de tu navegador.",
          variant: "destructive",
        });
      }
    }
  }, [tasks, isMounted, toast]);
  
  // Note: Workers are managed on their own page, so we don't save them from here.
  // We only load them for use in task assignment.

  const handleAddTask = useCallback((name: string, tags: string[], assignedToId?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      name,
      tags,
      completed: false,
      order: tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) + 1 : 0,
      assignedToId: assignedToId || undefined,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);

    let assignedMessagePart = '';
    if (assignedToId) {
      const worker = workers.find(w => w.id === assignedToId);
      if (worker) {
        assignedMessagePart = ` y asignada a ${worker.name}`;
      } else {
        assignedMessagePart = ` (asignación pendiente de trabajador)`;
      }
    }

    toast({
      title: "Tarea Añadida",
      description: `"${name}" ha sido añadida a tu lista${assignedMessagePart}.`,
    });
  }, [tasks, workers, toast]); // Added workers to dependency array

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
      title: "Tarea Eliminada",
      description: "La tarea ha sido eliminada.",
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
      
      const adjustedTargetIndex = draggedTaskIndex < targetTaskIndex ? targetTaskIndex -1 : targetTaskIndex;
      
      newTasks.splice(adjustedTargetIndex, 0, draggedTask);

      return newTasks.map((task, index) => ({ ...task, order: index }));
    });
  }, []);

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ListChecks className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center justify-center">
            <ListChecks className="h-10 w-10 mr-3 text-primary" />
            Día Maestro
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            Domina tu día, una tarea a la vez.
          </p>
        </header>

        <main>
          <TaskForm onAddTask={handleAddTask} workers={workers} />
          <TaskList 
            tasks={tasks}
            workers={workers}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onReorderTasks={handleReorderTasks} 
          />
        </main>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Día Maestro. Hecho con esmero.</p>
        </footer>
      </div>
    </>
  );
}

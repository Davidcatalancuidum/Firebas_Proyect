
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Task } from '@/types/task';
import type { Worker } from '@/types/worker';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { useToast } from "@/hooks/use-toast";
import { ListChecks, CalendarDays as CalendarDaysIconLucide, CheckCircle, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';

const LOCAL_STORAGE_KEY_TASKS = 'diaMaestroTasks';
const LOCAL_STORAGE_KEY_WORKERS = 'diaMaestroWorkers';


export default function DiaMaestroPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [hoveredDayInfo, setHoveredDayInfo] = useState<{ date: Date; tasks: Task[] } | null>(null);


  useEffect(() => {
    setIsMounted(true);
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks) as Task[];
        setTasks(parsedTasks.map(task => ({
          ...task,
          dueDate: task.dueDate ? task.dueDate : undefined,
        })));
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
  
  const handleAddTask = useCallback((name: string, tags: string[], assignedToId?: string, dueDate?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      name,
      tags,
      completed: false,
      order: tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) + 1 : 0,
      assignedToId: assignedToId || undefined,
      dueDate: dueDate || undefined,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);

    let messageParts = [];
    if (assignedToId) {
      const worker = workers.find(w => w.id === assignedToId);
      if (worker) {
        messageParts.push(`asignada a ${worker.name}`);
      }
    }
    if (dueDate) {
      messageParts.push(`con fecha de vencimiento ${format(parseISO(dueDate), "PPP", { locale: es })}`);
    }

    const additionalInfo = messageParts.length > 0 ? ` (${messageParts.join(', ')})` : '';

    toast({
      title: "Tarea Añadida",
      description: `"${name}" ha sido añadida a tu lista${additionalInfo}.`,
    });
  }, [tasks, workers, toast]);

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

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  const taskDueDates = useMemo(() => {
    return tasks
      .filter(task => task.dueDate)
      .map(task => parseISO(task.dueDate!));
  }, [tasks]);

  const handleDayMouseEnter = useCallback((day: Date) => {
    if (!day || !isMounted) return;
    const formattedHoverDate = format(day, 'yyyy-MM-dd');
    const tasksForDay = tasks.filter(task => task.dueDate === formattedHoverDate);
    setHoveredDayInfo({ date: day, tasks: tasksForDay });
  }, [tasks, isMounted]);

  const handleDayMouseLeave = useCallback(() => {
    if (!isMounted) return;
    setHoveredDayInfo(null);
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <ListChecks className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card className="lg:col-span-1 xl:col-span-1">
        <CardHeader className="pb-2">
          <CardDescription className="text-sm font-medium">Total Tareas</CardDescription>
          <CardTitle className="text-4xl">{tasks.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
             {completedTasks} completadas, {pendingTasks} pendientes
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1 xl:col-span-1">
        <CardHeader className="pb-2">
          <CardDescription className="text-sm font-medium">Tareas Completadas</CardDescription>
          <CardTitle className="text-4xl">{completedTasks}</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="text-xs text-muted-foreground">
            +{tasks.length > 0 ? Math.round((completedTasks/tasks.length)*100) : 0}% del total
          </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-1 xl:col-span-1">
        <CardHeader className="pb-2">
          <CardDescription className="text-sm font-medium">Tareas Pendientes</CardDescription>
          <CardTitle className="text-4xl">{pendingTasks}</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="text-xs text-muted-foreground">
             Mantén el ritmo
          </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-1 xl:col-span-1">
        <CardHeader className="pb-2">
          <CardDescription className="text-sm font-medium">Trabajadores Activos</CardDescription>
          <CardTitle className="text-4xl">{workers.length}</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="text-xs text-muted-foreground">
            Gestiona tu equipo
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-2 xl:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarDaysIconLucide className="mr-2 h-6 w-6 text-primary" />
            Calendario
          </CardTitle>
          <CardDescription>Vista general del mes. Pasa el ratón sobre un día para ver sus tareas.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-2 sm:p-4">
          <Calendar
            mode="single"
            selected={calendarDate}
            onSelect={setCalendarDate}
            className="rounded-md border bg-card"
            locale={es}
            modifiers={{ hasTasks: taskDueDates }}
            modifiersClassNames={{
              hasTasks: 'day-with-tasks-indicator',
            }}
            disabled={(date) => date < new Date("1900-01-01") || date > new Date("2300-12-31")}
            onDayMouseEnter={handleDayMouseEnter}
            onDayMouseLeave={handleDayMouseLeave}
          />
          {hoveredDayInfo && isMounted && (
            <div className="mt-4 pt-4 border-t w-full text-left">
              <h4 className="font-semibold mb-2 text-sm text-foreground">
                Tareas para el {format(hoveredDayInfo.date, "PPP", { locale: es })}:
              </h4>
              {hoveredDayInfo.tasks.length > 0 ? (
                <ul className="space-y-1">
                  {hoveredDayInfo.tasks.map(task => (
                    <li key={task.id} className="text-xs text-muted-foreground flex items-center">
                       <ListChecks size={14} className="mr-2 text-primary flex-shrink-0"/> 
                       {task.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {hoveredDayInfo.date.toDateString() === new Date().toDateString()
                    ? "No hay tareas para hoy."
                    : "No hay tareas para este día."}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
        <TaskForm onAddTask={handleAddTask} workers={workers} />
      </div>
      
      <Card className="md:col-span-2 lg:col-span-3 xl:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListChecks className="mr-2 h-6 w-6 text-primary" />
            Lista de Tareas
          </CardTitle>
          <CardDescription>Arrastra para reordenar tus tareas.</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskList 
            tasks={tasks}
            workers={workers}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onReorderTasks={handleReorderTasks} 
          />
        </CardContent>
      </Card>
    </div>
  );
}


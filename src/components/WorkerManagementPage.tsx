
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Worker } from '@/types/worker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PlusCircle, Users, Building, Trash2, UserX } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const LOCAL_STORAGE_KEY_WORKERS = 'diaMaestroWorkers';

const workerFormSchema = z.object({
  name: z.string().min(1, 'El nombre del trabajador es obligatorio.'),
  department: z.string().min(1, 'El departamento es obligatorio.'),
});

type WorkerFormData = z.infer<typeof workerFormSchema>;

interface WorkersByDepartment {
  [department: string]: Worker[];
}

export default function WorkerManagementPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<WorkerFormData>({
    resolver: zodResolver(workerFormSchema),
  });

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedWorkers = localStorage.getItem(LOCAL_STORAGE_KEY_WORKERS);
      if (storedWorkers) {
        setWorkers(JSON.parse(storedWorkers));
      }
    } catch (error) {
      console.error("Error al cargar trabajadores:", error);
      toast({
        title: "Error al Cargar Trabajadores",
        description: "No se pudieron cargar los datos de los trabajadores.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_WORKERS, JSON.stringify(workers));
      } catch (error) {
        console.error("Error al guardar trabajadores:", error);
        toast({
          title: "Error al Guardar Trabajadores",
          description: "No se pudieron guardar los datos de los trabajadores.",
          variant: "destructive",
        });
      }
    }
  }, [workers, isMounted, toast]);

  const handleAddWorker: SubmitHandler<WorkerFormData> = useCallback((data) => {
    const newWorkerId = 'worker-' + Date.now().toString(36) + Math.random().toString(36).substring(2);
    const newWorker: Worker = {
      id: newWorkerId,
      name: data.name,
      department: data.department,
    };
    setWorkers(prevWorkers => [...prevWorkers, newWorker]);
    toast({
      title: "Trabajador Añadido",
      description: `${data.name} del departamento ${data.department} ha sido añadido.`,
    });
    reset();
  }, [reset, toast]);

  const handleDeleteWorker = useCallback((workerId: string) => {
    const workerToDelete = workers.find(w => w.id === workerId);
    setWorkers(prevWorkers => prevWorkers.filter(worker => worker.id !== workerId));
    toast({
      title: "Trabajador Eliminado",
      description: `${workerToDelete?.name || 'El trabajador'} ha sido eliminado. Las tareas previamente asignadas no se reasignarán automáticamente.`,
      variant: "destructive",
    });
  }, [workers, toast]);


  const workersByDepartment: WorkersByDepartment = workers.reduce((acc, worker) => {
    const { department } = worker;
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(worker);
    return acc;
  }, {} as WorkersByDepartment);

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]"> {/* Adjust height for header */}
        <Users className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <PlusCircle className="mr-2 h-6 w-6 text-primary" />
              Añadir Nuevo Trabajador
            </CardTitle>
             <CardDescription>
              Completa los datos para registrar un nuevo miembro del equipo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleAddWorker)} className="space-y-4">
              <div>
                <Label htmlFor="workerName" className="block text-sm font-medium mb-1">Nombre del Trabajador</Label>
                <Input
                  id="workerName"
                  {...register('name')}
                  placeholder="Ej., Ana Pérez"
                  className="text-base"
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="department" className="block text-sm font-medium mb-1">Departamento</Label>
                <Input
                  id="department"
                  {...register('department')}
                  placeholder="Ej., Ventas, Marketing, Desarrollo"
                  className="text-base"
                  aria-invalid={errors.department ? "true" : "false"}
                />
                {errors.department && <p className="text-sm text-destructive mt-1">{errors.department.message}</p>}
              </div>
              <Button type="submit" className="w-full sm:w-auto text-base py-2.5 px-6">
                <PlusCircle className="mr-2 h-5 w-5" /> Añadir Trabajador
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Building className="mr-2 h-6 w-6 text-primary" />
              Lista de Trabajadores
            </CardTitle>
             <CardDescription>
                {workers.length === 0 ? "Aún no hay trabajadores. Añade uno para empezar." : "Trabajadores agrupados por departamento."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workers.length > 0 ? (
              <Accordion type="multiple" className="w-full space-y-2">
                {Object.entries(workersByDepartment).sort((a,b) => a[0].localeCompare(b[0])).map(([department, deptWorkers]) => (
                  <AccordionItem value={department} key={department} className="bg-card-foreground/5 rounded-md border px-2">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline py-3 px-4 text-foreground">
                        <div className="flex items-center">
                            <Building size={20} className="mr-3 text-primary"/>
                            {department} ({deptWorkers.length})
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0 pb-3 px-4">
                      <ul className="space-y-2">
                        {deptWorkers.sort((a,b) => a.name.localeCompare(b.name)).map(worker => (
                          <li key={worker.id} className="flex justify-between items-center p-3 rounded-md hover:bg-accent/10">
                            <span className="text-sm text-foreground">{worker.name}</span>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteWorker(worker.id)} aria-label={`Eliminar ${worker.name}`}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              !isMounted ? 
                <p className="text-muted-foreground">Cargando trabajadores...</p> :
                <div className="text-center py-6">
                    <UserX className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay trabajadores registrados.</p>
                    <p className="text-sm text-muted-foreground">Añade un trabajador usando el formulario de la izquierda.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


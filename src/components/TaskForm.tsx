
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Worker } from '@/types/worker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { PlusCircle, Sparkles, Loader2, Users, Tag, CalendarIcon } from 'lucide-react';
import { suggestTaskCategory, type SuggestTaskCategoryInput } from '@/ai/flows/suggest-task-category';
import { Badge } from './ui/badge';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


const taskFormSchema = z.object({
  name: z.string().min(1, 'El nombre de la tarea es obligatorio'),
  tags: z.string().optional(),
  assignedToId: z.string().optional(),
  dueDate: z.date().optional(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onAddTask: (name: string, tags: string[], assignedToId?: string, dueDate?: string) => void;
  workers: Worker[];
}

const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};

export default function TaskForm({ onAddTask, workers }: TaskFormProps) {
  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: '',
      tags: '',
      assignedToId: undefined,
      dueDate: undefined,
    }
  });
  const { toast } = useToast();
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const taskName = watch('name');

  const fetchSuggestions = useCallback(async (name: string) => {
    if (name.trim().length < 3) {
      setSuggestedCategories([]);
      return;
    }
    setIsSuggesting(true);
    try {
      const input: SuggestTaskCategoryInput = { taskName: name };
      const result = await suggestTaskCategory(input);
      setSuggestedCategories(result.categorySuggestions || []);
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
      toast({
        title: "Error de Sugerencia IA",
        description: "No se pudieron obtener sugerencias de etiquetas.",
        variant: "destructive",
      });
      setSuggestedCategories([]);
    } finally {
      setIsSuggesting(false);
    }
  }, [toast]);

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), [fetchSuggestions]);

  useEffect(() => {
    if (taskName) {
      debouncedFetchSuggestions(taskName);
    } else {
      setSuggestedCategories([]);
    }
  }, [taskName, debouncedFetchSuggestions]);

  const onSubmit: SubmitHandler<TaskFormData> = (data) => {
    const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    const dueDateString = data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : undefined;
    onAddTask(data.name, tagsArray, data.assignedToId, dueDateString);
    reset(); 
    setSuggestedCategories([]);
  };

  const addSuggestedTag = (tag: string) => {
    const currentTags = watch('tags') || '';
    const tagsArray = currentTags.split(',').map(t => t.trim()).filter(t => t);
    if (!tagsArray.includes(tag)) {
      setValue('tags', [...tagsArray, tag].join(', '));
    }
  };

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <PlusCircle className="mr-2 h-6 w-6 text-primary" />
          Añadir Nueva Tarea
        </CardTitle>
        <CardDescription>Planifica tu próximo movimiento.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium mb-1">Nombre de la Tarea</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ej., Comprar víveres"
              className="text-base"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            
            {isSuggesting && (
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando sugerencias IA...
              </div>
            )}
            {!isSuggesting && suggestedCategories.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1 flex items-center">
                  <Sparkles className="h-3 w-3 mr-1 text-primary" />
                  Sugerencias IA (Etiquetas):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedCategories.map((cat, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      onClick={() => addSuggestedTag(cat)}
                      className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && addSuggestedTag(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="tags" className="block text-sm font-medium mb-1">
                <Tag className="inline h-4 w-4 mr-1.5 text-muted-foreground"/>
                Etiquetas (separadas por comas)
            </Label>
            <Input
              id="tags"
              {...register('tags')}
              placeholder="Ej., trabajo, personal, urgente"
              className="text-base"
            />
          </div>

          <div>
            <Label htmlFor="assignedToId" className="block text-sm font-medium mb-1">
                <Users className="inline h-4 w-4 mr-1.5 text-muted-foreground"/>
                Asignar a
            </Label>
            <Controller
                name="assignedToId"
                control={control}
                render={({ field }) => (
                    <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!isClient || workers.length === 0}
                    >
                        <SelectTrigger className="w-full text-base">
                            <SelectValue placeholder={
                                !isClient ? "Cargando..." :
                                workers.length === 0 ? "No hay trabajadores disponibles" :
                                "Seleccionar trabajador"
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            {isClient && workers.length > 0 ? workers.map(worker => (
                                <SelectItem key={worker.id} value={worker.id}>
                                    {worker.name} ({worker.department})
                                </SelectItem>
                            )) : (
                              isClient && <SelectItem value="no-workers" disabled>No hay trabajadores para asignar</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                )}
            />
            {errors.assignedToId && <p className="text-sm text-destructive mt-1">{errors.assignedToId.message}</p>}
          </div>

          <div>
            <Label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                <CalendarIcon className="inline h-4 w-4 mr-1.5 text-muted-foreground"/>
                Fecha de Vencimiento
            </Label>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal text-base",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dueDate && <p className="text-sm text-destructive mt-1">{errors.dueDate.message}</p>}
          </div>

          <Button type="submit" className="w-full sm:w-auto text-base py-2.5 px-6">
            <PlusCircle className="mr-2 h-5 w-5" /> Añadir Tarea
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

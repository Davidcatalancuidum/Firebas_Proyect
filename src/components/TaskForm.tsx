
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Worker } from '@/types/worker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Sparkles, Loader2, Users } from 'lucide-react';
import { suggestTaskCategory, type SuggestTaskCategoryInput } from '@/ai/flows/suggest-task-category';
import { Badge } from './ui/badge';
import { useToast } from "@/hooks/use-toast";

const taskFormSchema = z.object({
  name: z.string().min(1, 'El nombre de la tarea es obligatorio'),
  tags: z.string().optional(),
  assignedToId: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onAddTask: (name: string, tags: string[], assignedToId?: string) => void;
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
    onAddTask(data.name, tagsArray, data.assignedToId);
    reset(); // Resets to defaultValues
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
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <PlusCircle className="mr-2 h-6 w-6 text-primary" />
          Añadir Nueva Tarea
        </CardTitle>
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
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
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
                <div className="flex flex-wrap gap-2">
                  {suggestedCategories.map((cat, index) => (
                    <Badge
                      key={index}
                      variant="outline"
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
            <Label htmlFor="tags" className="block text-sm font-medium mb-1">Etiquetas (separadas por comas)</Label>
            <Input
              id="tags"
              {...register('tags')}
              placeholder="Ej., trabajo, personal, urgente"
              className="text-base"
            />
          </div>

          <div>
            <Label htmlFor="assignedToId" className="block text-sm font-medium mb-1">Asignar a</Label>
            <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-muted-foreground" />
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
            </div>
            {errors.assignedToId && <p className="text-sm text-destructive mt-1">{errors.assignedToId.message}</p>}
          </div>


          <Button type="submit" className="w-full sm:w-auto text-base py-2.5 px-6">
            <PlusCircle className="mr-2 h-5 w-5" /> Añadir Tarea
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Sparkles, Loader2 } from 'lucide-react';
import { suggestTaskCategory, type SuggestTaskCategoryInput } from '@/ai/flows/suggest-task-category';
import { Badge } from './ui/badge';
import { useToast } from "@/hooks/use-toast";

const taskFormSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  tags: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onAddTask: (name: string, tags: string[]) => void;
}

// Debounce function
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

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
  });
  const { toast } = useToast();
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

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
      console.error('Error fetching suggestions:', error);
      toast({
        title: "AI Suggestion Error",
        description: "Could not fetch tag suggestions.",
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
    onAddTask(data.name, tagsArray);
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
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <PlusCircle className="mr-2 h-6 w-6 text-primary" />
          Add New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium mb-1">Task Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="E.g., Buy groceries"
              className="text-base"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            
            {isSuggesting && (
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating AI suggestions...
              </div>
            )}
            {!isSuggesting && suggestedCategories.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1 flex items-center">
                  <Sparkles className="h-3 w-3 mr-1 text-primary" />
                  AI Suggestions:
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
            <Label htmlFor="tags" className="block text-sm font-medium mb-1">Tags (comma-separated)</Label>
            <Input
              id="tags"
              {...register('tags')}
              placeholder="E.g., work, personal, urgent"
              className="text-base"
            />
          </div>

          <Button type="submit" className="w-full sm:w-auto text-base py-2.5 px-6">
            <PlusCircle className="mr-2 h-5 w-5" /> Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

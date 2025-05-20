
export interface Task {
  id: string;
  name: string;
  tags: string[];
  completed: boolean;
  order: number;
  assignedToId?: string; // ID of the worker
  dueDate?: string; // Fecha de vencimiento, formato YYYY-MM-DD
}

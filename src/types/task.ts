export interface Task {
  id: string;
  name: string;
  tags: string[];
  completed: boolean;
  order: number;
  assignedTo?: string; // Added field for assignee
}

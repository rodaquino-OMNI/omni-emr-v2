
// Add this new file to ensure TaskFilter is properly defined

export interface TaskFilter {
  status?: string;
  priority?: string;
  type?: string;
  searchTerm?: string;
  assignedTo?: string;
  dueDate?: string;
  sector?: string;
}

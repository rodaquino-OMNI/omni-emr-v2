import { Task, TaskPriority, TaskStatus, TaskType } from "@/components/tasks/TaskCard";

// Generate a set of mock tasks
const generateMockTasks = (): Task[] => {
  const sectors = ["Cardiology", "Neurology", "Oncology", "Pediatrics", "Emergency", "ICU"];
  const taskTypes: TaskType[] = ["medication", "examination", "consultation", "procedure", "followup"];
  const priorities: TaskPriority[] = ["low", "medium", "high", "urgent"];
  const statuses: TaskStatus[] = ["pending", "completed", "cancelled"];
  
  const mockTasks: Task[] = [];

  // Current date and time
  const now = new Date();
  
  // Generate 30 tasks
  for (let i = 1; i <= 30; i++) {
    // Random date within +/- 3 days from now
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 7) - 3);
    
    // For some tasks, set them in the past to simulate delayed tasks
    if (i % 4 === 0) {
      dueDate.setDate(dueDate.getDate() - 2);
    }
    
    const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    const patientId = Math.floor(Math.random() * 10 + 1).toString();
    const patientName = `Patient ${patientId}`;
    
    let title = "";
    switch (taskType) {
      case "medication":
        title = `Administer ${["Amoxicillin", "Ibuprofen", "Paracetamol", "Insulin", "Morphine"][Math.floor(Math.random() * 5)]}`;
        break;
      case "examination":
        title = `Perform ${["Blood Test", "MRI Scan", "X-Ray", "ECG", "Ultrasound"][Math.floor(Math.random() * 5)]}`;
        break;
      case "consultation":
        title = `Doctor visit for ${["checkup", "symptoms", "follow-up", "evaluation", "assessment"][Math.floor(Math.random() * 5)]}`;
        break;
      case "procedure":
        title = `Perform ${["IV Insertion", "Wound Dressing", "Blood Pressure Check", "Vaccination", "Temperature Measurement"][Math.floor(Math.random() * 5)]}`;
        break;
      case "followup":
        title = `Follow up on ${["medication effects", "treatment progress", "symptom changes", "test results", "recovery"][Math.floor(Math.random() * 5)]}`;
        break;
    }
    
    mockTasks.push({
      id: `task-${i}`,
      title,
      type: taskType,
      dueDate: dueDate.toISOString(),
      patientId,
      patientName,
      sector,
      priority,
      status,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    });
  }
  
  return mockTasks;
};

// Mock data
let mockTasks = generateMockTasks();

// Get all tasks
export const getAllTasks = async (): Promise<Task[]> => {
  return [...mockTasks];
};

// Get a task by ID
export const getTaskById = async (id: string): Promise<Task | undefined> => {
  return mockTasks.find(task => task.id === id);
};

// Get tasks by patient ID
export const getTasksByPatient = async (patientId: string): Promise<Task[]> => {
  return mockTasks.filter(task => task.patientId === patientId);
};

// Get tasks by sector
export const getTasksBySector = async (sector: string): Promise<Task[]> => {
  return mockTasks.filter(task => task.sector === sector);
};

// Update task status
export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task | undefined> => {
  const taskIndex = mockTasks.findIndex(task => task.id === id);
  if (taskIndex >= 0) {
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      status,
      updatedAt: new Date().toISOString(),
    };
    return mockTasks[taskIndex];
  }
  return undefined;
};

// Filter tasks by multiple criteria
export interface TaskFilter {
  patientId?: string;
  sector?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: TaskType;
  showDelayed?: boolean;
}

export const filterTasks = async (filter: TaskFilter): Promise<Task[]> => {
  let filteredTasks = [...mockTasks];
  
  if (filter.patientId) {
    filteredTasks = filteredTasks.filter(task => task.patientId === filter.patientId);
  }
  
  if (filter.sector) {
    filteredTasks = filteredTasks.filter(task => task.sector === filter.sector);
  }
  
  if (filter.status) {
    filteredTasks = filteredTasks.filter(task => task.status === filter.status);
  }
  
  if (filter.priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === filter.priority);
  }
  
  if (filter.type) {
    filteredTasks = filteredTasks.filter(task => task.type === filter.type);
  }
  
  if (filter.showDelayed) {
    const now = new Date();
    filteredTasks = filteredTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < now && task.status === 'pending';
    });
  }
  
  // Sort by due date (ascending)
  filteredTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  return filteredTasks;
};

// Update a task's status with completion information
export const completeTask = async (
  taskId: string, 
  userId: string, 
  userName: string, 
  notes?: string
): Promise<Task | undefined> => {
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  if (taskIndex >= 0) {
    const now = new Date().toISOString();
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      status: 'completed',
      completedAt: now,
      completedBy: userId,
      completedByName: userName,
      completionNotes: notes,
      updatedAt: now,
    };
    return mockTasks[taskIndex];
  }
  return undefined;
};

// Get all completed tasks
export const getCompletedTasks = async (): Promise<Task[]> => {
  return mockTasks.filter(task => task.status === 'completed');
};

// Get completed tasks by user ID
export const getCompletedTasksByUser = async (userId: string): Promise<Task[]> => {
  return mockTasks.filter(task => task.status === 'completed' && task.completedBy === userId);
};

// Get completion statistics for tasks
export const getTaskCompletionStats = async (): Promise<{
  total: number;
  completed: number;
  pending: number;
  delayed: number;
  completionRate: number;
}> => {
  const now = new Date();
  
  const total = mockTasks.length;
  const completed = mockTasks.filter(task => task.status === 'completed').length;
  const pending = mockTasks.filter(task => task.status === 'pending').length;
  
  // Delayed tasks are pending tasks with a due date in the past
  const delayed = mockTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return task.status === 'pending' && dueDate < now;
  }).length;
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return {
    total,
    completed,
    pending,
    delayed,
    completionRate
  };
};

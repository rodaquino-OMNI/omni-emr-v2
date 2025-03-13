
import { Task, TaskStatus } from "@/components/tasks/card/TaskCardTypes";
import { mockTasks } from "./mockTasks";

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

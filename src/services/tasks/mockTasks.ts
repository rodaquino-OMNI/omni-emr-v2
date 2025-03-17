
import { Task } from "@/components/tasks/card/TaskCardTypes";

// Sample mock tasks for development
export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Record vital signs",
    description: "Regular vital signs check - temperature, blood pressure, heart rate, respiratory rate",
    type: "examination",
    dueDate: new Date(new Date().getTime() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
    patientId: "1",
    patientName: "Ana Silva",
    sector: "general_ward",
    priority: "medium",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Administer Lisinopril 10mg",
    description: "Oral medication for hypertension",
    type: "medication",
    dueDate: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    patientId: "1",
    patientName: "Ana Silva",
    sector: "general_ward",
    priority: "high",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Change wound dressing",
    description: "Clean wound and apply new sterile dressing",
    type: "procedure",
    dueDate: new Date(new Date().getTime() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    patientId: "1",
    patientName: "Ana Silva",
    sector: "general_ward",
    priority: "medium",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Coordinate physical therapy session",
    description: "Arrange room and equipment for PT session",
    type: "consultation",
    dueDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    patientId: "1",
    patientName: "Ana Silva",
    sector: "general_ward",
    priority: "low",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Administer insulin",
    description: "Check blood glucose level first",
    type: "medication",
    dueDate: new Date(new Date().getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago (delayed)
    patientId: "1",
    patientName: "Ana Silva",
    sector: "general_ward",
    priority: "urgent",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "6",
    title: "Patient education - diabetes management",
    description: "Review diet and medication routine with patient",
    type: "consultation",
    dueDate: new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    patientId: "1",
    patientName: "Ana Silva",
    sector: "general_ward",
    priority: "medium",
    status: "completed",
    createdAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // yesterday
    updatedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    completedBy: "nurse-id-1",
    completedByName: "Nurse Maria"
  }
];

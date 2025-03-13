
import { Task, TaskPriority, TaskStatus, TaskType } from "@/components/tasks/card/TaskCardTypes";

// Generate a set of mock tasks
export const generateMockTasks = (): Task[] => {
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

// Initialize mock data
export const mockTasks = generateMockTasks();

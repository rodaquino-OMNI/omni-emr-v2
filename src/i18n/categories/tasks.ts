
export type TasksTranslationKey =
  | 'tasks'
  | 'allTasks'
  | 'taskType'
  | 'dueDate'
  | 'sector'
  | 'priority'
  | 'delayed'
  | 'onTime'
  | 'filterBy'
  | 'clearFilters'
  | 'markAsComplete'
  | 'taskDetails'
  | 'completed'
  | 'completedBy'
  | 'completedAt'
  | 'viewTaskDetails'
  | 'completeTask'
  | 'completeTaskDescription'
  | 'completionNotes'
  | 'enterCompletionNotes'
  | 'completing'
  | 'noTasksFound'
  | 'total'
  | 'pending';

export const tasksTranslations = {
  pt: {
    tasks: 'Tarefas',
    allTasks: 'Todas as Tarefas',
    taskType: 'Tipo de Tarefa',
    dueDate: 'Data de Vencimento',
    sector: 'Setor',
    priority: 'Prioridade',
    delayed: 'Atrasado',
    onTime: 'Em Dia',
    filterBy: 'Filtrar por',
    clearFilters: 'Limpar Filtros',
    markAsComplete: 'Marcar como Concluído',
    taskDetails: 'Detalhes da Tarefa',
    completed: 'Concluído',
    completedBy: 'Concluído por',
    completedAt: 'Concluído em',
    viewTaskDetails: 'Ver detalhes da tarefa',
    completeTask: 'Concluir tarefa',
    completeTaskDescription: 'Preencha as informações abaixo para marcar esta tarefa como concluída',
    completionNotes: 'Notas de conclusão',
    enterCompletionNotes: 'Digite notas sobre a conclusão desta tarefa',
    completing: 'Concluindo',
    noTasksFound: 'Nenhuma tarefa encontrada',
    total: 'Total',
    pending: 'Pendente'
  },
  en: {
    tasks: 'Tasks',
    allTasks: 'All Tasks',
    taskType: 'Task Type',
    dueDate: 'Due Date',
    sector: 'Sector',
    priority: 'Priority',
    delayed: 'Delayed',
    onTime: 'On Time',
    filterBy: 'Filter By',
    clearFilters: 'Clear Filters',
    markAsComplete: 'Mark as Complete',
    taskDetails: 'Task Details',
    completed: 'Completed',
    completedBy: 'Completed by',
    completedAt: 'Completed at',
    viewTaskDetails: 'View task details',
    completeTask: 'Complete task',
    completeTaskDescription: 'Fill in the information below to mark this task as complete',
    completionNotes: 'Completion notes',
    enterCompletionNotes: 'Enter notes about completing this task',
    completing: 'Completing',
    noTasksFound: 'No tasks found',
    total: 'Total',
    pending: 'Pending'
  }
};

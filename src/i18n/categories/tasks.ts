
export type TasksTranslationKey =
  | 'newTask'
  | 'assignTask'
  | 'completeTask'
  | 'reassignTask'
  | 'myTasks'
  | 'allTasks'
  | 'taskCreated'
  | 'taskUpdated'
  | 'taskCompleted'
  | 'taskCancelled'
  | 'taskAssigned'
  | 'taskDeleted'
  | 'lowPriority'
  | 'mediumPriority'
  | 'highPriority'
  | 'urgentPriority'
  | 'dueSoon'
  | 'overdueTask'
  | 'onTrack'
  | 'completionNotes'
  | 'markAsComplete'
  | 'reopenTask'
  | 'cancelTask'
  | 'taskActions'
  | 'completeTaskDescription'
  | 'enterCompletionNotes'
  | 'completing';

export const tasksTranslations = {
  pt: {
    newTask: 'Nova Tarefa',
    assignTask: 'Atribuir Tarefa',
    completeTask: 'Concluir Tarefa',
    reassignTask: 'Reatribuir Tarefa',
    myTasks: 'Minhas Tarefas',
    allTasks: 'Todas as Tarefas',
    taskCreated: 'Tarefa Criada',
    taskUpdated: 'Tarefa Atualizada',
    taskCompleted: 'Tarefa Concluída',
    taskCancelled: 'Tarefa Cancelada',
    taskAssigned: 'Tarefa Atribuída',
    taskDeleted: 'Tarefa Excluída',
    lowPriority: 'Prioridade Baixa',
    mediumPriority: 'Prioridade Média',
    highPriority: 'Prioridade Alta',
    urgentPriority: 'Prioridade Urgente',
    dueSoon: 'A Vencer em Breve',
    overdueTask: 'Tarefa Atrasada',
    onTrack: 'Em dia',
    completionNotes: 'Notas de Conclusão',
    markAsComplete: 'Marcar como Concluída',
    reopenTask: 'Reabrir Tarefa',
    cancelTask: 'Cancelar Tarefa',
    taskActions: 'Ações da Tarefa',
    completeTaskDescription: 'Adicione notas sobre a conclusão desta tarefa',
    enterCompletionNotes: 'Insira notas sobre a conclusão',
    completing: 'Concluindo'
  },
  en: {
    newTask: 'New Task',
    assignTask: 'Assign Task',
    completeTask: 'Complete Task',
    reassignTask: 'Reassign Task',
    myTasks: 'My Tasks',
    allTasks: 'All Tasks',
    taskCreated: 'Task Created',
    taskUpdated: 'Task Updated',
    taskCompleted: 'Task Completed',
    taskCancelled: 'Task Cancelled',
    taskAssigned: 'Task Assigned',
    taskDeleted: 'Task Deleted',
    lowPriority: 'Low Priority',
    mediumPriority: 'Medium Priority',
    highPriority: 'High Priority',
    urgentPriority: 'Urgent Priority',
    dueSoon: 'Due Soon',
    overdueTask: 'Overdue Task',
    onTrack: 'On Track',
    completionNotes: 'Completion Notes',
    markAsComplete: 'Mark as Complete',
    reopenTask: 'Reopen Task',
    cancelTask: 'Cancel Task',
    taskActions: 'Task Actions',
    completeTaskDescription: 'Add notes about the completion of this task',
    enterCompletionNotes: 'Enter completion notes',
    completing: 'Completing'
  }
};

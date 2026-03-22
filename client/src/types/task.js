export const getTaskStatus = (task) => {
  if (task.completed) return 'completed';
  if (new Date(task.deadline) < new Date()) return 'overdue';
  return 'pending';
};

export const PRIORITIES = ['low', 'medium', 'high', 'critical'];

export const priorityConfig = {
  low: {
    label: 'Low',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500',
  },
  high: {
    label: 'High',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    dot: 'bg-orange-500',
  },
  critical: {
    label: 'Critical',
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/30',
    dot: 'bg-destructive',
  },
};

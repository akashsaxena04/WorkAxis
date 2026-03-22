import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
} from "lucide-react";

export const TaskStats = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;
  const overdue = tasks.filter(
    t => !t.completed && new Date(t.deadline) < new Date()
  ).length;

  const stats = [
    { 
      label: "Total Tasks", 
      value: total, 
      icon: ListTodo,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-600/10 dark:bg-blue-400/10",
      border: "border-blue-600/20 dark:border-blue-400/20",
      shadow: "hover:shadow-blue-600/20 dark:hover:shadow-blue-400/20",
      gradient: "from-blue-600/10 dark:from-blue-400/10 to-transparent"
    },
    { 
      label: "Completed", 
      value: completed, 
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-600/10 dark:bg-emerald-400/10",
      border: "border-emerald-600/20 dark:border-emerald-400/20",
      shadow: "hover:shadow-emerald-600/20 dark:hover:shadow-emerald-400/20",
      gradient: "from-emerald-600/10 dark:from-emerald-400/10 to-transparent"
    },
    { 
      label: "Pending", 
      value: pending, 
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-600/10 dark:bg-amber-400/10",
      border: "border-amber-600/20 dark:border-amber-400/20",
      shadow: "hover:shadow-amber-600/20 dark:hover:shadow-amber-400/20",
      gradient: "from-amber-600/10 dark:from-amber-400/10 to-transparent"
    },
    { 
      label: "Overdue", 
      value: overdue, 
      icon: AlertTriangle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-600/10 dark:bg-rose-400/10",
      border: "border-rose-600/20 dark:border-rose-400/20",
      shadow: "hover:shadow-rose-600/20 dark:hover:shadow-rose-400/20",
      gradient: "from-rose-600/10 dark:from-rose-400/10 to-transparent"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div
          key={item.label}
          className={`relative overflow-hidden group rounded-2xl p-6 glass-card border flex flex-col items-center justify-center gap-4 transition-all duration-300 ${item.border} ${item.shadow}`}
        >
          {/* Subtle gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-50 dark:opacity-20 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

          <div className={`p-4 rounded-xl ${item.bg} ${item.color} relative z-10 ring-1 ring-inset ${item.border} group-hover:scale-110 transition-transform duration-300`}>
            <item.icon className="h-7 w-7" />
          </div>

          <div className="text-center relative z-10 space-y-1">
            <p className="text-4xl font-black text-foreground tracking-tight drop-shadow-sm">
              {item.value}
            </p>
            <p className={`text-xs font-bold uppercase tracking-[0.2em] ${item.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
              {item.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
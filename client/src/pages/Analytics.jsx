import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { selectUser } from "@/store/authSlice";
import { fetchTasks, selectAllTasks } from "@/store/tasksSlice";
import { getTaskStatus } from "@/types/task";

import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  TrendingUp,
  Users,
  CalendarDays,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = {
  completed: "hsl(142, 76%, 36%)",
  pending: "hsl(38, 92%, 50%)",
  overdue: "hsl(0, 84%, 60%)",
};

const Analytics = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const tasks = useSelector(selectAllTasks);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!user || user.role !== "employer") {
      navigate("/dashboard");
      return;
    }
    dispatch(fetchTasks());
  }, [user, navigate, dispatch]);

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    const completed = tasks.filter((t) => getTaskStatus(t) === "completed");
    const pending = tasks.filter((t) => getTaskStatus(t) === "pending");
    const overdue = tasks.filter((t) => getTaskStatus(t) === "overdue");

    const completionRate =
      tasks.length > 0
        ? Math.round((completed.length / tasks.length) * 100)
        : 0;

    const assigneeMap = {};
    tasks.forEach((t) => {
      const key =
        t.assignType === "company"
          ? "Whole Company"
          : t.assigneeEmail || "Unassigned";

      if (!assigneeMap[key])
        assigneeMap[key] = { total: 0, completed: 0 };

      assigneeMap[key].total += 1;
      if (t.completed) assigneeMap[key].completed += 1;
    });

    const byAssignee = Object.entries(assigneeMap).map(
      ([name, data]) => ({
        name: name.length > 20 ? name.slice(0, 18) + "…" : name,
        total: data.total,
        completed: data.completed,
      })
    );

    const dayMap = {};
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { weekday: "short" });
      dayMap[key] = 0;
    }

    tasks.forEach((t) => {
      const d = new Date(t.createdAt);
      const key = d.toLocaleDateString("en-US", { weekday: "short" });
      if (key in dayMap) dayMap[key] += 1;
    });

    const byDay = Object.entries(dayMap).map(([day, count]) => ({
      day,
      count,
    }));

    return {
      total: tasks.length,
      completed: completed.length,
      pending: pending.length,
      overdue: overdue.length,
      completionRate,
      byAssignee,
      byDay,
      pieData: [
        { name: "Completed", value: completed.length, color: COLORS.completed },
        { name: "Pending", value: pending.length, color: COLORS.pending },
        { name: "Overdue", value: overdue.length, color: COLORS.overdue },
      ].filter((d) => d.value > 0),
    };
  }, [tasks]);

  if (!user) return null;

  const summaryCards = [
    { label: "Total Tasks", value: stats.total, icon: ListTodo },
    { label: "Completed", value: stats.completed, icon: CheckCircle2 },
    { label: "Pending", value: stats.pending, icon: Clock },
    { label: "Overdue", value: stats.overdue, icon: AlertTriangle },
    {
      label: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
    },
    { label: "Assignees", value: stats.byAssignee.length, icon: Users },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card !rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-2xl !bg-background/90 !backdrop-blur-xl z-50">
          <p className="font-bold text-foreground mb-3 text-lg border-b border-border/50 pb-2">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: entry.color || entry.fill || "var(--primary)" }} />
                <span className="text-muted-foreground font-medium capitalize">{entry.name}:</span>
                <span className="font-extrabold text-foreground">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background text-foreground transition-colors duration-500">
      {/* Decorative background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ===== NAVBAR ===== */}
      <header className="border-b bg-background/60 backdrop-blur-xl sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="group rounded-full hover:bg-primary/10 transition-colors"
              onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </Button>

            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
              <BarChart3 className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Analytics</h1>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
                Performance Overview
              </p>
            </div>
          </div>
          <DarkModeToggle />
        </div>
      </header>

      {/* ===== CONTENT ===== */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 space-y-10 relative z-10">

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {summaryCards.map((item) => (
            <Card
              key={item.label}
              className="p-5 text-center glass-card border flex flex-col items-center justify-center gap-3 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="p-3 rounded-xl bg-primary/10 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="h-6 w-6" />
              </div>
              <div className="relative z-10 space-y-1">
                <p className="text-3xl font-black text-foreground tracking-tight drop-shadow-sm">{item.value}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  {item.label}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* CHARTS ROW */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* PIE CHART */}
          <Card className="p-7 glass-card border relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-50 pointer-events-none" />
            <h3 className="font-bold text-lg mb-6 flex gap-3 items-center relative z-10">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                <BarChart3 size={20}/>
              </div>
              Task Distribution
            </h3>

            <div className="relative z-10 w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {stats.pieData.map((e, i) => (
                      <linearGradient key={`grad-${i}`} id={`pieGrad-${i}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={e.color} stopOpacity={0.8}/>
                        <stop offset="100%" stopColor={e.color} stopOpacity={1}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie 
                    data={stats.pieData} 
                    dataKey="value"
                    innerRadius={70} 
                    outerRadius={110}
                    paddingAngle={5}
                    stroke="none"
                  >
                    {stats.pieData.map((e,i)=>(
                      <Cell key={i} fill={`url(#pieGrad-${i})`} 
                            className="hover:opacity-80 transition-opacity duration-300 drop-shadow-md cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px", fontWeight: "600", fontSize: "14px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* ASSIGNEE BAR CHART */}
          <Card className="p-7 glass-card border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 to-transparent opacity-50 pointer-events-none" />
            <h3 className="font-bold text-lg mb-6 flex gap-3 items-center relative z-10">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Users size={20}/>
              </div>
              Tasks by Assignee
            </h3>

            <div className="relative z-10 w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byAssignee} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradBlue" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="barGradGreen" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={COLORS.completed} stopOpacity={0.8}/>
                      <stop offset="100%" stopColor={COLORS.completed} stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <XAxis type="number" stroke="currentColor" className="text-muted-foreground text-xs font-semibold" tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" width={110} stroke="currentColor" className="text-muted-foreground text-xs font-semibold" tickLine={false} axisLine={false}/>
                  <Tooltip cursor={{fill: 'var(--primary)', opacity: 0.05}} content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px", fontWeight: "600", fontSize: "14px" }} />
                  <Bar dataKey="total" name="Total Assigned" fill="url(#barGradBlue)" radius={[0, 6, 6, 0]} barSize={16} />
                  <Bar dataKey="completed" name="Completed" fill="url(#barGradGreen)" radius={[0, 6, 6, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* LAST 7 DAYS BAR CHART */}
        <Card className="p-7 glass-card border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-50 pointer-events-none" />
          <h3 className="font-bold text-lg mb-6 flex gap-3 items-center relative z-10">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <CalendarDays size={20}/>
            </div>
            Tasks Created (Last 7 Days)
          </h3>

          <div className="relative z-10 w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1}/>
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="currentColor" className="text-muted-foreground text-xs font-semibold" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="currentColor" className="text-muted-foreground text-xs font-semibold" tickLine={false} axisLine={false} tickFormatter={(v) => Math.round(v)} />
                <Tooltip cursor={{fill: 'hsl(var(--primary))', opacity: 0.05}} content={<CustomTooltip />} />
                <Bar dataKey="count" name="Created Tasks" fill="url(#barGradPrimary)" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </main>
    </div>
  );
};

export default Analytics;
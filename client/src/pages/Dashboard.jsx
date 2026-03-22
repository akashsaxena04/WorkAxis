import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTaskStatus } from "@/types/task";

import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { TaskStats } from "@/components/TaskStats";
import { TaskFilters } from "@/components/TaskFilters";
import { NotificationBell } from "@/components/NotificationBell";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { InactivityWarning } from "@/components/InactivityWarning";
import { InviteModal } from "@/components/InviteModal";

import { io } from "socket.io-client";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import { usePermissions } from "@/hooks/usePermissions";

import {
  ClipboardList,
  LogOut,
  BarChart3,
  UserCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  selectAllTasks,
  fetchTasks,
  createTask,
  toggleTask,
  deleteTask,
  setTasks,
  optimisticToggle,
  optimisticDelete,
  updateTaskLocally,
} from "@/store/tasksSlice";

import { selectUser, logout } from "@/store/authSlice";

import {
  selectFilter,
  selectInactivitySeconds,
  setFilter,
  setInactivitySeconds,
} from "@/store/uiSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const tasks = useSelector(selectAllTasks);
  const filter = useSelector(selectFilter);
  const inactivitySeconds = useSelector(selectInactivitySeconds);

  const permissions = usePermissions(user);

  /* ================= INIT ================= */
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(setInactivitySeconds(null));
    dispatch(fetchTasks());
  }, [user, navigate, dispatch]);

  /* ================= AUTO LOGOUT ================= */
  useAutoLogout(
    useCallback(() => {
      dispatch(logout());
      navigate("/login");
      toast.error("Logged out due to inactivity");
    }, [dispatch, navigate]),
    (sec) => dispatch(setInactivitySeconds(sec)),
    15 * 60 * 1000
  );

  /* ================= SOCKET.IO REAL-TIME UPDATES ================= */
  useEffect(() => {
    if (!user) return;
    
    // Connect to the backend socket server
    const socketUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, "") : "http://127.0.0.1:5000";
    const socket = io(socketUrl);

    socket.on("connect", () => console.log("Socket connected:", socket.id));
    
    // When the server notifies us of a change, refetch instantly
    socket.on("tasks_changed", () => {
      dispatch(fetchTasks());
    });

    return () => {
      socket.disconnect();
    };
  }, [user, dispatch]);

  /* ================= EMPLOYER NOTIFICATIONS ================= */
  // Ref to track prev task state so we can detect *newly* completed tasks
  const prevTasksRef = useRef(tasks);

  useEffect(() => {
    if (user?.role === "employee") {
      const prevTasks = prevTasksRef.current || [];
      
      // Look for tasks that are new (not in prevTasks)
      tasks.forEach((currentTask) => {
        const prevTask = prevTasks.find((t) => t.id === currentTask.id);
        if (!prevTask && !currentTask.completed) {
          toast("You've been assigned a new task", {
            description: currentTask.title,
            icon: "🔔"
          });
        }
      });
    }

    if (user?.role === "employer") {
      const prevTasks = prevTasksRef.current || [];

      // Look for tasks that are completed now but weren't in the previous render
      tasks.forEach((currentTask) => {
        const prevTask = prevTasks.find((t) => t.id === currentTask.id);
        if (currentTask.completed && (!prevTask || !prevTask.completed)) {
          const wasOptimisticallyToggled = currentTask._optimistic;
          if (!wasOptimisticallyToggled) {
            toast.success(`Task Completed: ${currentTask.title} was just marked as completed!`);
          }
        }
      });
    }

    // Always update ref for next comparison
    prevTasksRef.current = tasks;
  }, [tasks, user?.role]);

  /* ================= CREATE TASK ================= */
  const handleAddTask = async (title, description, deadline, assignment) => {
    const result = await dispatch(
      createTask({
        title,
        description,
        deadline,
        assignType: assignment.assignType,
        assigneeEmail: assignment.assigneeEmail,
        priority: assignment.priority || "medium",
      })
    );

    if (createTask.rejected.match(result)) {
      toast.error("Failed to create task");
    }
  };

  const handleToggleComplete = async (id) => {
    dispatch(optimisticToggle(id));
    await dispatch(toggleTask(id));
  };

  const handleDeleteTask = async (id) => {
    dispatch(optimisticDelete(id));
    await dispatch(deleteTask(id));
  };

  // Filter based on the global filter
  const filteredTasks = tasks.filter((task) =>
    filter === "all" ? true : getTaskStatus(task) === filter
  );

  // Separate tasks into pending and completed
  const pendingTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">

      <InactivityWarning
        secondsLeft={inactivitySeconds}
        onStayActive={() => dispatch(setInactivitySeconds(null))}
      />

      {/* NAVBAR */}
      <header className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <ClipboardList />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                WorkAxis
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.name} • {user.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DarkModeToggle />

            {user.role === "employer" && <InviteModal />}

            {permissions.canViewAnalytics && (
              <Button variant="ghost" size="icon" onClick={() => navigate("/analytics")}>
                <BarChart3 />
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
              <UserCircle />
            </Button>

            <NotificationBell tasks={tasks} />

            <Button variant="ghost" size="icon" onClick={() => dispatch(logout())}>
              <LogOut />
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 px-4 py-10">
        <div className="max-w-6xl mx-auto space-y-10">

          <TaskStats tasks={tasks} />

          {permissions.canCreateTask && (
            <div className="mb-8">
              <TaskForm onAddTask={handleAddTask} />
            </div>
          )}

          {/* ====== DYNAMIC TASK VIEW ====== */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-2xl shadow-sm border">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 flex items-center gap-2">
                {filter === "pending" && <ClipboardList className="text-amber-500 h-6 w-6" />}
                {filter === "completed" && <CheckCircle2 className="text-emerald-500 h-6 w-6" />}
                {filter === "overdue" && <AlertTriangle className="text-destructive h-6 w-6" />}
                {filter === "pending" && "Active Tasks"}
                {filter === "completed" && "Completed Tasks"}
                {filter === "overdue" && "Overdue Tasks"}
              </h2>

              <TaskFilters
                activeFilter={filter}
                onFilterChange={(f) => dispatch(setFilter(f))}
              />
            </div>

            {filteredTasks.length === 0 ? (
              <div className="glass-card p-16 text-center animate-fade-in border-dashed border-2">
                <ClipboardList className="mx-auto text-muted-foreground/30 mb-4 transition-transform hover:scale-110" size={64} />
                <p className="text-foreground font-black tracking-tight text-2xl mb-2">
                  No {filter} tasks
                </p>
                <p className="text-muted-foreground text-sm font-medium">
                  {filter === 'completed' ? "Tasks will appear here once they are finished." : "You are completely caught up for now!"}
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t bg-background/50 backdrop-blur-md mt-16">
        <div className="text-center py-8 text-sm text-muted-foreground font-medium">
          WorkAxis • {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
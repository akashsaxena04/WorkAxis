import { useState, useEffect } from "react";
import { Bell, X, CheckCircle2, AlertTriangle, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTaskStatus } from "@/types/task";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";

export const NotificationBell = ({ tasks }) => {
  const user = useSelector(selectUser);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("read-notifications") || "[]");
    } catch {
      return [];
    }
  });
  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("dismissed-notifications") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const notifs = [];

    tasks.forEach((task) => {
      const status = getTaskStatus(task);

      // New task notification (Employee only)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (user?.role === "employee" && new Date(task.createdAt) > oneHourAgo && !task.completed) {
        notifs.push({
          id: `new-${task.id}`,
          type: "new",
          icon: ClipboardList,
          title: "New Task Assigned",
          message: `"${task.title}" has been added`,
          time: new Date(task.createdAt),
          className: "text-primary bg-primary/10",
        });
      }

      // Deadline approaching (within 24 hours)
      if (status === "pending") {
        const hoursLeft = (new Date(task.deadline) - new Date()) / (1000 * 60 * 60);
        if (hoursLeft > 0 && hoursLeft <= 24) {
          notifs.push({
            id: `deadline-${task.id}`,
            type: "deadline",
            icon: AlertTriangle,
            title: "Deadline Approaching",
            message: `"${task.title}" is due in ${Math.round(hoursLeft)} hour${Math.round(hoursLeft) !== 1 ? "s" : ""}`,
            time: new Date(task.deadline),
            className: "text-warning bg-warning/10",
          });
        }
      }

      // Overdue
      if (status === "overdue") {
        notifs.push({
          id: `overdue-${task.id}`,
          type: "overdue",
          icon: AlertTriangle,
          title: "Task Overdue",
          message: `"${task.title}" has passed its deadline`,
          time: new Date(task.deadline),
          className: "text-destructive bg-destructive/10",
        });
      }

      // Completed (Employer only)
      if (user?.role === "employer" && task.completed) {
        notifs.push({
          id: `done-${task.id}`,
          type: "completed",
          icon: CheckCircle2,
          title: "Task Completed",
          message: `"${task.title}" has been marked complete`,
          time: new Date(task.createdAt), // Ideally use task.updatedAt if tracked
          className: "text-success bg-success/10",
        });
      }
    });

    notifs.sort((a, b) => b.time - a.time);
    setNotifications(notifs);
  }, [tasks]);

  const displayNotifs = notifications.filter(n => !dismissedIds.includes(n.id));
  const unreadCount = displayNotifs.filter((n) => !readIds.includes(n.id)).length;

  const markAllRead = () => {
    const allIds = displayNotifs.map((n) => n.id);
    const updated = [...new Set([...readIds, ...allIds])];
    setReadIds(updated);
    localStorage.setItem("read-notifications", JSON.stringify(updated));
  };

  const dismissNotification = (e, id) => {
    e.stopPropagation();
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    localStorage.setItem("dismissed-notifications", JSON.stringify(updated));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5 hover:scale-110 transition-transform duration-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold animate-pulse-glow shadow-lg shadow-destructive/50 ring-2 ring-background">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-[2px] bg-background/20 transition-all duration-300" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-80 md:w-96 glass shadow-2xl shadow-primary/10 rounded-2xl animate-slide-up max-h-[70vh] flex flex-col overflow-hidden border border-white/50 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5">
            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
              <h3 className="font-semibold text-foreground text-gradient">Notifications</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs text-primary">
                  Mark all read
                </Button>
              )}
            </div>

            <div className="overflow-y-auto flex-1">
              {displayNotifs.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No notifications yet
                </div>
              ) : (
                displayNotifs.map((notif) => {
                  const Icon = notif.icon;
                  const isRead = readIds.includes(notif.id);
                  return (
                    <div
                      key={notif.id}
                      className={cn(
                        "flex items-start gap-3 p-3 border-b last:border-0 transition-colors",
                        !isRead && "bg-primary/5"
                      )}
                    >
                      <div className={cn("p-2 rounded-lg shrink-0", notif.className)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-medium text-foreground", isRead && "text-muted-foreground")}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{notif.message}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors rounded-full"
                        onClick={(e) => dismissNotification(e, notif.id)}
                        title="Dismiss notification"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};


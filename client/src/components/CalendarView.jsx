import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CalendarView = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return (
    <div className="glass-card p-6 border-white/20 dark:border-white/10 shadow-2xl animate-fade-in relative z-10 w-full overflow-hidden">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
        <h2 className="text-2xl font-black text-foreground tracking-tight drop-shadow-sm">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="rounded-full shadow-sm hover:scale-105 transition-transform"><ChevronLeft /></Button>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date())} className="rounded-full font-bold px-4 hover:scale-105 transition-transform text-xs uppercase tracking-widest text-primary">Today</Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="rounded-full shadow-sm hover:scale-105 transition-transform"><ChevronRight /></Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center font-black text-xs uppercase tracking-widest text-muted-foreground pb-2">{d}</div>
        ))}
        
        {daysInMonth.map((day, i) => {
          const dayTasks = tasks.filter((t) => t.deadline && isSameDay(new Date(t.deadline), day));

          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[120px] p-2 rounded-2xl border transition-all duration-300 flex flex-col gap-1",
                isToday(day) ? "bg-primary/5 border-primary ring-1 ring-primary/50 shadow-inner" : "bg-muted/10 border-border/50 hover:bg-muted/30"
              )}
              style={i === 0 ? { gridColumnStart: day.getDay() + 1 } : {}}
            >
              <div className={cn("text-right font-bold text-sm px-1", isToday(day) ? "text-primary" : "text-muted-foreground")}>
                {format(day, "d")}
              </div>
              <div className="flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden p-1 custom-scrollbar">
                {dayTasks.map(t => (
                  <div key={t.id} className={cn(
                    "text-[10px] p-1.5 rounded-md font-bold truncate transition-all shadow-sm",
                    t.completed ? "bg-success/20 text-success-foreground line-through opacity-60" : "bg-background text-foreground ring-1 ring-border/50"
                  )}>
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

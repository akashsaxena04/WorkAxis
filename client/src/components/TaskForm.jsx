import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, X, Users, User, Flag } from "lucide-react";
import { toast } from "sonner";
import { PRIORITIES, priorityConfig } from "@/types/task";
import { cn } from "@/lib/utils";

export const TaskForm = ({ onAddTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignType, setAssignType] = useState("company");
  const [assigneeEmail, setAssigneeEmail] = useState("");
  const [priority, setPriority] = useState("medium");
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [recurring, setRecurring] = useState("none");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) { toast.error("Please enter a task title"); return; }
    if (!deadline) { toast.error("Please select a deadline"); return; }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) { toast.error("Please enter a valid deadline"); return; }

    if (assignType === "employee" && !assigneeEmail.trim()) {
      toast.error("Please enter the employee's email"); return;
    }

    if (assignType === "employee") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(assigneeEmail.trim())) {
        toast.error("Please enter a valid email address"); return;
      }
    }

    onAddTask(title.trim(), description.trim(), deadlineDate, {
      assignType,
      assigneeEmail: assignType === "employee" ? assigneeEmail.trim().toLowerCase() : null,
      priority,
      subtasks: subtasks.map((st) => ({ title: st, completed: false })),
      recurring: { frequency: recurring },
    });

    setTitle(""); setDescription(""); setDeadline("");
    setAssignType("company"); setAssigneeEmail(""); setPriority("medium");
    setSubtasks([]); setSubtaskInput(""); setRecurring("none");
    setIsOpen(false);
    toast.success(
      assignType === "company"
        ? "Task assigned to whole company!"
        : `Task assigned to ${assigneeEmail.trim()}`
    );
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full py-6 text-base font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add New Task
      </Button>
    );
  }

  return (
    <Card className="p-8 animate-fade-in glass-card border-white/20 dark:border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <div className="relative flex items-center justify-between mb-8 pb-4 border-b border-border/50">
        <h3 className="text-2xl font-black text-foreground tracking-tight drop-shadow-sm">Create New Task</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Task Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="h-14 bg-background/50 backdrop-blur-md border-border/50 focus-visible:ring-primary/50 text-lg font-medium shadow-inner rounded-xl px-4"
            autoFocus
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add context or detailed instructions..."
            rows={2}
            className="resize-none bg-background/50 backdrop-blur-md border-border/50 focus-visible:ring-primary/50 text-base shadow-inner rounded-xl p-4"
          />
        </div>

        {/* Subtasks */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Subtasks</Label>
          <div className="flex gap-2">
            <Input
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              placeholder="Add a subtask..."
              className="h-10 bg-background/50 flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (subtaskInput.trim()) {
                    setSubtasks([...subtasks, subtaskInput.trim()]);
                    setSubtaskInput("");
                  }
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={() => {
              if (subtaskInput.trim()) {
                setSubtasks([...subtasks, subtaskInput.trim()]);
                setSubtaskInput("");
              }
            }}>Add</Button>
          </div>
          {subtasks.length > 0 && (
            <ul className="text-xs space-y-1">
              {subtasks.map((st, i) => (
                <li key={i} className="flex justify-between items-center bg-muted/40 p-2 rounded-lg">
                  <span>• {st}</span>
                  <button type="button" onClick={() => setSubtasks(subtasks.filter((_, idx) => idx !== i))} className="text-destructive hover:font-bold">X</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Priority */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Flag className="h-3.5 w-3.5" strokeWidth={3} /> Priority <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-4 gap-3">
            {PRIORITIES.map((p) => {
              const cfg = priorityConfig[p];
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "h-12 rounded-xl text-xs font-black uppercase tracking-wider border transition-all duration-300",
                    `${cfg.bg} ${cfg.color} ${cfg.border}`,
                    priority === p
                      ? "shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)] ring-2 ring-current scale-[1.05]"
                      : "opacity-50 hover:opacity-100 hover:scale-[1.02] saturate-50 hover:saturate-100"
                  )}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Assign To */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Assign To <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={assignType === "company" ? "default" : "outline"}
              className="flex-1 h-11"
              onClick={() => { setAssignType("company"); setAssigneeEmail(""); }}
            >
              <Users className="h-4 w-4 mr-2" />
              Whole Company
            </Button>
            <Button
              type="button"
              variant={assignType === "employee" ? "default" : "outline"}
              className="flex-1 h-11"
              onClick={() => setAssignType("employee")}
            >
              <User className="h-4 w-4 mr-2" />
              Specific Employee
            </Button>
          </div>
        </div>

        {assignType === "employee" && (
          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="assigneeEmail" className="text-sm font-medium">
              Employee Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="assigneeEmail"
              type="email"
              value={assigneeEmail}
              onChange={(e) => setAssigneeEmail(e.target.value)}
              placeholder="employee@company.com"
              className="h-11"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Deadline <span className="text-destructive">*</span>
            </Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="h-11"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Repeat</Label>
            <select value={recurring} onChange={(e) => setRecurring(e.target.value)} className="w-full h-11 rounded-lg border border-border/50 bg-background/50 backdrop-blur-md text-sm px-3">
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1 h-11 font-medium">Create Task</Button>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="h-11">Cancel</Button>
        </div>
      </form>
    </Card>
  );
};

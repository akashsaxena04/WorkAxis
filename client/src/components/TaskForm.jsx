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
    });

    setTitle(""); setDescription(""); setDeadline("");
    setAssignType("company"); setAssigneeEmail(""); setPriority("medium");
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
    <Card className="p-7 animate-fade-in glass-card border-primary/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Create New Task</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Task Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            className="h-11"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)..."
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Flag className="h-3.5 w-3.5" /> Priority <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {PRIORITIES.map((p) => {
              const cfg = priorityConfig[p];
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "h-9 rounded-lg text-xs font-semibold border transition-all",
                    `${cfg.bg} ${cfg.color} ${cfg.border}`,
                    priority === p
                      ? "shadow-md ring-1 ring-current scale-[1.02]"
                      : "opacity-60 hover:opacity-100 saturate-50 hover:saturate-100"
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

        <div className="space-y-2">
          <Label htmlFor="deadline" className="text-sm font-medium">
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

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1 h-11 font-medium">Create Task</Button>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="h-11">Cancel</Button>
        </div>
      </form>
    </Card>
  );
};

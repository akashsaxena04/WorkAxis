
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTaskStatus, priorityConfig } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Calendar, Clock, Users, Mail, Flag, MessageSquare, Send, ChevronDown, ChevronUp, X, Repeat, ListTree, PlayCircle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { selectUser } from "@/store/authSlice";
import { addComment, deleteComment } from "@/store/tasksSlice";

const statusStyles = {
  pending: "border-warning/50 shadow-[inset_0px_1px_1px_rgba(var(--warning-rgb),0.3)]",
  completed: "border-success/50 shadow-[inset_0px_1px_1px_rgba(var(--success-rgb),0.3)]",
  overdue: "border-destructive/50 shadow-[inset_0px_1px_1px_rgba(var(--destructive-rgb),0.3)]",
};

const statusBadgeStyles = {
  pending: "status-pending",
  completed: "status-completed",
  overdue: "status-overdue",
};

const statusLabels = {
  pending: "Pending",
  completed: "Completed",
  overdue: "Overdue",
};

export const TaskCard = ({
  task,
  onToggleComplete,
  onDelete,
  hideDelete = false,
  selectable = false,
  selected = false,
  onSelect,
  onTaskUpdate,
}) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const status = getTaskStatus(task);
  const priority = task.priority || "medium";
  const priorityCfg = priorityConfig[priority];
  const [showComments, setShowComments] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const comments = task.comments || [];
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(st => st.completed).length;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const result = await dispatch(
        addComment({
          taskId: task.id,
          comment: {
            text: commentText.trim(),
            authorName: user?.name || "Unknown",
            authorEmail: user?.email || "",
          },
        })
      );
      if (addComment.fulfilled.match(result)) {
        setCommentText("");
        if (onTaskUpdate) onTaskUpdate(task.id, { comments: [...comments, result.payload.comment] });
      } else {
        toast.error(result.payload || "Failed to add comment");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await dispatch(deleteComment({ taskId: task.id, commentId }));
    if (deleteComment.fulfilled.match(result)) {
      if (onTaskUpdate) onTaskUpdate(task.id, { comments: comments.filter((c) => c.id !== commentId) });
    } else {
      toast.error(result.payload || "Failed to delete comment");
    }
  };

  return (
    <Card
      className={cn(
        "p-6 glass-card animate-fade-in transition-all duration-500 hover:shadow-2xl relative overflow-hidden group",
        statusStyles[status],
        task.completed && "opacity-60 saturate-50 hover:opacity-100 hover:saturate-100 backdrop-blur-md",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02]"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-start gap-5">
        <div className="pt-1.5 flex flex-col gap-2 shrink-0">
          {selectable && (
            <Checkbox
              checked={selected}
              onCheckedChange={() => onSelect?.(task.id)}
              className="h-6 w-6 rounded border-2"
            />
          )}
          {!selectable && (
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id)}
              className={cn("h-6 w-6 rounded-full transition-all duration-500 shadow-sm", task.completed && "animate-check-bounce")}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className={cn("font-black text-foreground text-xl tracking-tight leading-tight", task.completed && "line-through text-muted-foreground")}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              <span className={cn("text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-full border flex items-center gap-1.5", priorityCfg.bg, priorityCfg.color, priorityCfg.border)}>
                <Flag className="h-3 w-3" strokeWidth={3} />
                {priorityCfg.label}
              </span>
              <span className={cn("text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-full border shadow-sm", statusBadgeStyles[status])}>
                {statusLabels[status]}
              </span>
            </div>
          </div>

          {task.description && (
            <p className={cn("text-sm text-muted-foreground mb-2 line-clamp-2", task.completed && "line-through")}>
              {task.description}
            </p>
          )}

          {subtasks.length > 0 && (
            <div className="mb-3">
              <div 
                className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground transition-colors"
                onClick={() => setShowSubtasks(!showSubtasks)}
              >
                <ListTree className="h-3 w-3" />
                Subtasks ({completedSubtasks}/{subtasks.length})
                <div className="flex-1 h-1 bg-border/50 rounded-full overflow-hidden ml-2">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(completedSubtasks / subtasks.length) * 100}%` }} />
                </div>
              </div>
              
              {showSubtasks && (
                <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-primary/20 animate-fade-in">
                  {subtasks.map((st, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium">
                      <Checkbox 
                        checked={st.completed} 
                        className="h-3.5 w-3.5" 
                      />
                      <span className={st.completed ? "line-through text-muted-foreground" : "text-foreground"}>{st.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            {task.assignType === "company" ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-accent text-accent-foreground border">
                <Users className="h-3 w-3" /> Whole Company
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                <Mail className="h-3 w-3" /> {task.assigneeEmail}
              </span>
            )}

            {task.recurring && task.recurring.frequency !== "none" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                <Repeat className="h-3 w-3" /> {task.recurring.frequency}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Due: {format(new Date(task.deadline), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {task.completed ? "Completed" : formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="text-muted-foreground hover:text-foreground h-8 px-2 gap-1 text-xs"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                {comments.length > 0 && <span>{comments.length}</span>}
                {showComments ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>

              {!hideDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {showComments && (
            <div className="mt-3 pt-3 border-t space-y-3 animate-fade-in">
              {comments.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2 group">
                      <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {c.authorName?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 bg-muted/40 rounded-lg px-3 py-1.5">
                        <p className="text-xs font-medium text-foreground">{c.authorName}</p>
                        <p className="text-xs text-muted-foreground">{c.text}</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">
                          {format(new Date(c.createdAt), "MMM d, h:mm a")}
                        </p>
                      </div>
                      {c.authorEmail === user?.email && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteComment(c.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-2">No notes yet — be the first!</p>
              )}

              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a note..."
                  className="h-8 text-sm flex-1"
                />
                <Button type="submit" size="sm" disabled={submitting || !commentText.trim()} className="h-8 px-3">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const filters = [
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Overdue", value: "overdue" },
];

export const TaskFilters = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "transition-all",
            activeFilter === filter.value ? "shadow-md" : "hover:bg-secondary"
          )}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

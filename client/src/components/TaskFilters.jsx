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
          size="default"
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "transition-all duration-500 rounded-full font-medium tracking-wide",
            activeFilter === filter.value 
              ? "shadow-lg shadow-primary/30 scale-105" 
              : "hover:bg-secondary hover:scale-105 glass border-transparent opacity-80 hover:opacity-100"
          )}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

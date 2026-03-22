import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export const InactivityWarning = ({ secondsLeft, onStayActive }) => {
  if (secondsLeft === null) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center">
          <AlertTriangle className="h-7 w-7 text-warning" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Session Expiring</h2>
        <p className="text-muted-foreground text-sm">
          You'll be logged out in{" "}
          <span className="font-bold text-foreground text-lg">{secondsLeft}s</span>{" "}
          due to inactivity.
        </p>
        <Button onClick={onStayActive} className="w-full h-11 font-medium">
          Stay Logged In
        </Button>
      </div>
    </div>
  );
};

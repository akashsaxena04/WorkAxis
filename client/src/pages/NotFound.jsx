import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

const NotFound = () => {
  return (
    <div
      className="min-h-screen flex flex-col
                 bg-gray-50 text-gray-900
                 dark:bg-gray-900 dark:text-gray-100
                 transition-colors"
    >
      {/* ===== NAVBAR (same visual system) ===== */}
      <header className="border-b bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600 text-white">
            <ClipboardList className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">WorkAxis</h1>
        </div>
      </header>

      {/* ===== CONTENT ===== */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-6">

          <h1 className="text-7xl font-bold tracking-tight">
            404
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300">
            Oops! The page you’re looking for doesn’t exist.
          </p>

          <Button asChild className="h-11 px-8">
            <Link to="/">Go Home</Link>
          </Button>

        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          WorkAxis • {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
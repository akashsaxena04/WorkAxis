import { Link } from "react-router-dom";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import {
  ClipboardList,
  Users,
  Shield,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
  Bell,
} from "lucide-react";

const features = [
  { icon: Users, title: "Role-Based Access", description: "Control who sees what." },
  { icon: ClipboardList, title: "Smart Assignment", description: "Assign tasks easily." },
  { icon: Clock, title: "Deadline Tracking", description: "Automatic status updates." },
  { icon: Bell, title: "Notifications", description: "Real-time alerts." },
  { icon: BarChart3, title: "Analytics", description: "Track performance." },
  { icon: Shield, title: "Secure", description: "JWT-ready architecture." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">

      {/* NAV */}
      <header className="border-b bg-white dark:bg-gray-800 dark:border-gray-700 sticky top-0">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 font-bold text-xl">
            <ClipboardList />
            WorkAxis
          </div>

          <div className="flex gap-3 items-center">
            <DarkModeToggle />

            <Link
              to="/login"
              className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="px-4 py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-4 py-1 rounded-full mb-6">
            <CheckCircle2 size={16} />
            Task management made simple
          </p>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Organize. Assign.
            <br />
            <span className="text-blue-600">Get Things Done.</span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
            A powerful task management platform for teams with smart deadlines
            and role-based visibility.
          </p>

          <div className="flex justify-center gap-4">
            <Link className="px-8 py-3 bg-blue-600 text-white rounded-xl">
              Create Free Account
            </Link>
            <Link className="px-8 py-3 border rounded-xl dark:border-gray-600">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-4 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md"
            >
              <div className="mb-4 text-blue-600">
                <f.icon />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-600 rounded-3xl p-10 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to streamline your workflow?
            </h2>

            <p className="text-lg max-w-xl mx-auto mb-8 text-blue-100">
              Join now and start assigning tasks to your team in minutes.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100"
            >
              Get Started — It's Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          WorkAxis • {new Date().getFullYear()} • Built for productivity
        </div>
      </footer>

    </div>
  );
}
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
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] pointer-events-none animate-float" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />

      {/* NAV */}
      <header className="fixed w-full z-50 transition-all duration-300 backdrop-blur-3xl bg-background/50 border-b border-border/40">
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
              className="px-5 py-2 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-lg shadow-purple-600/30 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative px-4 pt-40 pb-32 text-center animate-slide-up">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary dark:text-primary-foreground/90 px-5 py-2 rounded-full mb-8 backdrop-blur-sm shadow-xl shadow-primary/10 hover:scale-105 transition-transform duration-300">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="text-sm font-semibold tracking-wide uppercase">Task management reimagined</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black leading-[1.1] mb-8 tracking-tighter">
            Organize. Assign.
            <br />
            <span className="text-gradient">Get Things Done.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl font-medium leading-relaxed">
            Experience the next generation of productivity. A meticulously crafted task management 
            platform designed for teams pushing the boundaries of what's possible.
          </p>

          <div className="flex flex-col justify-center gap-5 w-full max-w-sm mx-auto">
            <Link to="/login" className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:scale-105 hover:bg-purple-700 transition-all duration-300 shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 text-lg">
              Sign In <ArrowRight size={20} />
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
              className="glass p-8 rounded-[2rem] hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group relative overflow-hidden ring-1 ring-border/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                <f.icon strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-foreground tracking-tight">
                {f.title}
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-32 mt-10">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-indigo-600 rounded-[3rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
          <div className="relative bg-gradient-to-br from-primary via-purple-700 to-indigo-900 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden border border-white/20 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mx-20 -my-20" />
            
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white drop-shadow-lg">
              Ready to elevate your workflow?
            </h2>

            <p className="text-xl max-w-2xl mx-auto mb-12 text-primary-foreground/80 font-medium">
              Join thousands of forward-thinking teams already using WorkAxis to orchestrate their success.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-primary rounded-2xl font-black text-lg hover:scale-105 hover:bg-gray-50 transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] w-full sm:w-auto"
            >
              Get Started for Free
              <ArrowRight strokeWidth={3} className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 backdrop-blur-xl bg-background/50">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gradient">
            <ClipboardList className="text-primary" /> WorkAxis
          </div>
          <div className="text-sm font-medium text-muted-foreground/60 tracking-wider uppercase">
            Built for the modern web • {new Date().getFullYear()}
          </div>
        </div>
      </footer>

    </div>
  );
}
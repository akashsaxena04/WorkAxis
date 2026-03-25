import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  selectAuthLoading,
} from "@/store/authSlice";

import { ClipboardList, LogIn } from "lucide-react";
import { toast } from "sonner";
import { DarkModeToggle } from "@/components/DarkModeToggle";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.name}!`);
      navigate("/dashboard");
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 relative">

      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-sm p-8">

        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="p-2 rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/20">
            <ClipboardList className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            WorkAxis
          </h1>
        </div>

        <h2 className="text-xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
          Sign In
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full h-11 px-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex items-center justify-center gap-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition shadow-lg shadow-purple-600/20"
          >
            <LogIn size={18} />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-600 hover:text-purple-700 hover:underline font-bold"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
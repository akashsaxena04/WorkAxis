import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, selectAuthLoading } from "@/store/authSlice";

import { ClipboardList, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { DarkModeToggle } from "@/components/DarkModeToggle";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const [searchParams] = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {
    const defaultEmail = searchParams.get("email");
    const defaultRole = searchParams.get("role");

    if (defaultEmail) setEmail(defaultEmail);
    if (defaultRole === "employee" || defaultRole === "employer") {
      setRole(defaultRole);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !employeeId) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const result = await dispatch(
      registerUser({ name, email, password, role, employeeId })
    );

    if (registerUser.fulfilled.match(result)) {
      toast.success("Registration successful!");
      navigate("/dashboard");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
                    bg-gray-50 text-gray-900
                    dark:bg-gray-900 dark:text-white transition-colors">

      {/* DARK MODE TOGGLE */}
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>

      {/* CARD */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800
                      border border-gray-200 dark:border-gray-700
                      rounded-2xl shadow-sm p-8">

        {/* LOGO */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="p-2 rounded-xl bg-blue-600 text-white">
            <ClipboardList className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">WorkAxis</h1>
        </div>

        <h2 className="text-xl font-semibold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full h-11 px-3 border rounded-lg
                         bg-white text-black border-gray-300
                         dark:bg-gray-700 dark:text-white dark:border-gray-600
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              readOnly={!!searchParams.get("email")}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className={`w-full h-11 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                         ${searchParams.get("email") ? "bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400" : "bg-white text-black dark:bg-gray-700 dark:text-white"}
                         border-gray-300 dark:border-gray-600`}
            />
          </div>

          {/* ROLE SELECTOR */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Role
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole("employee")}
                className={`flex-1 h-11 rounded-lg font-medium transition border ${role === "employee"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-blue-100 text-black border-blue-200 dark:bg-blue-700 dark:text-white dark:border-blue-500"
                  }`}
              >
                Employee
              </button>

              <button
                type="button"
                onClick={() => setRole("employer")}
                className={`flex-1 h-11 rounded-lg font-medium transition border ${role === "employer"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-blue-100 text-black border-blue-200 dark:bg-blue-700 dark:text-white dark:border-blue-500"
                  }`}
              >
                Employer
              </button>
            </div>
          </div>

          {/* ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {role === "employer" ? "Employer ID" : "Employee ID"}
            </label>
            <input
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="EMP-001"
              className="w-full h-11 px-3 border rounded-lg
                         bg-white text-black border-gray-300
                         dark:bg-gray-700 dark:text-white dark:border-gray-600
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full h-11 px-3 border rounded-lg
                         bg-white text-black border-gray-300
                         dark:bg-gray-700 dark:text-white dark:border-gray-600
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="w-full h-11 flex items-center justify-center gap-2
                       bg-blue-600 text-white rounded-lg font-medium
                       hover:bg-blue-700 transition"
          >
            <UserPlus size={18} />
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
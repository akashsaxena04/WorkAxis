import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateProfile, selectAuthLoading } from "@/store/authSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { DarkModeToggle } from "@/components/DarkModeToggle";

import {
  ArrowLeft,
  User,
  Lock,
  Save,
  ClipboardList,
} from "lucide-react";

import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-primary",
  "bg-success",
  "bg-warning",
  "bg-destructive",
  "bg-purple-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-indigo-500",
];

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarColor, setAvatarColor] =
    useState(user?.avatar || AVATAR_COLORS[0]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  /* ===== SAVE PROFILE ===== */
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    const result = await dispatch(
      updateProfile({ name: name.trim(), avatar: avatarColor })
    );

    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(result.payload || "Update failed");
    }
  };

  /* ===== CHANGE PASSWORD ===== */
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (user.password !== currentPassword) {
      toast.error("Current password is incorrect");
      return;
    }

    const result = await dispatch(updateProfile({ password: newPassword }));

    if (updateProfile.fulfilled.match(result)) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully");
    } else {
      toast.error(result.payload || "Password update failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col
                    bg-gray-50 text-gray-900
                    dark:bg-gray-900 dark:text-gray-100
                    transition-colors">

      {/* NAVBAR */}
      <header className="border-b bg-white dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <ClipboardList className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold">Profile Settings</h1>
          </div>

          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-8">

          {/* PROFILE CARD */}
          <Card className="p-6 bg-white dark:bg-gray-800 border dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <div
                className={cn(
                  "h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold text-white",
                  avatarColor
                )}
              >
                {initials || <User className="h-8 w-8" />}
              </div>

              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-medium capitalize mt-1 inline-block">
                  {user.role} • {user.employeeId}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Display Name
                </Label>

                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 bg-white text-gray-900
                             dark:bg-gray-700 dark:text-white
                             dark:border-gray-600
                             placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label>Avatar Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setAvatarColor(color)}
                      className={cn(
                        "h-8 w-8 rounded-full border-2 transition-all",
                        color,
                        avatarColor === color
                          ? "border-white dark:border-gray-200 scale-110 shadow-md"
                          : "border-transparent"
                      )}
                    />
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11">
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </form>
          </Card>

          {/* PASSWORD CARD */}
          <Card className="p-6 bg-white dark:bg-gray-800 border dark:border-gray-700">

            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Change Password
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-4">

              {[{
                value: currentPassword,
                set: setCurrentPassword,
                placeholder: "Current Password"
              },{
                value: newPassword,
                set: setNewPassword,
                placeholder: "New Password"
              },{
                value: confirmPassword,
                set: setConfirmPassword,
                placeholder: "Confirm Password"
              }].map((field, i) => (
                <Input
                  key={i}
                  type="password"
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  placeholder={field.placeholder}
                  className="h-11 bg-white text-gray-900
                             dark:bg-gray-700 dark:text-white
                             dark:border-gray-600
                             placeholder:text-gray-400"
                />
              ))}

              <Button
                type="submit"
                variant="outline"
                disabled={loading}
                className="w-full h-11"
              >
                <Lock className="h-4 w-4 mr-2" />
                Update Password
              </Button>

            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
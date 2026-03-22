import { useMemo } from "react";

/**
 * RBAC permission hook.
 * Returns a permissions object based on user role.
 */
export const usePermissions = (user) => {
  return useMemo(() => {
    if (!user) {
      return {
        canCreateTask: false,
        canDeleteTask: false,
        canAssignTask: false,
        canViewAllTasks: false,
        canViewAnalytics: false,
        canToggleTask: false,
        role: null,
      };
    }

    const isEmployer = user.role === "employer";
    const isEmployee = user.role === "employee";

    return {
      canCreateTask: isEmployer,
      canDeleteTask: isEmployer,
      canAssignTask: isEmployer,
      canViewAllTasks: isEmployer,
      canViewAnalytics: isEmployer,
      canToggleTask: isEmployee || isEmployer,
      role: user.role,
    };
  }, [user]);
};

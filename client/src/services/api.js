// ================= API SERVICE =================

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

/* ================= HELPERS ================= */

const getToken = () => localStorage.getItem("auth-token");

const authFetch = async (endpoint, options = {}) => {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMessage = typeof data === 'string' ? data : (data?.message || data?.error || "Request failed");
    throw new Error(errorMessage);
  }

  return data;
};

/* ================= AUTH API ================= */

export const authAPI = {
  async register({ name, email, password, role, employeeId }) {
    const data = await authFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role, employeeId }),
    });

    // backend should return { user, token }
    localStorage.setItem("current-user", JSON.stringify(data.user));
    localStorage.setItem("auth-token", data.token);

    return { user: data.user };
  },

  async login({ email, password }) {
    const data = await authFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("current-user", JSON.stringify(data.user));
    localStorage.setItem("auth-token", data.token);

    return { user: data.user };
  },

  logout() {
    localStorage.removeItem("current-user");
    localStorage.removeItem("auth-token");
  },

  async inviteUser({ email, role }) {
    return authFetch("/api/auth/invite", {
      method: "POST",
      body: JSON.stringify({ email, role }),
    });
  },

  getCurrentUser() {
    const user = localStorage.getItem("current-user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("auth-token");
  },

  async updateProfile(updates) {
    const data = await authFetch("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });

    localStorage.setItem("current-user", JSON.stringify(data.user));
    return data.user;
  },
};

/* ================= TASK API ================= */

export const taskAPI = {
  async getAll() {
    return authFetch("/api/tasks");
  },

  async create(task) {
    return authFetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
  },

  async update(id, updates) {
    return authFetch(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  async toggleComplete(id) {
    return authFetch(`/api/tasks/${id}/toggle`, {
      method: "PATCH",
    });
  },

  async delete(id) {
    return authFetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  },

  async bulkComplete(ids) {
    return authFetch("/api/tasks/bulk/complete", {
      method: "PATCH",
      body: JSON.stringify({ ids }),
    });
  },

  async bulkDelete(ids) {
    return authFetch("/api/tasks/bulk", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  },

  async addComment(taskId, comment) {
    return authFetch(`/api/tasks/${taskId}/comments`, {
      method: "POST",
      body: JSON.stringify(comment),
    });
  },

  async deleteComment(taskId, commentId) {
    return authFetch(`/api/tasks/${taskId}/comments/${commentId}`, {
      method: "DELETE",
    });
  },
};
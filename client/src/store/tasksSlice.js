import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taskAPI } from "@/services/api";

// ── Async thunks ──────────────────────────────────────────────────────────────

export const fetchTasks = createAsyncThunk(
  "tasks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await taskAPI.getAll();
      return tasks.map(t => ({ ...t, id: t._id || t.id }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData, { rejectWithValue }) => {
    try {
      return await taskAPI.create(taskData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleTask = createAsyncThunk(
  "tasks/toggle",
  async (id, { rejectWithValue }) => {
    try {
      return await taskAPI.toggleComplete(id);
    } catch (err) {
      return rejectWithValue({ id, message: err.message });
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await taskAPI.update(id, updates);
    } catch (err) {
      return rejectWithValue({ id, message: err.message });
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id, { rejectWithValue }) => {
    try {
      await taskAPI.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue({ id, message: err.message });
    }
  }
);

export const bulkCompleteTask = createAsyncThunk(
  "tasks/bulkComplete",
  async (ids, { rejectWithValue }) => {
    try {
      await taskAPI.bulkComplete(ids);
      return ids;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const bulkDeleteTask = createAsyncThunk(
  "tasks/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await taskAPI.bulkDelete(ids);
      return ids;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addComment = createAsyncThunk(
  "tasks/addComment",
  async ({ taskId, comment }, { rejectWithValue }) => {
    try {
      const newComment = await taskAPI.addComment(taskId, comment);
      return { taskId, comment: newComment };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "tasks/deleteComment",
  async ({ taskId, commentId }, { rejectWithValue }) => {
    try {
      await taskAPI.deleteComment(taskId, commentId);
      return { taskId, commentId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Used by the polling hook to sync latest tasks
    setTasks(state, action) {
      state.items = action.payload;
    },
    // Optimistic toggle (immediate UI feedback)
    optimisticToggle(state, action) {
      const task = state.items.find((t) => t.id === action.payload);
      if (task) task.completed = !task.completed;
    },
    // Optimistic delete
    optimisticDelete(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    // Update a single task in-place (e.g. after comment)
    updateTaskLocally(state, action) {
      const { taskId, updates } = action.payload;
      const task = state.items.find((t) => t.id === taskId);
      if (task) Object.assign(task, updates);
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create — add real task, remove optimistic placeholder
    builder.addCase(createTask.fulfilled, (state, action) => {
      const newTask = { ...action.payload, id: action.payload._id || action.payload.id };
      // Remove optimistic entry and add real one at front
      state.items = [newTask, ...state.items.filter((t) => !t._optimistic)];
    });

    // Toggle — sync with server result
    builder.addCase(toggleTask.fulfilled, (state, action) => {
      const updatedTask = { ...action.payload, id: action.payload._id || action.payload.id };
      const idx = state.items.findIndex((t) => t.id === updatedTask.id);
      if (idx !== -1) state.items[idx] = updatedTask;
    });
    builder.addCase(toggleTask.rejected, (state, action) => {
      // Roll back optimistic toggle
      const task = state.items.find((t) => t.id === action.payload?.id);
      if (task) task.completed = !task.completed;
    });

    // General update logic
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const updatedTask = { ...action.payload, id: action.payload._id || action.payload.id };
      const idx = state.items.findIndex((t) => t.id === updatedTask.id);
      if (idx !== -1) state.items[idx] = updatedTask;
    });

    // Bulk complete
    builder.addCase(bulkCompleteTask.fulfilled, (state, action) => {
      action.payload.forEach((id) => {
        const task = state.items.find((t) => t.id === id);
        if (task) task.completed = true;
      });
    });

    // Add comment
    builder.addCase(addComment.fulfilled, (state, action) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.comments = [...(task.comments || []), action.payload.comment];
      }
    });

    // Delete comment
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.comments = (task.comments || []).filter(
          (c) => c.id !== action.payload.commentId
        );
      }
    });
  },
});

export const { setTasks, optimisticToggle, optimisticDelete, updateTaskLocally } = tasksSlice.actions;

// Selectors
export const selectAllTasks = (state) => state.tasks.items;
export const selectTasksLoading = (state) => state.tasks.loading;

export default tasksSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tasksReducer from "./tasksSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Allow non-serializable Date objects (task deadlines, createdAt)
      serializableCheck: {
        ignoredPaths: ["tasks.items"],
        ignoredActionPaths: ["payload", "meta.arg"],
      },
    }),
});

export default store;

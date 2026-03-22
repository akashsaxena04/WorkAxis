import { createSlice } from "@reduxjs/toolkit";

const saved = localStorage.getItem("theme");

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    darkMode: saved === "dark",
    filter: "pending",
    bulkMode: false,
    selectedIds: [],
    inactivitySeconds: null,
  },
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      const isDark = state.darkMode;
      document.documentElement.classList.toggle("dark", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setBulkMode(state, action) {
      state.bulkMode = action.payload;
      if (!action.payload) state.selectedIds = [];
    },
    toggleSelectId(state, action) {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((i) => i !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    clearSelection(state) {
      state.selectedIds = [];
      state.bulkMode = false;
    },
    setInactivitySeconds(state, action) {
      state.inactivitySeconds = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  setFilter,
  setBulkMode,
  toggleSelectId,
  clearSelection,
  setInactivitySeconds,
} = uiSlice.actions;

// Selectors
export const selectDarkMode = (state) => state.ui.darkMode;
export const selectFilter = (state) => state.ui.filter;
export const selectBulkMode = (state) => state.ui.bulkMode;
export const selectSelectedIds = (state) => state.ui.selectedIds;
export const selectInactivitySeconds = (state) => state.ui.inactivitySeconds;

export default uiSlice.reducer;

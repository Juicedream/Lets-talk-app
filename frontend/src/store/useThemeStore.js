import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("letsTalk-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("letsTalk-theme", theme);
    set({ theme })
},
}));



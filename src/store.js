import { create } from "zustand";

export const useStore = create((set) => ({
    isDarkMode: true,
    setIsDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode }))
}))
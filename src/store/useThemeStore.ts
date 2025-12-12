import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create<{
  isDark: boolean;
  toggle: () => void;
}>()(
  persist(
    (set) => ({
      isDark: false,
      toggle: () => set((s) => ({ isDark: !s.isDark })),
    }),
    { name: 'theme-preference' }
  )
);
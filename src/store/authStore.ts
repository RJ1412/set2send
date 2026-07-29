import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  user: any;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: any, accessToken: string) => void;
  clearAuth: () => void;
  setUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
      clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

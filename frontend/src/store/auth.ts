import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  email: string;
  role?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuth: boolean;
  // Actions
  login: (userData: { token: string; user: User }) => void;
  // register: (userData: { msg: string }) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      user: null,
      isAuth: false,

      login: ({ token, user }) =>
        set({
          token,
          user,
          isAuth: true,
        }),

      // register: (userData) =>
      //   set((state) => ({
      //     ...state,
      //     user: {
      //       email: userData.email,
      //       role: userData.role,
      //     },
      //   })),

      logout: () =>
        set({
          token: null,
          user: null,
          isAuth: false,
        }),
    }),
    {
      name: "auth-store",
    },
  ),
);

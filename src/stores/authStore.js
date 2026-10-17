import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    isLoggedIn: false,
    isLoading: true,

    setUser: (user) =>
        set({
            user,
            isLoggedIn: !!user,
            isLoading: false,
        }),
    logout: () => set({
    user: null,
    isLoggedIn: false,
    isLoading: false,
}),
 }));

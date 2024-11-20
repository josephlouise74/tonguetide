import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: string;
    email: string;
    name: string;
    // Add other user properties as needed
}

interface UserState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
    clearStore: () => void;
}

const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            setUser: (user) =>
                set({ user, isAuthenticated: !!user }),
            setToken: (token) =>
                set({ token }),
            logout: () =>
                set({ user: null, token: null, isAuthenticated: false }),
            clearStore: () =>
                set({}, true)
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useUserStore;
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Enhanced UserData interface with readonly properties for security
export interface UserData {
    readonly id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly profileImage?: string;
    readonly createdAt?: string;
    readonly updatedAt?: string;
    readonly role?: 'user' | 'admin';
}

// Add type for API responses
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

// Add new storage key
export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_DATA_KEY = 'user_data';

// Add session management
export const SESSION_EXPIRY_KEY = 'session_expiry';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const authMiddleware = {
    // Store the token
    setToken: async (token: string) => {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    },

    // Get the token
    getToken: async () => {
        return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    },

    // Remove the token
    removeToken: async () => {
        await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    },

    // Check if user is authenticated
    isAuthenticated: async () => {
        const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        return !!token;
    },

    // Redirect based on auth state
    requireAuth: async () => {
        const isAuth = await authMiddleware.isAuthenticated();
        if (!isAuth) {
            router.replace('/SignIn');
        }
    },

    requireGuest: async () => {
        const isAuth = await authMiddleware.isAuthenticated();
        if (isAuth) {
            router.replace('/(tabs)/home');
        }
    },

    // Enhanced setUserData with session management
    setUserData: async (userData: UserData): Promise<ApiResponse<void>> => {
        try {
            const expiryTime = Date.now() + SESSION_DURATION;

            await Promise.all([
                SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData)),
                SecureStore.setItemAsync(SESSION_EXPIRY_KEY, expiryTime.toString())
            ]);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to store user data'
            };
        }
    },

    // Enhanced getUserData with session validation
    getUserData: async (): Promise<ApiResponse<UserData>> => {
        try {
            const [userData, expiryTime] = await Promise.all([
                SecureStore.getItemAsync(USER_DATA_KEY),
                SecureStore.getItemAsync(SESSION_EXPIRY_KEY)
            ]);

            // Check session expiry
            if (expiryTime && Date.now() > parseInt(expiryTime)) {
                await authMiddleware.logout();
                return {
                    success: false,
                    message: 'Session expired'
                };
            }

            if (!userData) {
                return {
                    success: false,
                    message: 'No user data found'
                };
            }

            // Validate data structure
            const parsedData = JSON.parse(userData) as UserData;
            if (!authMiddleware.validateUserData(parsedData)) {
                return {
                    success: false,
                    message: 'Invalid user data format'
                };
            }

            return {
                success: true,
                data: parsedData
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get user data'
            };
        }
    },

    // Add data validation
    validateUserData: (data: any): data is UserData => {
        return (
            typeof data === 'object' &&
            typeof data.id === 'string' &&
            typeof data.email === 'string' &&
            typeof data.firstName === 'string' &&
            typeof data.lastName === 'string'
        );
    },

    // Enhanced updateUserData with validation
    updateUserData: async (updates: Partial<UserData>): Promise<ApiResponse<UserData>> => {
        try {
            const currentData = await authMiddleware.getUserData();
            if (!currentData.success || !currentData.data) {
                throw new Error('No existing user data found');
            }

            const updatedData = { ...currentData.data, ...updates };

            // Validate updated data
            if (!authMiddleware.validateUserData(updatedData)) {
                return {
                    success: false,
                    message: 'Invalid update data format'
                };
            }

            await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(updatedData));
            return { success: true, data: updatedData };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update user data'
            };
        }
    },

    // Enhanced logout with complete cleanup
    logout: async (): Promise<ApiResponse<void>> => {
        try {
            // Clear all auth-related data
            await Promise.all([
                authMiddleware.removeToken(),
                SecureStore.deleteItemAsync(USER_DATA_KEY),
                SecureStore.deleteItemAsync(SESSION_EXPIRY_KEY),
                // Clear any other auth-related keys you might have
                AsyncStorage.removeItem('user-storage'), // Clear Zustand persist storage
            ]);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to logout'
            };
        }
    },
};

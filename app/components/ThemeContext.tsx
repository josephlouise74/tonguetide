import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../src/constants/Colors';
import { Theme, DarkTheme, DefaultTheme } from '@react-navigation/native';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeType;
    isDarkMode: boolean;
    toggleTheme: () => void;
    colors: typeof Colors.light;
    navigationTheme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setTheme] = useState<ThemeType>(systemColorScheme || 'light');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme) {
                setTheme(savedTheme as ThemeType);
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem('theme', newTheme);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    const colors = Colors[theme];

    const navigationTheme: Theme = {
        dark: theme === 'dark',
        colors: Colors[theme].navigation
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                isDarkMode: theme === 'dark',
                toggleTheme,
                colors,
                navigationTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

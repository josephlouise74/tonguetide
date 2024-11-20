import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface LearnedItem {
    id: string;
    word: string;
    definition: string;
    audioUrl?: string;
    dateMarked: string;
    progress?: number;
    lastReviewDate?: string;
}

interface LearnedState {
    learnedItems: LearnedItem[];
    addToLearned: (item: Omit<LearnedItem, 'dateMarked' | 'progress' | 'lastReviewDate'>) => Promise<void>;
    removeFromLearned: (id: string) => Promise<void>;
    isLearned: (id: string) => boolean;
    updateProgress: (id: string, progress: number) => Promise<void>;
    getProgress: (id: string) => number;
}

export const useLearnedItems = create<LearnedState>((set, get) => ({
    learnedItems: [],

    addToLearned: async (item) => {
        if (get().isLearned(item.id)) return;

        const newLearnedItem: LearnedItem = {
            ...item,
            dateMarked: new Date().toISOString(),
            progress: 0,
            lastReviewDate: new Date().toISOString(),
        };

        const updatedItems = [...get().learnedItems, newLearnedItem];
        try {
            await AsyncStorage.setItem('learnedItems', JSON.stringify(updatedItems));
            set({ learnedItems: updatedItems });
        } catch (error) {
            console.error('Error saving learned item:', error);
        }
    },

    removeFromLearned: async (id) => {
        try {
            const updatedItems = get().learnedItems.filter(item => item.id !== id);
            await AsyncStorage.setItem('learnedItems', JSON.stringify(updatedItems));
            set({ learnedItems: updatedItems });
        } catch (error) {
            console.error('Error removing learned item:', error);
        }
    },

    isLearned: (id) => {
        return get().learnedItems.some(item => item.id === id);
    },

    updateProgress: async (id: string, progress: number) => {
        try {
            const updatedItems = get().learnedItems.map(item =>
                item.id === id
                    ? {
                        ...item,
                        progress: Math.min(100, Math.max(0, progress)),
                        lastReviewDate: new Date().toISOString()
                    }
                    : item
            );
            await AsyncStorage.setItem('learnedItems', JSON.stringify(updatedItems));
            set({ learnedItems: updatedItems });
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    },

    getProgress: (id: string) => {
        const item = get().learnedItems.find(item => item.id === id);
        return item?.progress ?? 0;
    },
}));

export const useInitializeLearnedItems = () => {
    useEffect(() => {
        const initializeLearnedItems = async () => {
            try {
                const storedItems = await AsyncStorage.getItem('learnedItems');
                if (storedItems) {
                    useLearnedItems.setState({ learnedItems: JSON.parse(storedItems) });
                }
            } catch (error) {
                console.error('Error loading learned items:', error);
            }
        };

        initializeLearnedItems();
    }, []);
};

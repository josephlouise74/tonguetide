import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Challenge {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    completed: boolean;
}

export default function ChallengeScreen() {
    const [challenges] = useState<Challenge[]>([
        {
            id: '1',
            title: 'Daily Vocabulary',
            description: 'Learn 5 new words today',
            difficulty: 'easy',
            points: 10,
            completed: false,
        },
        {
            id: '2',
            title: 'Grammar Challenge',
            description: 'Complete 3 grammar exercises',
            difficulty: 'medium',
            points: 15,
            completed: false,
        },
        {
            id: '3',
            title: 'Speaking Practice',
            description: 'Record 2 pronunciation exercises',
            difficulty: 'hard',
            points: 20,
            completed: true,
        },
    ]);

    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

    const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
        switch (difficulty) {
            case 'easy':
                return '#4CAF50';
            case 'medium':
                return '#FFA726';
            case 'hard':
                return '#EF5350';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Daily Challenges</Text>
                <TouchableOpacity onPress={() => setIsInfoModalVisible(true)}>
                    <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isInfoModalVisible}
                onRequestClose={() => setIsInfoModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Daily Challenges Guide</Text>

                        <ScrollView style={styles.modalScroll}>
                            <Text style={styles.modalStep}>Challenge Difficulty</Text>
                            <Text style={styles.modalText}>
                                • Green (Easy): Perfect for beginners, 10 points{'\n'}
                                • Orange (Medium): Intermediate level, 15 points{'\n'}
                                • Red (Hard): Advanced challenges, 20 points
                            </Text>

                            <Text style={styles.modalStep}>How to Complete</Text>
                            <Text style={styles.modalText}>
                                1. Choose a challenge that matches your skill level{'\n'}
                                2. Tap the "Start" button to begin{'\n'}
                                3. Complete the challenge requirements{'\n'}
                                4. Earn points upon completion
                            </Text>

                            <Text style={styles.modalStep}>Daily Progress</Text>
                            <Text style={styles.modalText}>
                                • Challenges reset every 24 hours{'\n'}
                                • Track your progress in the bar at the top{'\n'}
                                • Aim to complete all challenges for bonus rewards{'\n'}
                                • Completed challenges are marked with a green checkmark
                            </Text>

                            <Text style={styles.modalStep}>Tips</Text>
                            <Text style={styles.modalText}>
                                • Start with easier challenges to build confidence{'\n'}
                                • Complete challenges daily to maintain your streak{'\n'}
                                • Points earned contribute to your overall level
                            </Text>
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setIsInfoModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.progressSection}>
                <Text style={styles.progressTitle}>Today's Progress</Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '33%' }]} />
                </View>
                <Text style={styles.progressText}>1/3 Challenges Completed</Text>
            </View>

            <ScrollView style={styles.challengeList}>
                {challenges.map((challenge) => (
                    <TouchableOpacity
                        key={challenge.id}
                        style={[
                            styles.challengeCard,
                            challenge.completed && styles.completedChallenge
                        ]}
                    >
                        <View style={styles.challengeHeader}>
                            <Text style={styles.challengeTitle}>{challenge.title}</Text>
                            <View style={[
                                styles.difficultyBadge,
                                { backgroundColor: getDifficultyColor(challenge.difficulty) }
                            ]}>
                                <Text style={styles.difficultyText}>
                                    {challenge.difficulty.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.challengeDescription}>{challenge.description}</Text>
                        <View style={styles.challengeFooter}>
                            <Text style={styles.pointsText}>{challenge.points} Points</Text>
                            {challenge.completed ? (
                                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                            ) : (
                                <TouchableOpacity style={styles.startButton}>
                                    <Text style={styles.startButtonText}>Start</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    progressSection: {
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    progressTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    progressBar: {
        height: 10,
        backgroundColor: '#eee',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    progressText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    challengeList: {
        padding: 20,
    },
    challengeCard: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 16,
        marginBottom: 10,
    },
    challengeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    challengeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    difficultyBadge: {
        padding: 4,
        borderRadius: 5,
        marginLeft: 10,
    },
    difficultyText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    challengeDescription: {
        fontSize: 16,
        color: '#333',
    },
    challengeFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    pointsText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    startButton: {
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 5,
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    completedChallenge: {
        backgroundColor: '#eee',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalScroll: {
        maxHeight: 300,
    },
    modalStep: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    modalText: {
        fontSize: 16,
        color: '#333',
    },
    closeButton: {
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

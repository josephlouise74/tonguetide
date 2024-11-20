import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Challenge {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    completed: boolean;
    scoreValue: number;
}

export default function ChallengeScreen() {
    const { completedChallengeId } = useLocalSearchParams() as { completedChallengeId?: string };
    const [challenges, setChallenges] = useState<Challenge[]>([
        {
            id: '1',
            title: 'Daily Vocabulary',
            description: 'Learn 5 new words today',
            difficulty: 'easy',
            points: 10,
            completed: false,
            scoreValue: 1,
        },
        {
            id: '2',
            title: 'Grammar Challenge',
            description: 'Complete 3 grammar exercises',
            difficulty: 'medium',
            points: 15,
            completed: false,
            scoreValue: 2,
        },
        {
            id: '3',
            title: 'Speaking Practice',
            description: 'Record 2 pronunciation exercises',
            difficulty: 'hard',
            points: 20,
            completed: false,
            scoreValue: 2,
        },
    ]);

    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

    const getDifficultyColor = (difficulty: Challenge['difficulty']): string => {
        switch (difficulty) {
            case 'easy':
                return '#A5D6A7';
            case 'medium':
                return '#FFCC80';
            case 'hard':
                return '#EF9A9A';
            default:
                return '#ccc';
        }
    };

    const handleStartChallenge = (challengeId: string) => {
        if (challengeId === '1') {
            router.push('/components/DailyTask');
        } else if (challengeId === '2') {
            router.push('/components/GrammarChallenge');
        } else if (challengeId === '3') {
            router.push('/components/SpeakingPractice');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Daily Challenges</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        onPress={() => setIsInfoModalVisible(true)}
                        style={styles.infoButton}
                    >
                        <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>
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

            <ScrollView style={styles.challengeList}>
                {challenges.map((challenge) => (
                    <TouchableOpacity
                        key={challenge.id}
                        style={[
                            styles.challengeCard,
                            challenge.completed && styles.completedChallenge,
                        ]}
                        onPress={() => handleStartChallenge(challenge.id)}
                    >
                        <View style={styles.challengeHeader}>
                            <Text style={styles.challengeTitle}>{challenge.title}</Text>
                            <View
                                style={[
                                    styles.difficultyBadge,
                                    { backgroundColor: getDifficultyColor(challenge.difficulty) },
                                ]}
                            >
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
                                <View style={styles.startButton}>
                                    <Text style={styles.startButtonText}>Start</Text>
                                </View>
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
        backgroundColor: '#f9f9f9',
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoButton: {
        marginLeft: 16,
    },
    challengeList: {
        marginTop: 40,
        paddingHorizontal: 20,
    },
    challengeCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    challengeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    challengeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    difficultyBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    difficultyText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    challengeDescription: {
        fontSize: 16,
        color: '#555',
        marginBottom: 8,
    },
    challengeFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    startButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    completedChallenge: {
        backgroundColor: '#E0E0E0',
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
        color: '#333',
    },
    modalScroll: {
        maxHeight: 200,
        marginBottom: 20,
    },
    modalStep: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    modalText: {
        fontSize: 16,
        color: '#555',
    },
    closeButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

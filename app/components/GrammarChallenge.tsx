import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Question {
    id: number;
    sentence: string;
    options: string[];
    correctAnswer: string;
}

export default function GrammarChallenge() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [questions] = useState<Question[]>([
        {
            id: 1,
            sentence: "She ___ to the store yesterday.",
            options: ["go", "goes", "went", "gone"],
            correctAnswer: "went"
        },
        {
            id: 2,
            sentence: "If I ___ rich, I would travel the world.",
            options: ["am", "were", "was", "be"],
            correctAnswer: "were"
        },
        {
            id: 3,
            sentence: "They ___ studying English for two years.",
            options: ["has been", "have been", "are", "were"],
            correctAnswer: "have been"
        },
    ]);

    const handleAnswer = async (selectedAnswer: string) => {
        const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setShowResult(true);
            // Save progress
            try {
                await AsyncStorage.setItem('grammarProgress', JSON.stringify({
                    score,
                    completedAt: new Date().toISOString(),
                }));
                // Navigate back to challenges screen with completed status
                router.push({
                    pathname: "/challenges",
                    params: { completedChallengeId: '2' }
                });
            } catch (error) {
                console.error('Error saving progress:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Grammar Challenge</Text>
                <Text style={styles.progressText}>{`${currentQuestion + 1}/${questions.length}`}</Text>
            </View>

            <ScrollView style={styles.content}>
                {!showResult ? (
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionText}>
                            {questions[currentQuestion].sentence}
                        </Text>
                        <View style={styles.optionsContainer}>
                            {questions[currentQuestion].options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.optionButton}
                                    onPress={() => handleAnswer(option)}
                                >
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ) : (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>
                            Challenge Complete!
                        </Text>
                        <Text style={styles.scoreText}>
                            Score: {score}/{questions.length}
                        </Text>
                    </View>
                )}
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
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    progressText: {
        fontSize: 16,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    questionContainer: {
        flex: 1,
        alignItems: 'center',
    },
    questionText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    optionsContainer: {
        width: '100%',
    },
    optionButton: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    optionText: {
        fontSize: 18,
    },
    resultContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    resultText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scoreText: {
        fontSize: 20,
        color: '#007AFF',
    },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

interface Word {
    word: string;
    meaning: string;
    options: string[];
    correct: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export default function DailyTask() {
    const [score, setScore] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [level, setLevel] = useState(1);
    const [streak, setStreak] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [hintUsed, setHintUsed] = useState(false);
    const [mistakes, setMistakes] = useState(0); // Track mistakes

    const vocabularyWords: Word[][] = [
        // Easy Level
        [
            { word: "Ephemeral", meaning: "Lasting for a very short time", options: ["Short", "Permanent", "Colorful", "Strong"], correct: "Short", difficulty: 'easy' },
            { word: "Ubiquitous", meaning: "Present everywhere", options: ["Rare", "Everywhere", "Beautiful", "Dangerous"], correct: "Everywhere", difficulty: 'easy' },
            { word: "Pristine", meaning: "In its original condition; unspoiled", options: ["Polluted", "New", "Worn", "Dirty"], correct: "New", difficulty: 'easy' },
            { word: "Lucid", meaning: "Expressed clearly; easy to understand", options: ["Confusing", "Clear", "Obscure", "Dull"], correct: "Clear", difficulty: 'easy' },
            { word: "Amiable", meaning: "Having a friendly and pleasant manner", options: ["Hostile", "Friendly", "Sad", "Rude"], correct: "Friendly", difficulty: 'easy' },
        ],

        // Medium Level
        [
            { word: "Pernicious", meaning: "Harmful in a gradual way", options: ["Harmless", "Helpful", "Harmful", "Joyful"], correct: "Harmful", difficulty: 'medium' },
            { word: "Sagacious", meaning: "Having good judgment", options: ["Wise", "Foolish", "Forgetful", "Hasty"], correct: "Wise", difficulty: 'medium' },
            { word: "Ambiguous", meaning: "Open to more than one interpretation", options: ["Clear", "Confusing", "Doubtful", "Precise"], correct: "Confusing", difficulty: 'medium' },
            { word: "Tenacious", meaning: "Holding firmly; persistent", options: ["Weak", "Persistent", "Lazy", "Flexible"], correct: "Persistent", difficulty: 'medium' },
            { word: "Astute", meaning: "Having the ability to accurately assess situations", options: ["Clueless", "Shrewd", "Ignorant", "Foolish"], correct: "Shrewd", difficulty: 'medium' },
        ],

        // Hard Level
        [
            { word: "Obfuscate", meaning: "To make unclear", options: ["Clarify", "Obscure", "Lighten", "Sharpen"], correct: "Obscure", difficulty: 'hard' },
            { word: "Magnanimous", meaning: "Generous or forgiving", options: ["Selfish", "Generous", "Mean", "Stingy"], correct: "Generous", difficulty: 'hard' },
            { word: "Cacophony", meaning: "A harsh, discordant mixture of sounds", options: ["Melody", "Harmony", "Noise", "Silence"], correct: "Noise", difficulty: 'hard' },
            { word: "Pusillanimous", meaning: "Lacking courage or resolution; timid", options: ["Brave", "Timid", "Assertive", "Confident"], correct: "Timid", difficulty: 'hard' },
            { word: "Enervate", meaning: "To cause someone to feel drained of energy", options: ["Energize", "Weaken", "Strengthen", "Refresh"], correct: "Weaken", difficulty: 'hard' },
        ],
    ];


    const handleAnswer = (selectedAnswer: string) => {
        const currentWord = vocabularyWords[level - 1][currentWordIndex];
        const isCorrect = selectedAnswer === currentWord.correct;

        setFeedback(isCorrect ? "Correct!" : "Try Again!");

        if (isCorrect) {
            setMistakes(0); // Reset mistakes on correct answer
            const scoreMultiplier = level;
            setScore(score + (hintUsed ? 1 : 2) * scoreMultiplier);
            setStreak(streak + 1);

            if (streak + 1 === 3 || streak + 1 === 5) {
                Alert.alert("Streak Bonus!", `You have a streak of ${streak + 1}!`);
            }

            if (currentWordIndex < vocabularyWords[level - 1].length - 1) {
                setCurrentWordIndex(currentWordIndex + 1);
            } else if (level < vocabularyWords.length) {
                setTimeout(() => {
                    setLevel(level + 1);
                    setCurrentWordIndex(0);
                    setFeedback(null);
                }, 1000);
            } else {
                setGameCompleted(true);
            }
        } else {
            setStreak(0);
            setMistakes(mistakes + 1); // Increment mistakes
            if (mistakes + 1 === 2) {
                Alert.alert("Game Reset", "You've made two mistakes. Restarting the game.");
                resetGame();
            }
        }
    };

    const resetGame = () => {
        setScore(0);
        setLevel(1);
        setCurrentWordIndex(0);
        setStreak(0);
        setHintUsed(false);
        setGameCompleted(false);
        setMistakes(0); // Reset mistakes
    };

    const useHint = () => {
        if (hintUsed) return;
        setHintUsed(true);
        setScore(Math.max(0, score - 1));
        Alert.alert("Hint", vocabularyWords[level - 1][currentWordIndex].meaning);
    };

    const handleGameCompletion = async () => {
        try {
            // Save the score and completion status with timestamp
            const gameData = {
                score: score,
                completedAt: new Date().toISOString(),
                bestStreak: streak,
                completed: true
            };

            await AsyncStorage.setItem('dailyVocabularyProgress', JSON.stringify(gameData));

            // Navigate back to challenges screen with completion data
            router.push({
                pathname: "/(tabs)/challenges",
                params: {
                    completedChallengeId: '1'
                }
            });
        } catch (error) {
            console.error('Error saving completion status:', error);
        }
    };

    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => setFeedback(null), 1000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    const shuffleArray = (array: string[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    if (gameCompleted) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Congratulations! You've completed all levels!</Text>
                <Text style={styles.scoreText}>Final Score: {score}</Text>
                <Text style={styles.streakText}>Best Streak: {streak}</Text>
                <TouchableOpacity style={styles.button} onPress={handleGameCompletion}>
                    <Text style={styles.buttonText}>Complete Challenge</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentWord = vocabularyWords[level - 1][currentWordIndex];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Vocabulary Master</Text>
                <Text style={styles.score}>Score: {score}</Text>
            </View>

            <View style={styles.gameContainer}>
                <View style={styles.levelIndicator}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButtonContainer}
                    >
                        <AntDesign name="left" size={24} color="#007AFF" />
                    </TouchableOpacity>
                    <View style={styles.levelInfoContainer}>
                        <Text style={styles.levelText}>Level {level}</Text>
                        <Text style={styles.progress}>Word {currentWordIndex + 1} of {vocabularyWords[level - 1].length}</Text>
                    </View>
                </View>

                <View style={styles.wordContainer}>
                    <Text style={styles.word}>{currentWord.word}</Text>
                    <TouchableOpacity
                        style={[styles.hintButton, hintUsed && styles.hintButtonDisabled]}
                        onPress={useHint}
                        disabled={hintUsed}
                    >
                        <Text style={[styles.hintButtonText, hintUsed && styles.hintButtonTextDisabled]}>
                            {hintUsed ? 'Hint Used' : 'Get Hint'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.optionsContainer}>
                    {shuffleArray(currentWord.options).map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.option}
                            onPress={() => handleAnswer(option)}
                        >
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {feedback && (
                    <Text style={[
                        styles.feedback,
                        feedback === "Correct!" ? styles.correctFeedback : styles.incorrectFeedback
                    ]}>
                        {feedback}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#007AFF',
        padding: 20,
        paddingTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    gameContainer: {
        padding: 20,
        flex: 1,
    },
    levelIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        justifyContent: 'space-between',
    },
    backButtonContainer: {
        padding: 2,
        borderColor: '#007AFF',
    },
    levelInfoContainer: {
        marginLeft: 10,
    },
    levelText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    progress: {
        fontSize: 16,
        color: '#666',
    },
    wordContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    word: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    optionsContainer: {
        gap: 12,
    },
    option: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#007AFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    optionText: {
        color: '#007AFF',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '600',
    },
    hintButton: {
        backgroundColor: '#FFF',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFA500',
    },
    hintButtonDisabled: {
        backgroundColor: '#f5f5f5',
        borderColor: '#ccc',
    },
    hintButtonText: {
        color: '#FFA500',
        fontSize: 14,
        fontWeight: '600',
    },
    hintButtonTextDisabled: {
        color: '#999',
    },
    feedback: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        padding: 10,
        borderRadius: 8,
    },
    correctFeedback: {
        backgroundColor: '#4CAF50',
        color: '#fff',
    },
    incorrectFeedback: {
        backgroundColor: '#FF3B30',
        color: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scoreText: {
        fontSize: 20,
        marginBottom: 30,
    },
    streakText: {
        fontSize: 18,
        color: '#4CAF50',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        width: '50%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    score: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
});

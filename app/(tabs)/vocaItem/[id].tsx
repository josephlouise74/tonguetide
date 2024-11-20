import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Modal } from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { vocabulary } from '../../data/utils';
import { CircularProgress } from '../../components/CircularProgress';


export default function VocabularyItemDetail() {
    const { id } = useLocalSearchParams();
    const item = vocabulary.find((vocabItem) => vocabItem.id === id);

    const navigation = useNavigation();

    const [userRecording, setUserRecording] = useState(false);
    const [recognizedText, setRecognizedText] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const successOpacity = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(1))[0];
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [confidenceScore, setConfidenceScore] = useState(0);
    const [practiceHistory, setPracticeHistory] = useState<Array<{
        timestamp: Date;
        correct: boolean;
        confidence: number;
    }>>([]);
    const [isMaintenanceModalVisible, setIsMaintenanceModalVisible] = useState(false);

    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            router.push('/(tabs)');
        }
    };

    const handleTogglePractice = () => {
        setIsMaintenanceModalVisible(true);
    };

    const handlePlaySound = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
    };

    const updateScore = (correct: boolean) => {
        if (correct) {
            setScore(prev => prev + (streak + 1));
            setStreak(prev => prev + 1);
        } else {
            setStreak(0);
        }
        setAttempts(prev => prev + 1);
    };

    if (!item) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Vocabulary item not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Ionicons name="chevron-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Vocabulary Detail</Text>
                <TouchableOpacity onPress={() => Alert.alert("Info", "Additional information here")}>
                    <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                {/* Word and Volume Section */}
                <View style={styles.wordSection}>
                    <Text style={styles.word}>{item.word}</Text>
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <TouchableOpacity onPress={handlePlaySound} style={styles.volumeButton}>
                            <Ionicons name="volume-high-outline" size={28} color="#007AFF" />
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {/* Definition Section */}
                <View style={styles.definitionSection}>
                    <Text style={styles.definition}>{item.definition}</Text>
                </View>

                {/* Updated Stats Section */}
                <View style={styles.statsSection}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Score</Text>
                        <Text style={styles.statValue}>{score}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Streak</Text>
                        <Text style={styles.statValue}>{streak}🔥</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Accuracy</Text>
                        <Text style={styles.statValue}>{Math.round(confidenceScore)}%</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Updated Practice Section */}
                <View style={styles.practiceSection}>
                    <CircularProgress
                        progress={userRecording ? 0.5 : 1}
                        size={120}
                        strokeWidth={4}
                        color="#34C759"
                    >
                        <TouchableOpacity
                            style={styles.recordButton}
                            onPress={handleTogglePractice}
                        >
                            <Ionicons
                                name={userRecording ? "radio-button-on" : "mic"}
                                size={60}
                                color={userRecording ? "#FF3B30" : "#34C759"}
                            />
                        </TouchableOpacity>
                    </CircularProgress>
                    <Text style={styles.buttonLabel}>
                        {userRecording ? "Listening..." : "Tap to Practice"}
                    </Text>
                </View>

                {/* Practice History Section */}
                {practiceHistory.length > 0 && (
                    <View style={styles.historySection}>
                        <Text style={styles.historyTitle}>Recent Practice</Text>
                        {practiceHistory.slice(0, 3).map((practice, index) => (
                            <View key={index} style={styles.historyItem}>
                                <Ionicons
                                    name={practice.correct ? "checkmark-circle" : "close-circle"}
                                    size={24}
                                    color={practice.correct ? "#34C759" : "#FF3B30"}
                                />
                                <Text style={styles.historyTime}>
                                    {new Date(practice.timestamp).toLocaleTimeString()}
                                </Text>
                                <Text style={styles.historyConfidence}>
                                    {Math.round(practice.confidence)}% match
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {recognizedText && (
                    <Text style={styles.recognizedText}>Recognized: {recognizedText}</Text>
                )}

                {/* Updated Success Overlay */}
                {isCorrect && (
                    <Animated.View
                        style={[
                            styles.successOverlay,
                            {
                                opacity: successOpacity,
                                transform: [{
                                    scale: successOpacity.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.8, 1]
                                    })
                                }]
                            }
                        ]}
                    >
                        <View style={styles.successContent}>
                            <AntDesign name="checkcircle" size={60} color="#34C759" />
                            <Text style={styles.successText}>Excellent!</Text>
                            <Text style={styles.successSubText}>Perfect Pronunciation</Text>
                        </View>
                    </Animated.View>
                )}
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isMaintenanceModalVisible}
                onRequestClose={() => setIsMaintenanceModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Ionicons name="construct-outline" size={40} color="#007AFF" />
                            <Text style={styles.modalTitle}>Under Maintenance</Text>
                        </View>
                        <Text style={styles.modalMessage}>
                            This feature is currently under development and will be available soon!
                        </Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setIsMaintenanceModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Got it!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// Placeholder for speech-to-text API
async function speechToTextAPI(): Promise<string> {
    const audioData = await recordAudio();
    const API_KEY = 'YOUR_GOOGLE_CLOUD_API_KEY';

    try {
        const response = await axios.post(
            `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`,
            {
                config: {
                    encoding: 'LINEAR16',
                    sampleRateHertz: 16000,
                    languageCode: 'en-US',
                },
                audio: {
                    content: audioData,
                },
            }
        );
        return response.data.results[0]?.alternatives[0]?.transcript || '';
    } catch (error) {
        console.error('Error in speech recognition:', error);
        throw error;
    }
}

// Placeholder function for recording audio
async function recordAudio(): Promise<string> {
    return 'your_audio_base64_string';
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginHorizontal: 16,
        marginTop: 16,
    },
    wordSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    word: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    volumeButton: {
        marginLeft: 10,
        padding: 8,
    },
    definitionSection: {
        alignItems: 'center',
        marginBottom: 16,
    },
    definition: {
        fontSize: 20,
        color: '#666',
        textAlign: 'center',
        lineHeight: 28,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 16,
    },
    practiceSection: {
        alignItems: 'center',
    },
    recordButton: {
        alignItems: 'center',
    },
    buttonLabel: {
        color: '#666',
        marginTop: 8,
        fontSize: 14,
    },
    progressBarContainer: {
        width: '100%',
        height: 4,
        backgroundColor: '#ddd',
        marginTop: 8,
        borderRadius: 2,
    },
    progressBar: {
        width: '50%',
        height: '100%',
        backgroundColor: '#34C759',
        borderRadius: 2,
    },
    recognizedText: {
        fontSize: 16,
        color: '#007AFF',
        textAlign: 'center',
        marginTop: 16,
    },
    successOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    successContent: {
        alignItems: 'center',
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#34C759',
        marginTop: 16,
    },
    successSubText: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
    },
    errorText: {
        fontSize: 16,
        color: '#FF3B30',
        textAlign: 'center',
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        marginBottom: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    hintButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFB100',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    hintButtonText: {
        color: '#FFF',
        marginLeft: 8,
        fontWeight: '600',
    },
    hintContainer: {
        backgroundColor: '#FFF9E6',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    hintText: {
        color: '#B7791F',
        textAlign: 'center',
    },
    historySection: {
        marginTop: 16,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    historyTime: {
        fontSize: 16,
        color: '#666',
    },
    historyConfidence: {
        fontSize: 16,
        color: '#666',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 12,
    },
    modalMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    modalButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        minWidth: 120,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

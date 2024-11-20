import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SpeakingPractice() {
    const [isRecording, setIsRecording] = useState(false);
    const [currentExercise, setCurrentExercise] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress] = useState(new Animated.Value(0));
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [isMaintenanceModalVisible, setIsMaintenanceModalVisible] = useState(false);

    const exercises = [
        {
            id: 1,
            text: "The weather is beautiful today",
            tip: "Focus on clear pronunciation of 'weather' and 'beautiful'.",
            difficulty: "Beginner",
            category: "Small Talk",
        },
        {
            id: 2,
            text: "I would like to order a coffee, please.",
            tip: "Emphasize the 'would' sound and maintain a polite tone.",
            difficulty: "Beginner",
            category: "Restaurant",
        },
        {
            id: 3,
            text: "Could you please tell me how to get to the train station?",
            tip: "Practice rising intonation for questions.",
            difficulty: "Intermediate",
            category: "Directions",
        },
        // Add more exercises as needed
    ];

    const startRecording = async () => {
        setIsRecording(true);
        setIsProcessing(false);
    };

    const stopRecording = async () => {
        setIsRecording(false);
        setIsProcessing(true);
        setTimeout(() => {
            setFeedbackMessage("Good job! Keep practicing to improve pronunciation.");
            setIsProcessing(false);
            animateProgressBar();
        }, 2000);
    };

    const handleRecordingToggle = () => {
        setIsMaintenanceModalVisible(true);
    };

    const animateProgressBar = () => {
        Animated.timing(progress, {
            toValue: (currentExercise + 1) / exercises.length,
            duration: 800,
            useNativeDriver: false,
        }).start();
    };

    useEffect(() => {
        animateProgressBar();
    }, [currentExercise]);

    return (
        <View style={styles.container}>
            <Header progress={progress} currentExercise={currentExercise} totalExercises={exercises.length} />

            <ExerciseContent exercise={exercises[currentExercise]} />

            <View style={styles.recordingContainer}>
                {isProcessing ? (
                    <ProcessingIndicator />
                ) : (
                    <RecordButton isRecording={isRecording} onPress={handleRecordingToggle} />
                )}
                <Text style={styles.recordingText}>
                    {isRecording ? "Tap to stop" : "Tap to record"}
                </Text>
            </View>

            {feedbackMessage && <Feedback message={feedbackMessage} />}

            <NextExerciseButton
                currentExercise={currentExercise}
                setCurrentExercise={setCurrentExercise}
                exercises={exercises}
                setFeedbackMessage={setFeedbackMessage}
            />

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
                            The speaking practice feature is currently under development.
                            We're working hard to bring you the best experience soon!
                        </Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setIsMaintenanceModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Understood</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const Header: React.FC<{ progress: Animated.Value, currentExercise: number, totalExercises: number }> = ({ progress, currentExercise, totalExercises }) => (
    <View style={styles.header}>
        <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#007AFF" />
            </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Speaking Practice</Text>
            <Text style={styles.progressText}>
                {currentExercise + 1}/{totalExercises}
            </Text>
        </View>
        <View style={styles.headerRight} />
        <ProgressBar progress={progress} />
    </View>
);

const ProgressBar: React.FC<{ progress: Animated.Value }> = ({ progress }) => (
    <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, {
            width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
            })
        }]} />
    </View>
);

const ExerciseContent: React.FC<{ exercise: any }> = ({ exercise }) => (
    <View style={styles.exerciseContainer}>
        <Text style={styles.exerciseTitle}>Repeat the following:</Text>
        <View style={styles.textBox}>
            <Text style={styles.exerciseText}>{exercise.text}</Text>
        </View>
        <View style={styles.tipContainer}>
            <Ionicons name="bulb-outline" size={24} color="#FFA726" />
            <Text style={styles.tipText}>{exercise.tip}</Text>
        </View>
    </View>
);

const RecordButton: React.FC<{ isRecording: boolean, onPress: () => void }> = ({ isRecording, onPress }) => (
    <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recordingActive]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <Ionicons name={isRecording ? "stop" : "mic"} size={32} color="white" />
    </TouchableOpacity>
);

const ProcessingIndicator = () => (
    <View style={styles.processingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.processingText}>Analyzing your pronunciation...</Text>
    </View>
);

const Feedback: React.FC<{ message: string }> = ({ message }) => (
    <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackText}>{message}</Text>
    </View>
);

const NextExerciseButton: React.FC<{ currentExercise: number, setCurrentExercise: (index: number) => void, exercises: any[], setFeedbackMessage: (msg: string | null) => void }> = ({ currentExercise, setCurrentExercise, exercises, setFeedbackMessage }) => (
    <View style={styles.buttonContainer}>
        <TouchableOpacity
            style={styles.nextButton}
            onPress={() => {
                if (currentExercise < exercises.length - 1) {
                    setCurrentExercise(currentExercise + 1);
                    setFeedbackMessage(null);
                } else {
                    alert("Congratulations! You've completed all exercises.");
                    setCurrentExercise(0);
                }
            }}
        >
            <Text style={styles.nextButtonText}>
                {currentExercise < exercises.length - 1 ? "Next Exercise" : "Finish"}
            </Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerLeft: {
        width: 40,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerRight: {
        width: 40,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 4,
    },
    progressText: {
        fontSize: 14,
        color: '#666',
    },
    progressContainer: {
        height: 4,
        backgroundColor: '#eee',
        borderRadius: 2,
        marginTop: 12,
        marginBottom: 8,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 2,
    },
    exerciseContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    exerciseTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    textBox: {
        backgroundColor: '#f8f9fa',
        padding: 24,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    exerciseText: {
        fontSize: 24,
        textAlign: 'center',
        color: '#333',
        lineHeight: 32,
    },
    tipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3E0',
        padding: 16,
        borderRadius: 12,
        marginBottom: 30,
    },
    tipText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        color: '#666',
        lineHeight: 20,
    },
    recordingContainer: {
        alignItems: 'center',
        paddingBottom: 30,
    },
    recordButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    recordingActive: {
        backgroundColor: '#FF3B30',
    },
    recordingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    feedbackContainer: {
        backgroundColor: '#E3F2FD',
        padding: 16,
        borderRadius: 12,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    feedbackText: {
        fontSize: 16,
        color: '#007AFF',
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    nextButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    processingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    processingText: {
        marginTop: 12,
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
        width: '85%',
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

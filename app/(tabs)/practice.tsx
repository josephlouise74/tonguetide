import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';

type Option = string;
type MatchKey = string;
type MatchValue = string;

interface MatchPair {
    key: MatchKey;
    value: MatchValue;
}

interface PracticeData {
    id: number;
    fillInSentence: string;
    correctFillInAnswer: string;
    options: Option[];
    correctOption: Option;
    matchPairs: MatchPair[];
    multipleChoicePrompt: string;
    matchingPrompt: string;
}

// Example practice data
const practiceData: PracticeData[] = [
    {
        id: 1,
        fillInSentence: "An _____ a day keeps the doctor away.",
        correctFillInAnswer: "apple",
        options: ['Apple', 'Carrot', 'Banana'],
        correctOption: 'Apple',
        multipleChoicePrompt: "Which of these is a fruit?",
        matchingPrompt: "Match items to their categories:",
        matchPairs: [
            { key: 'Fruit', value: 'Apple' },
            { key: 'Vegetable', value: 'Carrot' },
        ],
    },
    {
        id: 2,
        fillInSentence: "The quick brown fox jumps over the _____ dog.",
        correctFillInAnswer: "lazy",
        options: ['Lazy', 'Active', 'Playful'],
        correctOption: 'Lazy',
        multipleChoicePrompt: "Which of these is a color?",
        matchingPrompt: "Match items to their categories:",
        matchPairs: [
            { key: 'Color', value: 'Brown' },
            { key: 'Animal', value: 'Fox' },
        ],
    },
    {
        id: 3,
        fillInSentence: "A journey of a thousand miles begins with a single _____.",
        correctFillInAnswer: "step",
        options: ['Leap', 'Jump', 'Step'],
        correctOption: 'Step',
        multipleChoicePrompt: "Which of these is a distance?",
        matchingPrompt: "Match items to their categories:",
        matchPairs: [
            { key: 'Distance', value: 'Thousand Miles' },
            { key: 'Start', value: 'Single Step' },
        ],
    },
    {
        id: 4,
        fillInSentence: "Beauty is in the eye of the _____.",
        correctFillInAnswer: "beholder",
        options: ['Seeker', 'Beholder', 'Viewer'],
        correctOption: 'Beholder',
        multipleChoicePrompt: "Which of these is a subject?",
        matchingPrompt: "Match items to their categories:",
        matchPairs: [
            { key: 'Subject', value: 'Beauty' },
            { key: 'Phrase', value: 'Eye of the Beholder' },
        ],
    },
    {
        id: 5,
        fillInSentence: "Better late than _____.",
        correctFillInAnswer: "never",
        options: ['Soon', 'Early', 'Never'],
        correctOption: 'Never',
        multipleChoicePrompt: "Which of these is a comparison?",
        matchingPrompt: "Match items to their categories:",
        matchPairs: [
            { key: 'Comparison', value: 'Late' },
            { key: 'Alternative', value: 'Never' },
        ],
    },
    {
        id: 6,
        fillInSentence: "Actions speak louder than _____.",
        correctFillInAnswer: "words",
        options: ['Words', 'Promises', 'Shouts'],
        correctOption: 'Words',
        multipleChoicePrompt: "Which of these is an expression?",
        matchingPrompt: "Match items to their categories:",
        matchPairs: [
            { key: 'Expression', value: 'Words' },
            { key: 'Effect', value: 'Actions' },
        ],
    },
    {
        id: 7,
        fillInSentence: "Don't put all your eggs in one _____.",
        correctFillInAnswer: "basket",
        options: ['Bag', 'Basket', 'Box'],
        correctOption: 'Basket',
        multipleChoicePrompt: "Which of these is an item?",
        matchingPrompt: "Match items to their categories:",
        matchPairs: [
            { key: 'Items', value: 'Eggs' },
            { key: 'Container', value: 'Basket' },
        ],
    },
    {
        id: 8,
        fillInSentence: "Every cloud has a _____ lining.",
        correctFillInAnswer: "silver",
        options: ['Gold', 'Silver', 'Bronze'],
        correctOption: 'Silver',
        multipleChoicePrompt: "Which of these is an object?",
        matchingPrompt: "Match items to their categories:",
        matchPairs: [
            { key: 'Object', value: 'Cloud' },
            { key: 'Color', value: 'Silver Lining' },
        ],
    },
    {
        id: 9,
        fillInSentence: "When in Rome, do as the Romans _____.",
        correctFillInAnswer: "do",
        options: ['Eat', 'Sleep', 'Do'],
        correctOption: 'Do',
        multipleChoicePrompt: "Which of these is an action?",
        matchingPrompt: "Match items to their categories:",
        matchPairs: [
            { key: 'City', value: 'Rome' },
            { key: 'Action', value: 'Do as the Romans' },
        ],
    },
    {
        id: 10,
        fillInSentence: "The early bird catches the _____.",
        correctFillInAnswer: "worm",
        options: ['Bug', 'Fly', 'Worm'],
        correctOption: 'Worm',
        multipleChoicePrompt: "Which of these is a reward?",
        matchingPrompt: "Match items to their categories:",
        matchPairs: [
            { key: 'Time', value: 'Early' },
            { key: 'Reward', value: 'Worm' },
        ],
    },
];

// Add proper prop types for exercises
interface FillInTheBlankProps {
    sentence: string;
    answer: string;
    setAnswer: (value: string) => void;
    handleAnswerSubmit: () => void;
    feedback: string | null;
}

interface MultipleChoiceProps {
    options: Option[];
    selectedOption: Option | null;
    handleOptionSelect: (option: Option) => void;
    feedback: string | null;
    prompt: string;
}

interface MatchingProps {
    matchPairs: MatchPair[];
    selectedMatchKey: MatchKey | null;
    selectedMatchValue: MatchValue | null;
    handleMatchSelect: (key: MatchKey | null, value: MatchValue | null) => void;
    feedback: string | null;
    prompt: string;
}

// Add exercise completion tracking
export default function PracticeScreen() {
    const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
    const [answer, setAnswer] = useState<string>('');
    const [fillInFeedback, setFillInFeedback] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [choiceFeedback, setChoiceFeedback] = useState<string | null>(null);
    const [selectedMatchKey, setSelectedMatchKey] = useState<MatchKey | null>(null);
    const [selectedMatchValue, setSelectedMatchValue] = useState<MatchValue | null>(null);
    const [matchFeedback, setMatchFeedback] = useState<string | null>(null);
    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
    const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());

    const currentPractice = practiceData[currentPracticeIndex];

    const handleExerciseComplete = (exerciseId: number) => {
        setCompletedExercises(prev => new Set([...prev, exerciseId]));
    };

    const isExerciseComplete = (exerciseId: number) => completedExercises.has(exerciseId);

    const handleAnswerSubmit = () => {
        const isCorrect = answer.trim().toLowerCase() === currentPractice.correctFillInAnswer.toLowerCase();
        setFillInFeedback(isCorrect ? 'Correct! Well done!' : 'Incorrect, try again.');
        if (isCorrect) {
            handleExerciseComplete(currentPractice.id);
        }
    };

    const handleOptionSelect = (option: Option) => {
        setSelectedOption(option);
        setChoiceFeedback(option === currentPractice.correctOption ? 'Correct choice!' : 'Incorrect, try again.');
    };

    const handleMatchSelect = (key: MatchKey | null, value: MatchValue | null) => {
        setSelectedMatchKey(key);
        setSelectedMatchValue(value);

        const isCorrect = currentPractice.matchPairs.some(pair => pair.key === key && pair.value === value);
        setMatchFeedback(isCorrect ? `Correct match! ${value} is a ${key}.` : 'Incorrect match, try again.');
    };

    const handleNextPractice = () => {
        if (currentPracticeIndex < practiceData.length - 1) {
            setCurrentPracticeIndex(currentPracticeIndex + 1);
            resetFeedback();
        } else {
            alert("Great job! You've completed all practices.");
            setCurrentPracticeIndex(0);
        }
    };

    const resetFeedback = () => {
        setAnswer('');
        setFillInFeedback(null);
        setSelectedOption(null);
        setChoiceFeedback(null);
        setSelectedMatchKey(null);
        setSelectedMatchValue(null);
        setMatchFeedback(null);
    };

    return (
        <View style={styles.container}>
            <Header onBack={() => router.back()} onInfo={() => setIsInfoModalVisible(true)} />
            <Instructions />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <FillInTheBlankExercise
                    sentence={currentPractice.fillInSentence}
                    answer={answer}
                    setAnswer={setAnswer}
                    handleAnswerSubmit={handleAnswerSubmit}
                    feedback={fillInFeedback}
                />
                <MultipleChoiceExercise
                    options={currentPractice.options}
                    selectedOption={selectedOption}
                    handleOptionSelect={handleOptionSelect}
                    feedback={choiceFeedback}
                    prompt={currentPractice.multipleChoicePrompt}
                />
                <MatchingExercise
                    matchPairs={currentPractice.matchPairs}
                    selectedMatchKey={selectedMatchKey}
                    selectedMatchValue={selectedMatchValue}
                    handleMatchSelect={handleMatchSelect}
                    feedback={matchFeedback}
                    prompt={currentPractice.matchingPrompt}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.navigationButton, currentPracticeIndex === 0 && styles.disabledButton]}
                        onPress={() => currentPracticeIndex > 0 && setCurrentPracticeIndex(currentPracticeIndex - 1)}
                        disabled={currentPracticeIndex === 0}
                    >
                        <Ionicons name="chevron-back" size={20} color={currentPracticeIndex === 0 ? '#A0A0A0' : '#007AFF'} />
                        <Text style={styles.navigationButtonText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.nextButton} onPress={handleNextPractice}>
                        <Text style={styles.nextButtonText}>Next</Text>
                        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <InfoModal visible={isInfoModalVisible} onClose={() => setIsInfoModalVisible(false)} />
        </View>
    );
}

const Header: React.FC<{ onBack: () => void; onInfo: () => void }> = ({ onBack, onInfo }) => (
    <View style={styles.header}>
        <View style={styles.headerContent}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={onBack}>
                <Ionicons name="chevron-back" size={24} color="#007AFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Practice Exercises</Text>

            <TouchableOpacity
                style={styles.infoButton}
                onPress={onInfo}>
                <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
        </View>
    </View>
);

const Instructions: React.FC = () => (
    <View style={styles.introduction}>
        <Text style={styles.introductionText}>
            Welcome! Follow the instructions in each exercise to test your knowledge. You’ll receive feedback as you go.
        </Text>
    </View>
);

const FillInTheBlankExercise: React.FC<FillInTheBlankProps> = ({
    sentence,
    answer,
    setAnswer,
    handleAnswerSubmit,
    feedback
}) => (
    <View style={styles.section}>
        <Text style={styles.exerciseTitle} accessibilityRole="header">Fill in the Blank</Text>
        <Text style={styles.exerciseText}>{sentence}</Text>
        <TextInput
            style={styles.input}
            placeholder="Type the missing word"
            value={answer}
            onChangeText={setAnswer}
            accessibilityLabel="Answer input field"
            accessibilityHint="Enter the missing word from the sentence"
        />
        <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAnswerSubmit}
            accessibilityRole="button"
            accessibilityLabel="Submit answer"
        >
            <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
        {feedback && (
            <Text
                style={[
                    styles.feedbackText,
                    feedback.includes('Correct') ? styles.successText : styles.errorText
                ]}
                accessibilityLiveRegion="polite"
            >
                {feedback}
            </Text>
        )}
    </View>
);

const MultipleChoiceExercise: React.FC<MultipleChoiceProps> = ({ options, selectedOption, handleOptionSelect, feedback, prompt }) => (
    <View style={styles.section}>
        <Text style={styles.exerciseTitle}>Multiple Choice</Text>
        <Text style={styles.exerciseText}>{prompt}</Text>
        <View style={styles.optionsContainer}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option}
                    style={[styles.optionButton, selectedOption === option && styles.selectedOption]}
                    onPress={() => handleOptionSelect(option)}
                >
                    <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
        {feedback && (
            <Text style={[styles.feedbackText, feedback.includes('Correct') ? styles.successText : styles.errorText]}>
                {feedback}
            </Text>
        )}
    </View>
);

const MatchingExercise: React.FC<MatchingProps> = ({ matchPairs, selectedMatchKey, selectedMatchValue, handleMatchSelect, feedback, prompt }) => (
    <View style={styles.section}>
        <Text style={styles.exerciseTitle}>Matching Exercise</Text>
        <Text style={styles.exerciseText}>{prompt}</Text>
        <View style={styles.matchingContainer}>
            {matchPairs.map(({ key }) => (
                <TouchableOpacity
                    key={key}
                    style={[styles.matchButton, selectedMatchKey === key && styles.selectedMatchButton]}
                    onPress={() => handleMatchSelect(key, null)}
                >
                    <Text style={styles.matchText}>{key}</Text>
                </TouchableOpacity>
            ))}
            {matchPairs.map(({ value }) => (
                <TouchableOpacity
                    key={value}
                    style={[styles.matchButton, selectedMatchValue === value && styles.selectedMatchButton]}
                    onPress={() => handleMatchSelect(selectedMatchKey, value)}
                >
                    <Text style={styles.matchText}>{value}</Text>
                </TouchableOpacity>
            ))}
        </View>
        {feedback && (
            <Text style={[styles.feedbackText, feedback.includes('Correct') ? styles.successText : styles.errorText]}>
                {feedback}
            </Text>
        )}
    </View>
);

const InfoModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>How to Practice</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalScroll}>
                    <Text style={styles.modalText}>
                        • Fill in the Blank: Complete the sentence with the missing word.{'\n\n'}
                        • Multiple Choice: Select the correct answer from the options provided.{'\n\n'}
                        • Matching Exercise: Match items from the left column with their corresponding pairs on the right.
                    </Text>
                </ScrollView>
            </View>
        </View>
    </Modal>
);

// Add error boundaries
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Something went wrong. Please try again.</Text>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 50, paddingBottom: 35 },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingTop: 0,  // Remove top padding since container has paddingTop: 50
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    infoButton: {
        padding: 8,
        marginRight: -8,
    },
    introduction: { padding: 16 },
    introductionText: { fontSize: 16, color: '#333', textAlign: 'center' },
    section: { marginVertical: 15, backgroundColor: '#F8F9FA', borderRadius: 10, padding: 15 },
    exerciseTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    exerciseText: { fontSize: 16, marginBottom: 10 },
    input: { borderColor: '#ddd', borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#fff' },
    submitButton: { backgroundColor: '#007AFF', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    optionsContainer: { marginTop: 8 },
    optionButton: { padding: 10, backgroundColor: '#eee', borderRadius: 8, marginVertical: 5, alignItems: 'center' },
    selectedOption: { backgroundColor: '#d0f0c0' },
    matchingContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
    matchButton: { padding: 10, backgroundColor: '#eee', borderRadius: 8 },
    feedbackText: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginTop: 8 },
    successText: { color: '#4CAF50' },
    errorText: { color: '#FF3B30' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end', // Modal slides up from bottom
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    modalText: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        marginBottom: 15,
    },
    modalScroll: {
        marginBottom: 20,
    },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20 },
    navigationButton: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center' },
    nextButton: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
    navigationButtonText: { fontSize: 16, fontWeight: '600', color: '#007AFF', marginLeft: 4 },
    nextButtonText: { fontSize: 16, fontWeight: '600', color: '#fff', marginRight: 4 },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    disabledButton: {
        opacity: 0.5,
    },
    selectedMatchButton: {
        backgroundColor: '#d0f0c0',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    matchText: {
        fontSize: 16,
        color: '#333',
    },
    scrollContent: {
        padding: 16,
    },
});

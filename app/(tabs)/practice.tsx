import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';

type Option = 'Apple' | 'Carrot' | 'Banana';
type MatchKey = 'Fruit' | 'Vegetable';
type MatchValue = 'Apple' | 'Carrot';

export default function PracticeScreen() {
    const [answer, setAnswer] = useState<string>('');
    const [fillInFeedback, setFillInFeedback] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [choiceFeedback, setChoiceFeedback] = useState<string | null>(null);
    const [selectedMatchKey, setSelectedMatchKey] = useState<MatchKey | null>(null);
    const [selectedMatchValue, setSelectedMatchValue] = useState<MatchValue | null>(null);
    const [matchFeedback, setMatchFeedback] = useState<string | null>(null);
    const correctAnswer = 'apple';
    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

    const handleAnswerSubmit = () => {
        setFillInFeedback(answer.trim().toLowerCase() === correctAnswer ? 'Correct! Well done!' : 'Incorrect, try again.');
    };

    const handleOptionSelect = (option: Option) => {
        setSelectedOption(option);
        setChoiceFeedback(option === 'Carrot' ? 'Correct! Carrot is a vegetable.' : 'Incorrect, try again.');
    };

    const handleMatchSelect = (key: MatchKey | null, value: MatchValue | null) => {
        setSelectedMatchKey(key);
        setSelectedMatchValue(value);

        if (key === 'Fruit' && value === 'Apple') {
            setMatchFeedback('Correct match: Apple is a Fruit!');
        } else if (key === 'Vegetable' && value === 'Carrot') {
            setMatchFeedback('Correct match: Carrot is a Vegetable!');
        } else if (key && value) {
            setMatchFeedback('Incorrect match, try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Practice Exercises</Text>
                <TouchableOpacity onPress={() => setIsInfoModalVisible(true)}>
                    <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {/* Info Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isInfoModalVisible}
                onRequestClose={() => setIsInfoModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>How to Play</Text>

                        <ScrollView style={styles.modalScroll}>
                            <Text style={styles.modalStep}>1. Fill in the Blank</Text>
                            <Text style={styles.modalText}>
                                Complete the sentence by typing the missing word in the text box and tap Submit to check your answer.
                            </Text>

                            <Text style={styles.modalStep}>2. Multiple Choice</Text>
                            <Text style={styles.modalText}>
                                Select the correct option from the given choices. The button will highlight when selected.
                            </Text>

                            <Text style={styles.modalStep}>3. Matching Exercise</Text>
                            <Text style={styles.modalText}>
                                Match items to their categories by first selecting a category (Fruit/Vegetable) and then selecting the corresponding item (Apple/Carrot).
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

            {/* Instructions Section */}
            <View style={styles.introduction}>
                <Text style={styles.introductionText}>
                    Welcome! Follow the instructions in each exercise to test your knowledge. You’ll receive feedback as you go.
                </Text>
            </View>

            <ScrollView style={styles.exerciseContainer} showsVerticalScrollIndicator={false}>
                {/* Exercise 1: Fill-in-the-Blank */}
                <View style={styles.section}>
                    <Text style={styles.exerciseTitle}>Step 1: Fill in the Blank</Text>
                    <Text style={styles.exerciseText}>"An _____ a day keeps the doctor away."</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Type the missing word"
                        value={answer}
                        onChangeText={(text) => setAnswer(text)}
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleAnswerSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                    {fillInFeedback && (
                        <Text style={[styles.feedbackText, fillInFeedback.includes('Correct') ? styles.successText : styles.errorText]}>
                            {fillInFeedback}
                        </Text>
                    )}
                </View>

                {/* Exercise 2: Multiple Choice */}
                <View style={styles.section}>
                    <Text style={styles.exerciseTitle}>Step 2: Multiple Choice</Text>
                    <Text style={styles.exerciseText}>Select the vegetable:</Text>
                    <View style={styles.optionsContainer}>
                        {['Apple', 'Carrot', 'Banana'].map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[styles.optionButton, selectedOption === option && styles.selectedOption]}
                                onPress={() => handleOptionSelect(option as Option)}
                            >
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {choiceFeedback && (
                        <Text style={[styles.feedbackText, choiceFeedback.includes('Correct') ? styles.successText : styles.errorText]}>
                            {choiceFeedback}
                        </Text>
                    )}
                </View>

                {/* Exercise 3: Matching */}
                <View style={styles.section}>
                    <Text style={styles.exerciseTitle}>Step 3: Matching</Text>
                    <Text style={styles.exerciseText}>Match each item to its category:</Text>
                    <View style={styles.matchingContainer}>
                        {['Fruit', 'Vegetable'].map((key) => (
                            <TouchableOpacity
                                key={key}
                                style={[styles.matchButton, selectedMatchKey === key && styles.selectedMatchButton]}
                                onPress={() => handleMatchSelect(key as MatchKey, null)}
                            >
                                <Text style={styles.matchText}>{key}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.matchingContainer}>
                        {['Apple', 'Carrot'].map((value) => (
                            <TouchableOpacity
                                key={value}
                                style={[styles.matchButton, selectedMatchValue === value && styles.selectedMatchButton]}
                                onPress={() => handleMatchSelect(selectedMatchKey, value as MatchValue)}
                            >
                                <Text style={styles.matchText}>{value}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {matchFeedback && (
                        <Text style={[styles.feedbackText, matchFeedback.includes('Correct') ? styles.successText : styles.errorText]}>
                            {matchFeedback}
                        </Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
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
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    introduction: {
        padding: 20,
        backgroundColor: '#F8F9FA',
    },
    introductionText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    exerciseContainer: {
        flex: 1,
    },
    section: {
        marginVertical: 15,
        backgroundColor: '#F8F9FA',
        borderRadius: 10,
        padding: 15,
    },
    exerciseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    exerciseText: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    optionsContainer: {
        marginTop: 12,
        gap: 10,
    },
    optionButton: {
        paddingVertical: 12,
        backgroundColor: '#eee',
        borderRadius: 8,
        marginVertical: 5,
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: '#d0f0c0',
        borderColor: '#4CAF50',
        borderWidth: 1,
    },
    optionText: {
        fontSize: 16,
    },
    matchingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    matchButton: {
        padding: 10,
        backgroundColor: '#eee',
        borderRadius: 8,
        width: '45%',
        alignItems: 'center',
    },
    selectedMatchButton: {
        backgroundColor: '#d0f0c0',
        borderColor: '#4CAF50',
        borderWidth: 1,
    },
    matchText: {
        fontSize: 16,
    },
    feedbackText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 8,
    },
    successText: {
        color: '#4CAF50',
    },
    errorText: {
        color: '#FF3B30',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalScroll: {
        maxHeight: '80%',
    },
    modalStep: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
        color: '#007AFF',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 15,
        lineHeight: 22,
    },
    closeButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    closeButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

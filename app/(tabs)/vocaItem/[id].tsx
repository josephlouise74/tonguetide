import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// Static vocabulary data

const vocabulary = [
    { id: '1', word: 'Hello', definition: 'A greeting' },
    { id: '2', word: 'Goodbye', definition: 'A farewell' },
    { id: '3', word: 'Thank you', definition: 'Expression of gratitude' },
    { id: '4', word: 'Please', definition: 'Polite request' },
    { id: '5', word: 'Excuse me', definition: 'Polite phrase used to get attention or apologize' },
    { id: '6', word: 'Good morning', definition: 'Morning greeting' },
    { id: '7', word: 'Good evening', definition: 'Evening greeting' },
    { id: '8', word: 'Nice to meet you', definition: 'Polite phrase when meeting someone new' },
    { id: '9', word: 'How are you?', definition: 'Common greeting asking about wellbeing' },
    { id: '10', word: 'You\'re welcome', definition: 'Polite response to thank you' },
    { id: '11', word: 'Sorry', definition: 'Expression of apology or regret' },
    { id: '12', word: 'Congratulations', definition: 'Expression of praise for achievement' },
    { id: '13', word: 'Take care', definition: 'Friendly farewell expressing concern' },
    { id: '14', word: 'See you later', definition: 'Casual farewell indicating future meeting' },
    { id: '15', word: 'Have a nice day', definition: 'Friendly farewell wishing well' },
    { id: '16', word: 'Good night', definition: 'Evening farewell before sleeping' },
    { id: '17', word: 'Welcome', definition: 'Greeting to receive someone' },
    { id: '18', word: 'Best wishes', definition: 'Expression of hope for someone\'s success or happiness' },
    { id: '19', word: 'Get well soon', definition: 'Phrase expressing hope for recovery' },
    { id: '20', word: 'Happy birthday', definition: 'Celebration greeting for someone\'s birthday' },
    { id: '21', word: 'Good luck', definition: 'Wishing someone success' },
    { id: '22', word: 'Cheers', definition: 'Casual greeting or toast' },
    { id: '23', word: 'Have fun', definition: 'Wishing someone enjoyment' },
    { id: '24', word: 'Safe travels', definition: 'Wishing someone a safe journey' },
    { id: '25', word: 'Well done', definition: 'Expression of praise for achievement' }
];

export default function VocabularyItemDetail() {
    const { id } = useLocalSearchParams();
    const item = vocabulary.find((vocabItem) => vocabItem.id === id);

    const [userRecording, setUserRecording] = useState(false);
    const [recognizedText, setRecognizedText] = useState<string | null>(null);

    const handleGoBack = () => {
        router.back();
    };

    const handleToggleStudy = () => {
        console.log('Toggle study list');
    };

    const handleToggleLearned = () => {
        console.log('Toggle learned');
    };

    const handleTogglePractice = async () => {
        setUserRecording(true);
        try {
            const result = await speechToTextAPI();
            setRecognizedText(result);

            if (result?.toLowerCase() === item?.word.toLowerCase()) {
                Alert.alert('Correct!', 'You pronounced it correctly.');
            } else {
                Alert.alert('Try Again', `Expected: ${item?.word}, but you said: ${result}`);
            }
        } catch (error) {
            console.error('Error recognizing speech:', error);
            Alert.alert('Error', 'Could not process speech. Please try again.');
        } finally {
            setUserRecording(false);
        }
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
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>

            <View style={styles.card}>
                <View style={styles.wordSection}>
                    <Text style={styles.word}>{item.word}</Text>
                </View>

                <View style={styles.practiceSection}>
                    <TouchableOpacity style={styles.recordButton} onPress={handleTogglePractice}>
                        <Ionicons
                            name={userRecording ? "radio-button-on" : "mic"}
                            size={60}
                            color={userRecording ? "#FF3B30" : "#34C759"}
                        />
                        <Text style={styles.buttonLabel}>Practice</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.meaningSection}>
                    <Text style={styles.definition}>{item.definition}</Text>
                </View>

                {recognizedText && (
                    <Text style={styles.recognizedText}>Recognized: {recognizedText}</Text>
                )}
            </View>
        </View>
    );
}

// Function to call Google Cloud Speech-to-Text API
async function speechToTextAPI(): Promise<string> {
    const audioData = await recordAudio(); // Record audio data and convert to base64
    const API_KEY = 'YOUR_GOOGLE_CLOUD_API_KEY'; // Replace with your Google API key

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
        const transcript = response.data.results[0]?.alternatives[0]?.transcript;
        return transcript || '';
    } catch (error) {
        console.error('Error in speech recognition:', error);
        throw error;
    }
}

// Placeholder function to simulate recording and converting audio to base64
async function recordAudio(): Promise<string> {
    // Implement audio recording and convert it to base64 format
    // For testing, return a placeholder base64 string
    return 'your_audio_base64_string';
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    backButton: {
        marginBottom: 16,
        padding: 8,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    wordSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    word: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    practiceSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
    },
    recordButton: {
        alignItems: 'center',
    },
    buttonLabel: {
        color: '#666',
        marginTop: 8,
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 16,
    },
    meaningSection: {
        marginBottom: 24,
    },
    definition: {
        fontSize: 20,
        color: '#666',
        textAlign: 'center',
        lineHeight: 28,
    },
    recognizedText: {
        fontSize: 16,
        color: '#007AFF',
        textAlign: 'center',
        marginTop: 16,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});

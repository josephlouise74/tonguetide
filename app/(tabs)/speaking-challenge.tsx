// app/(tabs)/speaking-challenge.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { router } from 'expo-router';

export default function SpeakingChallengeScreen() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentScore, setCurrentScore] = useState(0);

    return (
        <View style={styles.container}>
            {/* Top Navigation */}
            <View style={styles.topNav}>
                <TouchableOpacity onPress={() => { router.push("/home") }}>
                    <Text style={styles.backButton}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Speaking Challenge</Text>
                <Text style={styles.score}>Score: {currentScore}</Text>
            </View>

            {/* Content Area */}
            <View style={styles.challengeContainer}>
                <Text style={styles.challengeText}>Pronounce this word:</Text>
                <Text style={styles.word}>"Bonjour"</Text>

                {/* Example Pronunciation */}
                <TouchableOpacity
                    style={styles.listenButton}
                    onPress={() => setIsPlaying(!isPlaying)}
                >
                    <Text style={styles.listenButtonText}>
                        {isPlaying ? '■ Stop' : '▶ Listen to Example'}
                    </Text>
                </TouchableOpacity>

                {/* Practice Section */}
                <View style={styles.practiceSection}>
                    <TouchableOpacity style={styles.recordButton}>
                        <Text style={styles.recordButtonText}>
                            Tap to Practice
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        Progress: {currentScore}%
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 60,
    },
    topNav: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    backButton: {
        fontSize: 18,
        color: 'blue',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    challengeContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    challengeText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    word: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 15,
    },
    feedbackContainer: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        alignItems: 'center',
    },
    feedbackText: {
        fontSize: 18,
        color: '#333',
    },
    listenButton: {
        padding: 10,
        borderWidth: 2,
        borderColor: '#333',
        borderRadius: 5,
        marginVertical: 10,
    },
    listenButtonText: {
        fontSize: 18,
        color: '#333',
    },
    practiceSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    recordButton: {
        padding: 10,
        borderWidth: 2,
        borderColor: '#333',
        borderRadius: 5,
    },
    recordButtonText: {
        fontSize: 18,
        color: '#333',
    },
    progressContainer: {
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 18,
        color: '#333',
    },
    score: {
        fontSize: 18,
        color: '#333',
        marginLeft: 'auto',
    },
});

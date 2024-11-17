import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type ContentCard = {
    title: string;
    description: string;
    type: 'challenge' | 'progress' | 'practice';
    icon: keyof typeof Ionicons.glyphMap;
    score?: number;
    total?: number;
    id?: string;
};

export const contentCards: ContentCard[] = [
    {
        title: "Vocabulary Builder",
        description: "Build your vocabulary with definitions and audio",
        type: 'practice',
        icon: 'book-outline',
        id: 'vocabulary'
    },
    {
        title: "Practice Exercises",
        description: "Interactive exercises with matching and multiple choice",
        type: 'practice',
        icon: 'fitness-outline',
        id: 'practice'
    },
    {
        title: "Daily Challenges",
        description: "Timed quizzes and word puzzles",
        type: 'challenge',
        icon: 'trophy-outline',
        score: 0,
        total: 5,
        id: 'challenges'
    },
    {
        title: "Language Exchange",
        description: "Connect with language partners",
        type: 'practice',
        icon: 'chatbubbles-outline',
        id: 'language-exchange'
    },
    {
        title: "My Progress",
        description: "Track your learning journey and achievements",
        type: 'progress',
        icon: 'bar-chart-outline',
        id: 'my-progress'
    },

];

export default function HomeScreen() {
    const router = useRouter();

    return (
        <>
            <Stack.Screen options={{ headerTitle: 'Home' }} />
            <ScrollView style={styles.container}>
                <View style={styles.progressBar}>
                    <Text style={styles.progressText}>Today's Progress: 5/20 Points</Text>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: '25%' }]} />
                    </View>
                </View>

                {contentCards.map((card, index) => (
                    <Pressable
                        key={index}
                        style={styles.card}
                        onPress={() => {
                            router.push(`/(tabs)/${card.id}`);
                        }}
                    >
                        <Ionicons name={card.icon} size={30} color="#007AFF" style={styles.cardIcon} />
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{card.title}</Text>
                            <Text style={styles.cardDescription}>{card.description}</Text>
                            {card.score !== undefined && card.total !== undefined && (
                                <Text style={styles.cardProgress}>
                                    Progress: {card.score}/{card.total}
                                </Text>
                            )}
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 10,
        padding: 15,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardContent: {
        marginLeft: 15,
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
    },
    progressBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    progressText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressTrack: {
        height: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#007AFF',
    },
    cardIcon: {
        marginRight: 10,
    },
    cardProgress: {
        fontSize: 12,
        color: '#007AFF',
        marginTop: 5,
    },
});

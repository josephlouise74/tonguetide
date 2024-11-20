import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
} from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type ContentCard = {
    title: string;
    description: string;
    type: 'challenge' | 'progress' | 'practice';
    icon: keyof typeof Ionicons.glyphMap;
    score?: number;
    total?: number;
    id: string;
    gradient: string[];
};

const contentCards: ContentCard[] = [
    {
        title: "Vocabulary Builder",
        description: "Build your vocabulary with definitions and audio",
        type: 'practice',
        icon: 'book-outline',
        id: 'vocabulary',
        gradient: ['#4CAF50', '#388E3C'],
    },
    {
        title: "Practice Exercises",
        description: "Interactive exercises with matching and multiple choice",
        type: 'practice',
        icon: 'fitness-outline',
        id: 'practice',
        gradient: ['#2196F3', '#1976D2'],
    },
    {
        title: "Daily Challenges",
        description: "Timed quizzes and word puzzles",
        type: 'challenge',
        icon: 'trophy-outline',
        score: 0,
        total: 5,
        id: 'challenges',
        gradient: ['#FF9800', '#F57C00'],
    },
    {
        title: "Language Exchange",
        description: "Connect with language partners",
        type: 'practice',
        icon: 'chatbubbles-outline',
        id: 'language-exchange',
        gradient: ['#9C27B0', '#7B1FA2'],
    },
    {
        title: "My Progress",
        description: "Track your learning journey and achievements",
        type: 'progress',
        icon: 'bar-chart-outline',
        id: 'my-progress',
        gradient: ['#E91E63', '#C2185B'],
    },
];

export default function HomeScreen() {
    const router = useRouter();
    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={styles.mainContainer}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.welcomeSection}>
                    <View style={styles.welcomeHeader}>
                        <View>
                            <Text style={styles.greeting}>Welcome back!</Text>
                            <Text style={styles.subtitle}>Continue your learning journey</Text>
                        </View>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity
                                style={[styles.iconButton, { backgroundColor: '#E8F5E9' }]}
                                onPress={() => router.push('/components/StudyList')}
                            >
                                <Ionicons name="list" size={24} color="#4CAF50" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.iconButton, { backgroundColor: '#E3F2FD' }]}
                                onPress={() => router.push('/components/DisplayMarkAsLearned')}
                            >
                                <Ionicons name="checkmark-circle" size={24} color="#2196F3" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Learning Activities</Text>

                <View style={styles.cardsContainer}>
                    {contentCards.map((card) => (
                        <TouchableOpacity
                            key={card.id}
                            style={[styles.contentCard, { width: screenWidth * 0.44 }]}
                            onPress={() => router.push(`/(tabs)/${card.id}`)}
                        >
                            <LinearGradient
                                colors={card.gradient}
                                style={styles.cardGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Ionicons
                                    name={card.icon}
                                    size={32}
                                    color="#fff"
                                />
                                <Text style={styles.cardTitle}>{card.title}</Text>
                                <Text style={styles.cardDescription}>
                                    {card.description}
                                </Text>
                                {card.score !== undefined && (
                                    <View style={styles.progressBar}>
                                        <View style={[styles.progressFill, { width: `${(card.score / card.total!) * 100}%` }]} />
                                    </View>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingTop: 60,
        paddingBottom: 100,
    },
    header: {
        backgroundColor: '#fff',
        elevation: 0,
        borderBottomWidth: 0,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    welcomeSection: {
        padding: 20,
        paddingTop: 10,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 12,
    },
    progressCard: {
        margin: 20,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: 'white',
    },
    progressGradient: {
        padding: 20,
        borderRadius: 20,
    },
    progressContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    progressScore: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    progressCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressPercentage: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
        paddingBottom: 20,
    },
    contentCard: {
        marginBottom: 16,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    cardGradient: {
        padding: 20,
        height: 180,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginTop: 12,
    },
    cardDescription: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
        lineHeight: 18,
    },
    progressBar: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
        marginTop: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    welcomeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    iconButton: {
        padding: 12,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VocabularyDetailProps {
    word: string;
    definition: string;
    examples?: string[];
    pronunciation?: string;
    audioUrl?: string;
    onPlayAudio?: () => void;
    onAddToStudyList?: () => void;
    onMarkAsLearned?: () => void;
    isLearned?: boolean;
    inStudyList?: boolean;
}

export default function VocabularyDetail({
    word,
    definition,
    examples = [],
    pronunciation,
    onPlayAudio,
    onAddToStudyList,
    onMarkAsLearned,
    isLearned,
    inStudyList,
}: VocabularyDetailProps) {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.wordSection}>
                <View style={styles.wordHeader}>
                    <Text style={styles.word}>{word}</Text>
                    <TouchableOpacity onPress={onPlayAudio} style={styles.audioButton}>
                        <Ionicons name="volume-high" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>
                {pronunciation && (
                    <Text style={styles.pronunciation}>/{pronunciation}/</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Definition</Text>
                <Text style={styles.definition}>{definition}</Text>
            </View>

            {examples.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Examples</Text>
                    {examples.map((example, index) => (
                        <Text key={index} style={styles.example}>
                            • {example}
                        </Text>
                    ))}
                </View>
            )}

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.studyButton, inStudyList && styles.activeButton]}
                    onPress={onAddToStudyList}
                >
                    <Ionicons name="bookmark-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>
                        {inStudyList ? 'In Study List' : 'Add to Study List'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.learnedButton, isLearned && styles.activeButton]}
                    onPress={onMarkAsLearned}
                >
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>
                        {isLearned ? 'Learned' : 'Mark as Learned'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    wordSection: {
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    wordHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    word: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    pronunciation: {
        fontSize: 18,
        color: '#666',
        marginTop: 5,
    },
    audioButton: {
        padding: 10,
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    definition: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
    },
    example: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
        marginBottom: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    studyButton: {
        backgroundColor: '#4CAF50',
    },
    learnedButton: {
        backgroundColor: '#2196F3',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    activeButton: {
        opacity: 0.7,
    },
});
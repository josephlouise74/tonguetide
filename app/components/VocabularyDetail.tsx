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

const VocabularyDetail: React.FC<VocabularyDetailProps> = ({
    word,
    definition,
    examples = [],
    pronunciation,
    onPlayAudio,
    onAddToStudyList,
    onMarkAsLearned,
    isLearned,
    inStudyList,
}) => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.wordSection}>
                <View style={styles.wordHeader}>
                    <Text style={styles.word}>{word}</Text>
                    {onPlayAudio && (
                        <TouchableOpacity onPress={onPlayAudio} style={styles.audioButton}>
                            <Ionicons name="volume-high" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    )}
                </View>
                {pronunciation && (
                    <Text style={styles.pronunciation}>/{pronunciation}/</Text>
                )}
            </View>

            <Section title="Definition">
                <Text style={styles.definition}>{definition}</Text>
            </Section>

            {examples.length > 0 && (
                <Section title="Examples">
                    {examples.map((example, index) => (
                        <Text key={index} style={styles.example}>
                            • {example}
                        </Text>
                    ))}
                </Section>
            )}

            <View style={styles.actionButtons}>
                <ActionButton
                    title={inStudyList ? 'In Study List' : 'Add to Study List'}
                    icon="bookmark-outline"
                    onPress={onAddToStudyList}
                    isActive={inStudyList}
                    style={styles.studyButton}
                />
                <ActionButton
                    title={isLearned ? 'Learned' : 'Mark as Learned'}
                    icon="checkmark-circle-outline"
                    onPress={onMarkAsLearned}
                    isActive={isLearned}
                    style={styles.learnedButton}
                />
            </View>
        </ScrollView>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

const ActionButton: React.FC<{
    title: string;
    icon: string;
    onPress?: () => void;
    isActive?: boolean;
    style?: object;
}> = ({ title, icon, onPress, isActive, style }) => (
    <TouchableOpacity
        style={[styles.actionButton, style, isActive && styles.activeButton]}
        onPress={onPress}
    >
        <Ionicons name={icon as any} size={20} color="#fff" />
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

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

export default VocabularyDetail;

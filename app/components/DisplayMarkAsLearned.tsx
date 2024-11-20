import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useLearnedItems } from './MarkAsLearned';
import { useRouter } from 'expo-router';

interface LearnedItem {
    id: string;
    word: string;
    definition: string;
    audioUrl?: string;
}

export default function DisplayMarkAsLearned() {
    const { learnedItems, removeFromLearned, getProgress } = useLearnedItems();
    const router = useRouter();

    const renderLearnedItem = ({ item }: { item: LearnedItem }) => (
        <Link href={`/vocaItem/${item.id}`} asChild>
            <TouchableOpacity style={styles.learnedItem}>
                <View style={styles.mainContent}>
                    <View style={styles.wordSection}>
                        <Text style={styles.word}>{item.word}</Text>
                        <TouchableOpacity style={styles.audioButton}>
                            <Ionicons name="volume-medium" size={22} color="#007AFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.definition} numberOfLines={2}>
                        {item.definition}
                    </Text>
                </View>

                <View style={styles.progressSection}>
                    <Text style={styles.progressText}>Progress: {getProgress(item.id)}%</Text>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${getProgress(item.id)}%` },
                            ]}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => removeFromLearned(item.id)}
                        style={styles.removeButton}
                    >
                        <Ionicons name="close-circle" size={22} color="#FF3B30" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Link>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#007AFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Learned Items</Text>
                </View>
            </View>

            {learnedItems.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="book-outline" size={50} color="#ccc" />
                    <Text style={styles.emptyStateText}>
                        No items marked as learned yet
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={learnedItems}
                    keyExtractor={(item) => item.id}
                    renderItem={renderLearnedItem}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingTop: 44,
        marginBottom: 26,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    listContainer: {
        paddingBottom: 20,
    },
    learnedItem: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    mainContent: {
        marginBottom: 16,
    },
    wordSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    word: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2c3e50',
    },
    definition: {
        fontSize: 16,
        color: '#7f8c8d',
        lineHeight: 22,
    },
    audioButton: {
        padding: 6,
        backgroundColor: '#e8f5fe',
        borderRadius: 20,
    },
    progressSection: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ecf0f1',
        paddingTop: 12,
        marginTop: 8,
    },
    progressText: {
        fontSize: 14,
        color: '#34495e',
        fontWeight: '500',
        flex: 1,
    },
    progressBar: {
        flex: 3,
        height: 6,
        backgroundColor: '#dcdde1',
        borderRadius: 3,
        overflow: 'hidden',
        marginRight: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    removeButton: {
        padding: 4,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyStateText: {
        fontSize: 18,
        color: '#7f8c8d',
        textAlign: 'center',
        marginTop: 12,
    },
});

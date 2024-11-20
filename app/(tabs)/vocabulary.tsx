// app/(tabs)/vocabulary.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import { vocabulary } from '../data/utils';
import { useStudyList } from '../components/StudyList';
import { useLearnedItems } from '../components/MarkAsLearned';

interface VocabularyItem {
    id: string;
    word: string;
    definition: string;
    isLearned?: boolean;
    inStudyList?: boolean;
    audioUrl?: string;
}

const ITEMS_PER_PAGE = 10;

export default function VocabularyScreen() {
    const navigation = useNavigation();
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const { addToStudyList, removeFromStudyList, isInStudyList } = useStudyList();
    const { addToLearned, removeFromLearned, isLearned, getProgress } = useLearnedItems();

    const filteredVocabulary = vocabulary.filter(item =>
        item.word.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredVocabulary.length / ITEMS_PER_PAGE);
    const paginatedVocabulary = filteredVocabulary.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const renderVocabularyItem = ({ item }: { item: VocabularyItem }) => (
        <Link href={`/vocaItem/${item.id}`} asChild>
            <TouchableOpacity style={styles.vocabularyItem}>
                <View style={styles.mainContent}>
                    <View style={styles.leftContent}>
                        <View style={styles.wordSection}>
                            <Text style={styles.word}>{item.word}</Text>
                            <TouchableOpacity style={styles.audioButton}>
                                <Ionicons name="volume-medium" size={20} color="#007AFF" />
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={styles.definition}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >{item.definition}</Text>
                    </View>
                </View>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.studyButton,
                        isInStudyList(item.id) && styles.activeButton]}
                        onPress={(e) => {
                            e.preventDefault(); // Prevent navigation
                            if (isInStudyList(item.id)) {
                                removeFromStudyList(item.id);
                            } else {
                                addToStudyList({
                                    id: item.id,
                                    word: item.word,
                                    definition: item.definition,
                                    audioUrl: item.audioUrl
                                });
                            }
                        }}>
                        <Ionicons name="bookmark-outline" size={16} color="#fff" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>
                            {isInStudyList(item.id) ? 'Remove from Study' : 'Add to Study'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.learnedButton,
                            isLearned(item.id) && styles.activeButton
                        ]}
                        onPress={(e) => {
                            e.preventDefault();
                            if (isLearned(item.id)) {
                                removeFromLearned(item.id);
                            } else {
                                addToLearned({
                                    id: item.id,
                                    word: item.word,
                                    definition: item.definition,
                                    audioUrl: item.audioUrl
                                });
                            }
                        }}>
                        <View style={styles.learnedButtonContent}>
                            <Ionicons
                                name={isLearned(item.id) ? "checkmark-circle" : "checkmark-circle-outline"}
                                size={16}
                                color="#fff"
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.buttonText}>
                                {isLearned(item.id) ? `Learned ${getProgress(item.id)}%` : 'Mark as Learned'}
                            </Text>
                        </View>
                        {isLearned(item.id) && (
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${getProgress(item.id)}%` }]} />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Link>
    );

    const PaginationControls = () => (
        <View style={styles.paginationContainer}>
            <TouchableOpacity
                style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
                onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
            >
                <Ionicons name="chevron-back" size={24} color={currentPage === 1 ? "#ccc" : "#007AFF"} />
                <Text style={[styles.paginationText, currentPage === 1 && styles.disabledText]}>Previous</Text>
            </TouchableOpacity>

            <Text style={styles.pageIndicator}>
                {currentPage} / {totalPages}
            </Text>

            <TouchableOpacity
                style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
                onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
            >
                <Text style={[styles.paginationText, currentPage === totalPages && styles.disabledText]}>Next</Text>
                <Ionicons name="chevron-forward" size={24} color={currentPage === totalPages ? "#ccc" : "#007AFF"} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {!showSearch ? (
                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back" size={24} color="#007AFF" />
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>Vocabulary</Text>

                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={() => setShowSearch(true)}>
                            <Ionicons name="search-outline" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.searchContainer}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => {
                                setShowSearch(false);
                                setSearchQuery('');
                            }}>
                            <Ionicons name="chevron-back" size={24} color="#007AFF" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search vocabulary..."
                            autoFocus
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color="#666" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>

            <FlatList
                data={paginatedVocabulary}
                keyExtractor={(item) => item.id}
                renderItem={renderVocabularyItem}
                contentContainerStyle={styles.contentContainer}
                ListFooterComponent={<PaginationControls />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
        justifyContent: 'center',
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
    searchButton: {
        padding: 8,
        marginRight: -8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        height: 36,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingRight: 36,
        fontSize: 16,
    },
    clearButton: {
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    contentContainer: {
        padding: 10,
    },
    vocabularyItem: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        marginVertical: 8,
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    mainContent: {
        marginBottom: 12,
    },
    leftContent: {
        flex: 1,
    },
    wordSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    word: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2c3e50',
        marginRight: 8,
    },
    definition: {
        fontSize: 15,
        color: '#666',
        lineHeight: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 8,
        minWidth: 100,
    },
    buttonIcon: {
        marginRight: 4,
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
    audioButton: {
        padding: 4,
    },
    activeButton: {
        opacity: 0.7,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    paginationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
    },
    paginationText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
        marginHorizontal: 4,
    },
    pageIndicator: {
        fontSize: 16,
        color: '#666',
    },
    disabledButton: {
        backgroundColor: '#f1f1f1',
    },
    disabledText: {
        color: '#ccc',
    },
    learnedButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 8,
    },
});

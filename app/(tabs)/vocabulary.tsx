// app/(tabs)/vocabulary.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';

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
                        item.inStudyList && styles.activeButton]}>
                        <Ionicons name="bookmark-outline" size={16} color="#fff" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Add to Study List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.learnedButton,
                        item.isLearned && styles.activeButton]}>
                        <Ionicons name="checkmark-circle-outline" size={16} color="#fff" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Mark as Learned</Text>
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
                    <>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back" size={24} color="#007AFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Vocabulary Builder</Text>
                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={() => setShowSearch(true)}>
                            <Ionicons name="search" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search vocabulary..."
                            autoFocus
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setShowSearch(false);
                                setSearchQuery('');
                            }}>
                            <Ionicons name="close" size={24} color="#007AFF" />
                        </TouchableOpacity>
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
        paddingTop: 60,
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
    backButton: {
        width: 40,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
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
    searchButton: {
        minWidth: 60,
        alignItems: 'flex-end',
    },
    progressBar: {
        height: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        marginTop: 10,
    },
    progress: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    searchInput: {
        flex: 1,
        height: 36,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        fontSize: 16,
    },
    closeButton: {
        padding: 4,
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
});

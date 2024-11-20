import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

interface StudyListItem {
    id: string;
    word: string;
    definition: string;
    dateAdded: string;
    progress?: number;
    audioUrl?: string;
}

interface StudyListContextType {
    studyList: StudyListItem[];
    addToStudyList: (item: Omit<StudyListItem, 'dateAdded'>) => void;
    removeFromStudyList: (id: string) => void;
    isInStudyList: (id: string) => boolean;
    markAsLearned: (id: string) => void;
}

const StudyListContext = createContext<StudyListContextType | undefined>(undefined);

export function StudyListProvider({ children }: { children: React.ReactNode }) {
    const [studyList, setStudyList] = useState<StudyListItem[]>([]);

    const addToStudyList = (item: Omit<StudyListItem, 'dateAdded'>) => {
        setStudyList(prevList => {
            if (prevList.some(i => i.id === item.id)) return prevList;
            return [...prevList, { ...item, dateAdded: new Date().toLocaleDateString(), progress: 0 }];
        });
    };

    const removeFromStudyList = (id: string) => {
        setStudyList(prevList => prevList.filter(item => item.id !== id));
    };

    const isInStudyList = (id: string) => studyList.some(item => item.id === id);

    const markAsLearned = (id: string) => {
        setStudyList(prevList =>
            prevList.map(item =>
                item.id === id ? { ...item, progress: 100 } : item
            )
        );
    };

    return (
        <StudyListContext.Provider value={{ studyList, addToStudyList, removeFromStudyList, isInStudyList, markAsLearned }}>
            {children}
        </StudyListContext.Provider>
    );
}

export const useStudyList = () => {
    const context = useContext(StudyListContext);
    if (!context) {
        throw new Error('useStudyList must be used within a StudyListProvider');
    }
    return context;
};

export default function StudyList() {
    const { studyList, removeFromStudyList, markAsLearned } = useStudyList();
    const router = useRouter();

    const renderStudyItem = ({ item }: { item: StudyListItem }) => (
        <Link href={`/vocaItem/${item.id}`} asChild>
            <TouchableOpacity style={styles.studyItem}>
                <View style={styles.itemHeader}>
                    <Text style={styles.word}>{item.word}</Text>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="volume-medium" size={20} color="#007AFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={(e) => {
                                e.preventDefault();
                                markAsLearned(item.id);
                            }}
                        >
                            <MaterialIcons
                                name="check-circle"
                                size={22}
                                color={item.progress === 100 ? "#4CAF50" : "#CCCCCC"}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={(e) => {
                                e.preventDefault();
                                removeFromStudyList(item.id);
                            }}
                        >
                            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.definition} numberOfLines={2}>
                    {item.definition}
                </Text>

                {item.progress !== undefined && (
                    <View style={styles.progressSection}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{item.progress}%</Text>
                    </View>
                )}

                <Text style={styles.dateAdded}>Added: {item.dateAdded}</Text>
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
                    <Text style={styles.headerTitle}>Study List</Text>
                </View>
            </View>

            {studyList.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialIcons name="school" size={80} color="#cccccc" />
                    <Text style={styles.emptyStateText}>Your study list is empty</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push("/(tabs)/vocabulary")}
                    >
                        <Text style={styles.addButtonText}>Browse Vocabulary</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={studyList}
                    renderItem={renderStudyItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
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
        padding: 16,
    },
    studyItem: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    word: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
        flex: 1,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 4,
    },
    definition: {
        fontSize: 15,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    progressSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#e9ecef',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: '#666',
        minWidth: 35,
    },
    dateAdded: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#ffffff',
    },
    emptyStateText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
        fontWeight: '600',
    },
    addButton: {
        marginTop: 20,
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});

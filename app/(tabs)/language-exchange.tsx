// app/(tabs)/language-exchange.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const LanguageExchangeScreen: React.FC = () => {
    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Language Exchange</Text>
                <TouchableOpacity onPress={() => setIsInfoModalVisible(true)}>
                    <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isInfoModalVisible}
                onRequestClose={() => setIsInfoModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Language Exchange Guide</Text>

                        <ScrollView style={styles.modalScroll}>
                            <Text style={styles.modalStep}>What is Language Exchange?</Text>
                            <Text style={styles.modalText}>
                                Language exchange is a method where two people learning each other's native languages help one another practice and improve their language skills.
                            </Text>

                            <Text style={styles.modalStep}>How It Works</Text>
                            <Text style={styles.modalText}>
                                1. Create your profile with your native language and the language you're learning{'\n'}
                                2. Browse potential language partners{'\n'}
                                3. Connect with partners who match your interests{'\n'}
                                4. Schedule practice sessions via chat or video call
                            </Text>

                            <Text style={styles.modalStep}>Best Practices</Text>
                            <Text style={styles.modalText}>
                                • Dedicate equal time to both languages{'\n'}
                                • Be patient and supportive with your partner{'\n'}
                                • Set clear goals for each session{'\n'}
                                • Stay committed to regular practice
                            </Text>

                            <Text style={styles.modalStep}>Safety Tips</Text>
                            <Text style={styles.modalText}>
                                • Keep personal information private{'\n'}
                                • Use the in-app communication tools{'\n'}
                                • Report any inappropriate behavior{'\n'}
                                • Meet virtually first before any in-person meetings
                            </Text>
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setIsInfoModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="earth" size={80} color="#4A90E2" />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>Language Exchange</Text>
                    <Text style={styles.description}>
                        Connect with people around the world to practice and exchange languages.
                    </Text>
                </View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Find Partners</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LanguageExchangeScreen;

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
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        backgroundColor: '#e3f2fd',
        padding: 25,
        borderRadius: 60,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    textContainer: {
        width: '100%',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#4A90E2',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalStep: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    modalScroll: {
        maxHeight: 200,
    },
});

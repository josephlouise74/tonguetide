// app/_layout.tsx
import { Slot, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function RootLayout() {
    const [showWelcome, setShowWelcome] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Ensure welcome screen is shown only on the first load
        if (!showWelcome) {
            router.replace('/(auth)/SignIn'); // Navigate once welcome screen is dismissed
        }
    }, [showWelcome]);

    if (showWelcome) {
        return (
            <View style={styles.container}>
                {/* <Image source={require('../assets/splash-icon.png')} style={styles.logo} resizeMode="contain" /> */}
                <Text style={styles.welcomeText}>Welcome to Tongue Tide</Text>
                <Text style={styles.subtitle}>Your Journey to Language Mastery</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setShowWelcome(false)}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return <Slot />; // Render child routes once welcome screen is dismissed
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 30,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#4CAF50',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
});

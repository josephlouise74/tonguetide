// app/(tabs)/profile.tsx
import React from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { router } from 'expo-router';

type RootStackParamList = {
    NotificationSettings: undefined;
    PrivacySettings: undefined;
    LanguageSettings: undefined;
    FAQ: undefined;
    ContactSupport: undefined;
    TermsPrivacyPolicy: undefined;
    Login: undefined;
};

export default function ProfileScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleNavigate = (screen: keyof RootStackParamList) => {
        navigation.navigate(screen as never);
    };

    const handleLogout = () => {
        router.replace('/(auth)/SignIn');
    };

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                {/* Profile Avatar */}
                <View style={styles.avatarContainer}>
                    <Image
                        style={styles.avatar}
                        source={{ uri: 'https://via.placeholder.com/100' }}
                    />
                    <TouchableOpacity style={styles.editAvatarButton}>
                        <Text style={styles.editAvatarText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>Edit Profile</Text>

                {/* Input Fields */}
                <View style={styles.formContainer}>
                    <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#999" />
                    <TextInput style={styles.input} placeholder="Middle Name" placeholderTextColor="#999" />
                    <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#999" />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        placeholderTextColor="#999"
                    />
                    {/* Save Changes Button */}
                    <TouchableOpacity style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>


                {/* Settings & Help Sections */}
                <SettingsSection
                    title="Settings"
                    options={[
                        { label: "Notification Preferences", screen: "NotificationSettings" },
                        { label: "Privacy Settings", screen: "PrivacySettings" },
                        { label: "Language", screen: "LanguageSettings" },
                    ]}
                    onPress={handleNavigate}
                />
                <SettingsSection
                    title="Help & Support"
                    options={[
                        { label: "FAQ", screen: "FAQ" },
                        { label: "Contact Support", screen: "ContactSupport" },
                        { label: "Terms & Privacy Policy", screen: "TermsPrivacyPolicy" },
                    ]}
                    onPress={handleNavigate}
                />

                <View style={styles.sectionContainer}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
    );
}

type SettingsOption = {
    label: string;
    screen: keyof RootStackParamList;
};

interface SettingsSectionProps {
    title: string;
    options: SettingsOption[];
    onPress: (screen: keyof RootStackParamList) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, options, onPress }) => (
    <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {options.map(({ label, screen }) => (
            <TouchableOpacity
                key={screen}
                style={styles.optionButton}
                onPress={() => onPress(screen)}
            >
                <Text style={styles.optionText}>{label}</Text>
                <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
        ))}
    </View>
);

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    container: {
        padding: 20,
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: 30,
        alignItems: 'center',
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#4A90E2',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4A90E2',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    editAvatarText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    formContainer: {
        width: '100%',
        paddingHorizontal: 10,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 15,
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    saveButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center',
        width: '100%',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    sectionContainer: {
        width: '100%',
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    optionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    optionText: {
        fontSize: 16,
        color: '#444',
    },
    chevron: {
        fontSize: 20,
        color: '#999',
    },
    logoutButton: {
        backgroundColor: 'red',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center',
        width: '100%',
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

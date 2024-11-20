// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Switch } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { signOut } from '../api/UserApi';
import Toast from 'react-native-toast-message';
import { authMiddleware } from '../(auth)/authMiddleware';
import useUserStore from '../zustandStore/useUserStore';

type RootStackParamList = {
    NotificationSettings: undefined;
    PrivacySettings: undefined;
    LanguageSettings: undefined;
    FAQ: undefined;
    ContactSupport: undefined;
    TermsPrivacyPolicy: undefined;
    Login: undefined;
};

// Define Zod schema for form validation
const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address').nonempty('Email is required'),
    profileImage: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isMaintenanceModalVisible, setIsMaintenanceModalVisible] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Get user data from Zustand store
    const user = useUserStore((state: any) => state.user);
    const token = useUserStore((state: any) => state.token);
    const isAuthenticated = useUserStore((state: any) => state.isAuthenticated);

    // Add useEffect to log the data when component mounts
    React.useEffect(() => {
        console.log('User Data from Store:', {
            user,
            token,
            isAuthenticated
        });

        // If you want to pre-fill the form with user data
        if (user) {
            setValue('firstName', user.firstName?.split(' ')[0] || '');
            setValue('email', user.email || '');
            setValue('middleName', user.middleName || '');
            setValue('lastName', user.lastName || '');
            // Set other form fields as needed
        }
    }, [user]);



    const handleNavigate = (screen: keyof RootStackParamList) => {
        setIsMaintenanceModalVisible(true);
        // navigation.navigate(screen as never); // Comment out the actual navigation
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            // First, call your API to sign out
            const response = await signOut();
            if (!response.success) {
                throw new Error(response.message);
            }

            // Then clear the local token
            const logoutResult = await authMiddleware.logout();
            if (!logoutResult.success) {
                throw new Error(logoutResult.message);
            }

            // Finally, navigate to sign in
            router.replace('/(auth)/SignIn');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error instanceof Error ? error.message : 'Failed to sign out',
                position: 'bottom'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleImageSelect = async () => {
        setIsMaintenanceModalVisible(true);
        // Commenting out the actual functionality for now
        /*
        const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!result.granted) {
            alert('Permission to access gallery is required!');
            return;
        }
        // ... rest of the code ...
        */
    };

    const handleTakePhoto = async () => {
        setIsMaintenanceModalVisible(true);
        // Commenting out the actual functionality for now
        /*
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (!cameraPermission.granted) {
            alert('Permission to access camera is required!');
            return;
        }
        // ... rest of the code ...
        */
    };

    const onSubmit = (data: ProfileFormData) => {
        console.log("Profile Updated:", data);
    };

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
        >
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>

            <View style={styles.container}>
                {/* Profile Avatar */}
                <View style={styles.avatarContainer}>
                    <Image
                        style={styles.avatar}
                        source={{ uri: selectedImage || 'https://via.placeholder.com/100' }}
                    />
                    <TouchableOpacity style={styles.editAvatarButton} onPress={() => setIsModalVisible(true)}>
                        <Text style={styles.editAvatarText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>Edit Profile</Text>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    <Controller
                        control={control}
                        name="firstName"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.firstName && styles.errorInput]}
                                placeholder="First Name"
                                placeholderTextColor="#999"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}

                    <Controller
                        control={control}
                        name="middleName"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Middle Name"
                                placeholderTextColor="#999"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="lastName"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.lastName && styles.errorInput]}
                                placeholder="Last Name"
                                placeholderTextColor="#999"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.email && styles.errorInput]}
                                placeholder="Email"
                                keyboardType="email-address"
                                placeholderTextColor="#999"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                    {/* Save Changes Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>

                {/* Settings & Help Sections */}
                <SettingsSection
                    title="Settings"
                    options={[
                        { id: 'notifications', label: "Notification Preferences", screen: "NotificationSettings", icon: "notifications-outline" },
                        { id: 'privacy', label: "Privacy Settings", screen: "PrivacySettings", icon: "lock-closed-outline" },
                        { id: 'language', label: "Language", screen: "LanguageSettings", icon: "language-outline" },
                        {
                            id: 'darkMode',
                            label: "Dark Mode",
                            screen: "NotificationSettings",
                            icon: "moon-outline",
                            isToggle: true,
                            value: isDarkMode,
                            onToggle: () => setIsDarkMode(!isDarkMode)
                        },
                    ]}
                    onPress={handleNavigate}
                />
                <SettingsSection
                    title="Help & Support"
                    options={[
                        { id: 'faq', label: "FAQ", screen: "FAQ" },
                        { id: 'support', label: "Contact Support", screen: "ContactSupport" },
                        { id: 'terms', label: "Terms & Privacy Policy", screen: "TermsPrivacyPolicy" },
                    ]}
                    onPress={handleNavigate}
                />

                <View style={styles.sectionContainer}>
                    <TouchableOpacity
                        style={[styles.logoutButton, isLoading && styles.disabledButton]}
                        onPress={handleLogout}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Image Picker Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Profile Picture</Text>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleTakePhoto}
                        >
                            <Ionicons name="camera" size={24} color="#fff" />
                            <Text style={styles.modalButtonText}>Take Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleImageSelect}
                        >
                            <Ionicons name="images" size={24} color="#fff" />
                            <Text style={styles.modalButtonText}>Choose from Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setIsModalVisible(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isMaintenanceModalVisible}
                onRequestClose={() => setIsMaintenanceModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Ionicons name="construct-outline" size={40} color="#4A90E2" />
                            <Text style={styles.modalTitle}>Coming Soon!</Text>
                        </View>
                        <Text style={styles.modalMessage}>
                            This section is currently under development. We're working to bring you these features soon!
                        </Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setIsMaintenanceModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>OK, Got it</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

type SettingsOption = {
    id: string;
    label: string;
    screen: keyof RootStackParamList;
    icon?: keyof typeof Ionicons.glyphMap;
    isToggle?: boolean;
    value?: boolean;
    onToggle?: () => void;
};

interface SettingsSectionProps {
    title: string;
    options: SettingsOption[];
    onPress: (screen: keyof RootStackParamList) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, options, onPress }) => (
    <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {options.map(({ id, label, screen, icon, isToggle, value, onToggle }) => (
            <TouchableOpacity
                key={id}
                style={styles.optionButton}
                onPress={() => isToggle ? onToggle?.() : onPress(screen)}
            >
                <View style={styles.optionLeft}>
                    {icon && <Ionicons name={icon} size={22} color="#666" style={styles.optionIcon} />}
                    <Text style={styles.optionText}>{label}</Text>
                </View>
                {isToggle ? (
                    <Switch
                        value={value}
                        onValueChange={onToggle}
                        trackColor={{ false: '#e9e9ea', true: '#81b0ff' }}
                        thumbColor={value ? '#4A90E2' : '#fff'}
                        ios_backgroundColor="#e9e9ea"
                    />
                ) : (
                    <Text style={styles.chevron}>›</Text>
                )}
            </TouchableOpacity>
        ))}
    </View>
);

const styles = StyleSheet.create({
    scrollView: { flex: 1, backgroundColor: '#f0f2f5' },
    scrollViewContent: { flexGrow: 1 },
    container: { padding: 20, alignItems: 'center', paddingTop: 60 },
    avatarContainer: { marginBottom: 30, alignItems: 'center', position: 'relative' },
    avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#4A90E2' },
    editAvatarButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#4A90E2', borderRadius: 20, paddingVertical: 5, paddingHorizontal: 10 },
    editAvatarText: { color: '#fff', fontSize: 14, fontWeight: '500' },
    title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    formContainer: { width: '100%', paddingHorizontal: 10 },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', marginBottom: 15, fontSize: 16 },
    errorInput: { borderColor: 'red' },
    errorText: { color: 'red', fontSize: 12, marginBottom: 10 },
    saveButton: { backgroundColor: '#4A90E2', paddingVertical: 15, borderRadius: 10, marginTop: 10, alignItems: 'center', width: '100%' },
    saveButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
    sectionContainer: { width: '100%', marginTop: 20, backgroundColor: '#fff', borderRadius: 10, padding: 15 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15 },
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
    chevron: { fontSize: 20, color: '#999' },
    logoutButton: { backgroundColor: 'red', paddingVertical: 15, borderRadius: 10, marginTop: 10, alignItems: 'center', width: '100%' },
    logoutButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
    backButton: { position: 'absolute', top: 40, left: 20, zIndex: 1, width: 40, height: 40, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', maxHeight: '80%', alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    modalButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 15,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    modalCloseButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    modalCloseButtonText: {
        color: '#666',
        fontSize: 16,
    },
    disabledButton: {
        opacity: 0.6,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },

    modalMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
        paddingHorizontal: 10,
    },

    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionIcon: {
        marginRight: 12,
    },

});

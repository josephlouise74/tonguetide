// SignUp.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../components/Input';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { createUser, getAllUser } from '../api/UserApi';
import Toast from 'react-native-toast-message';

// Define the validation schema
const signUpSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpScreen: React.FC = () => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);



    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: SignUpFormData) => {
        setIsLoading(true);
        try {
            const response = await createUser(data);
            console.log(response)
            if (response.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: response.message || 'Your account has been created successfully!',
                    position: 'bottom'
                });
            } else {
                throw new Error(response.message);
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to create account. Please try again.',
                position: 'bottom'
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="person-add-outline" size={80} color="#4CAF50" />
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Join Tongue Tide</Text>
                    <Text style={styles.subtitle}>Start Your Language Learning Journey</Text>

                    <View style={styles.inputGroup}>
                        <Controller
                            control={control}
                            name="firstName"
                            render={({ field: { onChange, value } }) => (
                                <>
                                    <Input
                                        placeholder="First Name"
                                        value={value}
                                        onChangeText={onChange}
                                        autoCapitalize="words"
                                        style={styles.input}
                                    />
                                    {errors.firstName && (
                                        <Text style={styles.errorText}>{errors.firstName.message}</Text>
                                    )}
                                </>
                            )}
                        />

                        <Controller
                            control={control}
                            name="middleName"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Middle Name (Optional)"
                                    value={value}
                                    onChangeText={onChange}
                                    autoCapitalize="words"
                                    style={styles.input}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="lastName"
                            render={({ field: { onChange, value } }) => (
                                <>
                                    <Input
                                        placeholder="Last Name"
                                        value={value}
                                        onChangeText={onChange}
                                        autoCapitalize="words"
                                        style={styles.input}
                                    />
                                    {errors.lastName && (
                                        <Text style={styles.errorText}>{errors.lastName.message}</Text>
                                    )}
                                </>
                            )}
                        />

                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <>
                                    <Input
                                        placeholder="Email"
                                        value={value}
                                        onChangeText={onChange}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        style={styles.input}
                                    />
                                    {errors.email && (
                                        <Text style={styles.errorText}>{errors.email.message}</Text>
                                    )}
                                </>
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <>
                                    <Input
                                        placeholder="Password"
                                        value={value}
                                        onChangeText={onChange}
                                        secureTextEntry
                                        style={styles.input}
                                    />
                                    {errors.password && (
                                        <Text style={styles.errorText}>{errors.password.message}</Text>
                                    )}
                                </>
                            )}
                        />
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.signInButton,
                            isLoading && styles.disabledButton
                        ]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                    >
                        <Text style={styles.signInButtonText}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.switchText}>
                        Already have an account?{' '}
                        <Text style={styles.linkText} onPress={() => router.push('/SignIn')}>
                            Sign In
                        </Text>
                    </Text>
                </View>
            </View>
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    iconContainer: {
        backgroundColor: '#e8f5e9',
        padding: 25,
        borderRadius: 60,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputGroup: {
        width: '100%',
        gap: 16,
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
    },
    signInButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 30,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
    },
    switchText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    linkText: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ff0000',
        fontSize: 12,
        marginTop: 4,
    },
    disabledButton: {
        backgroundColor: '#a5d6a7',  // lighter green
        opacity: 0.7,
    },
});

export default SignUpScreen;

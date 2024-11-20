// SignIn.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { signIn } from '../api/UserApi';
import { authMiddleware } from './authMiddleware';
import useUserStore from '../zustandStore/useUserStore';

// Define the validation schema
const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInScreen: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setToken } = useUserStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    authMiddleware.requireGuest();
  }, []);

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const response = await signIn(data);
      if (response.success) {
        // Update Zustand store
        setUser(response.user);
        setToken(response.token);

        // You can still keep these if needed for other purposes
        await Promise.all([
          authMiddleware.setToken(response.token),
          authMiddleware.setUserData(response.user)
        ]);

        router.replace('/(tabs)/home');
      }

      if (!response.success) {
        Toast.show({
          type: 'error',
          text1: 'Sign In Failed',
          text2: response.message || 'Failed to sign in',
          position: 'bottom',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
          onShow: () => console.log('Toast shown'),
          onHide: () => console.log('Toast hidden'),
          onPress: () => Toast.hide(),
          props: {
            uuid: 'unique-id'
          }
        });
      }
    } catch (error: any) {
      console.log(error)
      Toast.show({
        type: 'error',
        text1: 'Error Occurred',
        text2: error.response?.data?.message || 'Failed to sign in. Please try again.',
        position: 'bottom',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
        onPress: () => Toast.hide(),
        props: {
          uuid: 'error-id'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="language-outline" size={80} color="#4CAF50" />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome to Tongue Tide!</Text>
          <Text style={styles.subtitle}>Your Journey to Language Mastery</Text>

          <View style={styles.inputGroup}>
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
            style={[styles.signInButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            <Text style={styles.signInButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.switchText}>
            Don't have an account?{' '}
            <Text style={styles.linkText} onPress={() => router.push('/SignUp')}>
              Sign Up
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
    backgroundColor: '#a5d6a7',
    opacity: 0.7,
  },
  toastContainer: {
    width: '90%',
    borderRadius: 8,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3
  },
});

export default SignInScreen;

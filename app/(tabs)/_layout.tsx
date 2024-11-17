// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '../../src/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const TAB_ICON_SIZE = 24;

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            }}
        >
            {/* Home tab with custom icon */}
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home-outline" color={color} size={TAB_ICON_SIZE} />
                    ),
                }}
            />

            {/* Profile tab with custom icon */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person-outline" color={color} size={TAB_ICON_SIZE} />
                    ),
                }}
            />

            <Tabs.Screen
                name="practice"
                options={{
                    title: '',
                    headerShown: false,
                    tabBarButton: () => null,
                }}
            />

            {/* Other screens hidden from bottom tabs */}
            <Tabs.Screen
                name="language-exchange"
                options={{
                    title: 'Language Exchange',
                    headerShown: false,
                    headerTitle: '',
                    tabBarButton: () => null,
                }}
            />
            <Tabs.Screen
                name="vocaItem"
                options={{
                    title: 'Vocabulary Item',
                    headerShown: false,
                    headerTitle: '',
                    tabBarButton: () => null,
                }}
            />
            <Tabs.Screen
                name="vocabulary"
                options={{
                    title: 'Daily Vocabulary',
                    headerShown: false,
                    headerTitle: '',
                    tabBarButton: () => null,
                }}
            />
            <Tabs.Screen
                name="speaking-challenge"
                options={{
                    title: 'Speaking Challenge',
                    headerShown: false,
                    headerTitle: '',
                    tabBarButton: () => null,
                }}
            />
            <Tabs.Screen
                name="challenges"
                options={{
                    title: 'Challenges',
                    headerShown: false,
                    headerTitle: '',
                    tabBarButton: () => null,
                }}
            />
            <Tabs.Screen
                name="my-progress"
                options={{
                    title: 'My Progress',
                    headerShown: false,
                    headerTitle: '',
                    tabBarButton: () => null,
                }}
            />
        </Tabs>
    );
}

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../context/AppContext';
import { colors, font } from '../theme/theme';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

import HomeScreen from '../screens/HomeScreen';
import FeedScreen from '../screens/FeedScreen';
import DirectoryScreen from '../screens/DirectoryScreen';
import MarketScreen from '../screens/MarketScreen';
import HelpScreen from '../screens/HelpScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import SchemesScreen from '../screens/SchemesScreen';
import SchemeDetailScreen from '../screens/SchemeDetailScreen';
import GroupsScreen from '../screens/GroupsScreen';
import GroupDetailScreen from '../screens/GroupDetailScreen';
import ThreadScreen from '../screens/ThreadScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import MandiPricesScreen from '../screens/MandiPricesScreen';
import HelpBoardScreen from '../screens/HelpBoardScreen';
import PanchayatCalendarScreen from '../screens/PanchayatCalendarScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const icons = {
  Home: 'home',
  Feed: 'megaphone',
  Directory: 'call',
  Market: 'storefront',
  Help: 'document-text',
  Profile: 'person',
};

function Tabs() {
  const { t } = useApp();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { ...font.tiny, fontWeight: '700' },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={focused ? icons[route.name] : `${icons[route.name]}-outline`}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('home') }} />
      <Tab.Screen name="Feed" component={FeedScreen} options={{ tabBarLabel: t('feed') }} />
      <Tab.Screen name="Directory" component={DirectoryScreen} options={{ tabBarLabel: t('directory') }} />
      <Tab.Screen name="Market" component={MarketScreen} options={{ tabBarLabel: t('market') }} />
      <Tab.Screen name="Help" component={HelpScreen} options={{ tabBarLabel: t('help') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('profile') }} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  const { onboarded } = useApp();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={onboarded ? 'Login' : 'Onboarding'}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Schemes" component={SchemesScreen} />
      <Stack.Screen name="SchemeDetail" component={SchemeDetailScreen} />
      <Stack.Screen name="Groups" component={GroupsScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <Stack.Screen name="Thread" component={ThreadScreen} />
      <Stack.Screen name="MandiPrices" component={MandiPricesScreen} />
      <Stack.Screen name="HelpBoard" component={HelpBoardScreen} />
      <Stack.Screen name="PanchayatCalendar" component={PanchayatCalendarScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user } = useApp();
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />;
  }

  return (
    <NavigationContainer key={user ? 'app-user' : 'auth-guest'}>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

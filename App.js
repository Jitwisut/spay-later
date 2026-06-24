import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppProvider, useApp } from './src/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import BillsScreen from './src/screens/BillsScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PersonalInfoScreen from './src/screens/PersonalInfoScreen';
import BankAccountScreen from './src/screens/BankAccountScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import PinScreen from './src/screens/PinScreen';
import CheckoutOverlay from './src/components/CheckoutOverlay';
import PayBottomSheet from './src/components/PayBottomSheet';
import { C } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const tabs = [
    { name: 'Home', label: 'หน้าแรก', icon: '⌂' },
    { name: 'Products', label: 'สินค้า', icon: '▣' },
    { name: 'Bills', label: 'บิล', icon: '▤' },
    { name: 'Profile', label: 'ฉัน', icon: '◯' },
  ];
  return (
    <View style={[s.tabBar, { paddingBottom: insets.bottom + 4 }]}>
      {tabs.map((tab, i) => {
        const focused = state.index === i;
        return (
          <TouchableOpacity key={tab.name} style={s.tabItem} onPress={() => navigation.navigate(tab.name)} activeOpacity={0.7}>
            <Text style={[s.tabIcon, focused && s.tabIconActive]}>{tab.icon}</Text>
            <Text style={[s.tabLabel, focused && s.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Bills" component={BillsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function MainStack({ onLogout }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="BankAccount" component={BankAccountScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Notification" component={NotificationScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Pin">
        {() => <PinScreen onSuccess={onLogout} mode="lock" />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function AppContent() {
  const { dbReady } = useApp();
  const [authed, setAuthed] = useState(false);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 32, fontWeight: '700', color: C.dark }}>S</Text>
        <Text style={{ marginTop: 12, fontSize: 14, color: C.muted }}>กำลังโหลด...</Text>
      </View>
    );
  }

  if (!authed) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
        <PinScreen onSuccess={() => setAuthed(true)} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
        <MainStack onLogout={() => setAuthed(false)} />
      </SafeAreaView>
      <CheckoutOverlay />
      <PayBottomSheet />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  tabBar: { flexDirection: 'row', backgroundColor: C.dark, paddingTop: 12, paddingHorizontal: 30 },
  tabItem: { flex: 1, alignItems: 'center' },
  tabIcon: { fontSize: 20, color: '#6E6E66' },
  tabIconActive: { color: C.lime },
  tabLabel: { fontSize: 10, color: '#6E6E66', marginTop: 3 },
  tabLabelActive: { color: C.white, fontWeight: '600' },
});

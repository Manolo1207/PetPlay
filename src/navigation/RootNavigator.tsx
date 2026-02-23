// src/navigation/RootNavigator.tsx

import React from 'react';
import { hasSeenOnboarding, setOnboardingSeen } from '../utils/onboarding';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

// Importa nuestros navegadores de Stack y Tabs
import AuthNavigator from './AuthNavigator';
import MainTabsNavigator from './MainTabsNavigator';

// Importa pantallas del root stack
import DogProfileScreen from '../screens/DogProfileScreen';
import { LostDogScreen } from '../screens/LostDogScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MatchSuccessScreen from '../screens/MatchSuccessScreen';

// Importamos nuestros servicios de autenticación de Firebase
import { authService } from '../services/auth';
import { User } from 'firebase/auth';
import { RootStackParamList } from '../types/navigation';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ChatScreen } from '../screens/ChatScreen';
import LegalScreen from '../screens/LegalScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();

// --- Componente Principal del Navegador Raíz ---
const RootNavigator = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  // DEV: simulate a logged-in user so we can explore MainTabs without Firebase.
  // This is intentionally only active during development and is safe to revert.
  const [user, setUser] = React.useState<User | null>(
    __DEV__ ? ({ uid: 'dev', displayName: 'Developer' } as any) : null
  );

  React.useEffect(() => {
    (async () => {
      // Checa si ya vio el onboarding
      const seen = await hasSeenOnboarding();
      setShowOnboarding(!seen);

      if (__DEV__) {
        setIsLoading(false);
        return;
      }

      const unsubscribe = authService.observe((authUser: User | null) => {
        setUser(authUser);
        setIsLoading(false);
      });
      return () => unsubscribe();
    })();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando aplicación...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {showOnboarding ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Onboarding" component={(props: any) => (
            <OnboardingScreen {...props} onFinish={async () => {
              await setOnboardingSeen();
              setShowOnboarding(false);
            }} />
          )} />
        </RootStack.Navigator>
      ) : user ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="MainTabs" component={MainTabsNavigator} />
          <RootStack.Screen
            name="DogProfile"
            component={DogProfileScreen}
            options={{
              headerShown: true,
              title: 'Perfil del Perro',
            }}
          />
          <RootStack.Screen
            name="LostDog"
            component={LostDogScreen}
            options={{
              headerShown: true,
              title: 'Reportar Perro Perdido',
            }}
          />
          <RootStack.Screen
            name="MatchSuccess"
            component={require('../screens/MatchSuccessScreen').default}
            options={{
              headerShown: true,
              title: '¡Match logrado!',
            }}
          />
          <RootStack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: true,
              title: 'Configuración',
            }}
          />
          <RootStack.Screen
            name="Legal"
            component={LegalScreen}
            options={{
              headerShown: true,
              title: 'Legal',
            }}
          />
          <RootStack.Screen
            name="Chat"
            component={({ route }: { route: { params: { chatId: string; otherUserName: string } } }) => (
              <ChatScreen chatId={route.params.chatId} otherUserName={route.params.otherUserName} />
            )}
            options={{
              headerShown: true,
              title: 'Chat',
            }}
          />
        </RootStack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );

}



export default RootNavigator;
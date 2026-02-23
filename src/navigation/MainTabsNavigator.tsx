// src/navigation/MainTabsNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importar pantallas reales desde src/screens
import { HomeScreen } from '../screens/HomeScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { ChatsScreen } from '../screens/ChatsScreen';
import { ExerciseScreen } from '../screens/ExerciseScreen';

// Tipos para los parámetros de navegación
export type MainTabParamList = {
  Home: undefined;
  Community: undefined;
  Exercise: undefined;
  Chats: undefined;
  Profile: undefined;
};

const MainTab = createBottomTabNavigator<MainTabParamList>();

// --- Componente del Navegador de Pestañas Principales ---
const MainTabsNavigator = () => {
  const [unreadChats, setUnreadChats] = React.useState(0);
  const { user } = require('../hooks/useAuth').useAuth();
  React.useEffect(() => {
    const load = async () => {
      if (user) {
        const chatService = require('../services/chatService').chatService;
        const chats = await chatService.getUserChats(user.uid);
        const unread = chats.filter((c: any) => c.unreadCount && c.unreadCount[user.uid] > 0).length;
        setUnreadChats(unread);
      }
    };
    load();
  }, [user]);
  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainTab.Screen
        name="Home"
        component={HomeScreen as React.ComponentType}
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
        }}
      />
      <MainTab.Screen
        name="Community"
        component={CommunityScreen as React.ComponentType}
        options={{
          title: 'Comunidad',
          tabBarLabel: 'Comunidad',
        }}
      />
      <MainTab.Screen
        name="Exercise"
        component={ExerciseScreen as React.ComponentType}
        options={{
          title: 'Ejercicio',
          tabBarLabel: 'Ejercicio',
        }}
      />
      <MainTab.Screen
        name="Chats"
        component={ChatsScreen as React.ComponentType}
        options={{
          title: 'Chats',
          tabBarLabel: 'Chats',
          tabBarBadge: unreadChats > 0 ? unreadChats : undefined,
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen as React.ComponentType}
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
        }}
      />
    </MainTab.Navigator>
  );
};

export default MainTabsNavigator;
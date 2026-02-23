// src/navigation/AuthNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native'; // Para pantallas placeholder

// Tipos para los parámetros de navegación (se pueden mover a src/types/navigation.ts más adelante)
export type AuthStackParamList = {
    Onboarding: undefined;
    Login: undefined;
    Register: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

// --- Pantallas de Autenticación (Placeholders por ahora) ---
// Crearemos estas en src/screens/ más adelante.
// Por ahora, solo son componentes básicos para que compile el navegador.
const OnboardingScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Onboarding Screen</Text>
    </View>
);
const LoginScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Login Screen</Text>
    </View>
);
const RegisterScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Register Screen</Text>
    </View>
);

// --- Componente del Stack de Autenticación ---
const AuthNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
};

export default AuthNavigator;
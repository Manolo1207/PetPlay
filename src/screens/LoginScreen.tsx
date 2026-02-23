import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Button, Input, ScreenContainer } from '../components';
import { SocialButton } from '../components/SocialButton';
import { facebookLogo, googleLogo, appleLogo } from '../assets/socialLogos';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-facebook';
import { FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../services/firebase';
import { authService } from '../services/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import { OAuthProvider } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const handleAppleLogin = async () => {
    try {
      await authService.loginWithApple();
      Alert.alert('Éxito', 'Sesión iniciada con Apple');
      navigation.navigate('MainTabs');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error al iniciar sesión con Apple';
      Alert.alert('Error', errorMsg);
    }
  };
  const handleFacebookLogin = async () => {
    try {
      // Reemplaza 'YOUR_FACEBOOK_APP_ID' por tu App ID real
      await authService.loginWithFacebook('YOUR_FACEBOOK_APP_ID');
      Alert.alert('Éxito', 'Sesión iniciada con Facebook');
      navigation.navigate('MainTabs');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error al iniciar sesión con Facebook';
      Alert.alert('Error', errorMsg);
    }
  };
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '334517162215-8unpo7lbcifa0aa1urnfchoh2r2q49pr.apps.googleusercontent.com',
    iosClientId: '334517162215-5aui9rjejqsnu7hbrtt3dqh3dlds902i.apps.googleusercontent.com',
    androidClientId: '334517162215-3j7f0g45r9s5hrqjcn9ok8auosio2s6k.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  React.useEffect(() => {
    const loginWithGoogle = async (idToken: string) => {
      try {
        await authService.loginWithGoogleIdToken(idToken);
        Alert.alert('Éxito', 'Sesión iniciada con Google');
        navigation.navigate('MainTabs');
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Error al iniciar sesión con Google');
      }
    };
    if (response?.type === 'success') {
      const idToken = response.authentication && 'idToken' in response.authentication ? response.authentication.idToken : undefined;
      if (idToken) {
        loginWithGoogle(idToken);
      } else {
        Alert.alert('Error', 'No se obtuvo el token de Google');
      }
    }
  }, [response]);
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const emailRegex = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+-=]{6,}$/;
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!emailRegex.test(email)) newErrors.email = 'Email inválido';
    if (!passwordRegex.test(password)) newErrors.password = 'Debe tener mínimo 6 caracteres, una letra y un número';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await login(email, password);
      Alert.alert('Éxito', 'Sesión iniciada');
      navigation.navigate('MainTabs');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer title="Iniciar Sesión">
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>
          Bienvenido de vuelta a PetPlay 🐾
        </Text>

        <View style={styles.formContainer}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!loading}
            error={errors.email}
          />

          <Input
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            error={errors.password}
          />
        </View>

        <Button
          title="Iniciar Sesión"
          onPress={handleLogin}
          disabled={loading || Object.keys(errors).length > 0 || !email || !password}
        />

        <Button
          title="Iniciar sesión con Google"
          onPress={() => promptAsync()}
          variant="secondary"
          disabled={!request || loading}
        />
        <SocialButton
          title="Google"
          onPress={() => promptAsync()}
          logo={googleLogo}
          variant="google"
          disabled={!request || loading}
        />
        <SocialButton
          title="Facebook"
          onPress={handleFacebookLogin}
          logo={facebookLogo}
          variant="facebook"
          disabled={loading}
        />
        <SocialButton
          title="Apple"
          onPress={handleAppleLogin}
          logo={appleLogo}
          variant="apple"
          disabled={loading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Register')}
          >
            Crea una ahora
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  link: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

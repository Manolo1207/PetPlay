import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Button, Input, ScreenContainer, ImagePickerField } from '../components';
import { SocialButton } from '../components/SocialButton';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-facebook';
import { FacebookAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import { OAuthProvider } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const handleAppleRegister = async () => {
    try {
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (appleCredential.identityToken) {
        const provider = new OAuthProvider('apple.com');
        const firebaseCredential = provider.credential({
          idToken: appleCredential.identityToken,
        });
        await signInWithCredential(auth, firebaseCredential);
        Alert.alert('Éxito', 'Cuenta creada con Apple');
        navigation.navigate('MainTabs');
      } else {
        Alert.alert('Cancelado', 'Registro cancelado');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error al crear cuenta con Apple';
      Alert.alert('Error', errorMsg);
    }
  };
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [dogPhoto, setDogPhoto] = useState<string | null>(null);
  const handleFacebookRegister = async () => {
    try {
      await Facebook.initializeAsync({
        appId: 'YOUR_FACEBOOK_APP_ID',
        appName: 'PetPlay',
      });
      const result = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });
      if (result.type === 'success' && result.token) {
        const credential = FacebookAuthProvider.credential(result.token);
        await signInWithCredential(auth, credential);
        Alert.alert('Éxito', 'Cuenta creada con Facebook');
        navigation.navigate('MainTabs');
      } else {
        Alert.alert('Cancelado', 'Registro cancelado');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error al crear cuenta con Facebook';
      Alert.alert('Error', errorMsg);
    }
  };
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '334517162215-9q7q7q7q7q7q7q7q7q7q7q7q7q7q7q7q.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication && 'idToken' in response.authentication ? response.authentication.idToken : undefined;
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert('Éxito', 'Cuenta creada con Google');
          navigation.navigate('MainTabs');
        })
        .catch((error) => {
          Alert.alert('Error', error.message || 'Error al crear cuenta con Google');
        });
    }
  }, [response]);
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [zone, setZone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const emailRegex = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+-=]{6,}$/;
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'El nombre es requerido';
    else if (name.length < 3) newErrors.name = 'Mínimo 3 caracteres';
    if (!emailRegex.test(email)) newErrors.email = 'Email inválido';
    if (!passwordRegex.test(password)) newErrors.password = 'Debe tener mínimo 6 caracteres, una letra y un número';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (!zone.trim()) newErrors.zone = 'La zona es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      await register(email, password, name, zone);
      Alert.alert('Éxito', 'Cuenta creada correctamente');
      navigation.navigate('MainTabs');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrarse';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer title="Crear Cuenta">
      <ScrollView contentContainerStyle={styles.content}>
        <ImagePickerField
          imageUri={profilePhoto}
          onChange={setProfilePhoto}
          label="Foto de perfil"
        />

        <Input
          placeholder="Nombre completo"
          value={name}
          onChangeText={setName}
          editable={!loading}
          error={errors.name}
        />

        <ImagePickerField
          imageUri={dogPhoto}
          onChange={setDogPhoto}
          label="Foto de tu perrito"
        />
        <Input
          placeholder="Nombre completo"
          value={name}
          onChangeText={setName}
          editable={!loading}
          error={errors.name}
        />

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

        <Input
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
          error={errors.confirmPassword}
        />

        <Input
          placeholder="Tu zona / colonia"
          value={zone}
          onChangeText={setZone}
          editable={!loading}
          error={errors.zone}
        />

        <Button
          title="Crear Cuenta"
          onPress={handleRegister}
          disabled={loading || Object.keys(errors).length > 0 || !name || !email || !password || !confirmPassword || !zone}
        />

        <Button
          title="Registrarse con Google"
          onPress={() => promptAsync()}
          variant="secondary"
          disabled={!request || loading}
        />
        <SocialButton
          title="Google"
          onPress={() => promptAsync()}
          logo={null}
          variant="google"
          disabled={!request || loading}
        />
        <SocialButton
          title="Facebook"
          onPress={handleFacebookRegister}
          logo={null}
          variant="facebook"
          disabled={loading}
        />
        <SocialButton
          title="Apple"
          onPress={handleAppleRegister}
          logo={null}
          variant="apple"
          disabled={loading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Login')}
          >
            Inicia sesión
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

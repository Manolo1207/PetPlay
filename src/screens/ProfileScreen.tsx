import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, ScreenContainer, Input } from '../components';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth';

const ProfileScreen = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editZone, setEditZone] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ name: '', zone: '', email: '', photoUrl: '' });
  const [photoUploading, setPhotoUploading] = useState(false);
  const handlePickPhoto = async () => {
    if (!user) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setPhotoUploading(true);
      try {
        // Subir la imagen a Firebase Storage y actualizar Firestore
        const localUri = result.assets[0].uri;
        await authService.updateUserProfile(user.uid, { photoUrl: localUri });
        // Recargar datos del usuario para obtener el nuevo download URL
        const updatedData = await authService.getUserData(user.uid);
        setUserData((prev) => ({ ...prev, photoUrl: updatedData?.photoUrl || '' }));
        Alert.alert('Foto actualizada');
      } catch (e) {
        Alert.alert('Error', 'No se pudo actualizar la foto');
      } finally {
        setPhotoUploading(false);
      }
    }
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    authService.getUserData(user.uid)
      .then((data) => {
        if (data) {
          setUserData({
            name: data.name || '',
            zone: data.zone || '',
            email: data.email || user.email || '',
            photoUrl: data.photoUrl || '',
          });
          setEditName(data.name || '');
          setEditZone(data.zone || '');
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await authService.updateUserProfile(user.uid, { name: editName, zone: editZone });
      setUserData((prev) => ({ ...prev, name: editName, zone: editZone }));
      setEditMode(false);
      Alert.alert('Perfil actualizado');
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer title="Perfil">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer title="Perfil">
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.avatar} onPress={editMode ? handlePickPhoto : undefined} disabled={!editMode || photoUploading} accessibilityLabel="Cambiar foto de perfil">
            {userData.photoUrl ? (
              <Image
                source={{ uri: userData.photoUrl }}
                style={styles.avatarImg}
                resizeMode="cover"
                accessibilityLabel="Foto de perfil del usuario"
              />
            ) : (
              <Image
                source={require('../../assets/dog-placeholder.png')}
                style={styles.avatarImg}
                resizeMode="cover"
                accessibilityLabel="Foto de perfil por defecto"
              />
            )}
            {editMode && (
              <View style={styles.editPhotoOverlay}>
                <Text style={styles.editPhotoText}>{photoUploading ? 'Subiendo...' : 'Cambiar'}</Text>
              </View>
            )}
          </TouchableOpacity>
          {editMode ? (
            <>
              <Input
                value={editName}
                onChangeText={setEditName}
                placeholder="Nombre"
                style={styles.editInput}
                editable={!saving}
              />
              <Input
                value={editZone}
                onChangeText={setEditZone}
                placeholder="Zona"
                style={styles.editInput}
                editable={!saving}
              />
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <Button title="Guardar" onPress={handleSave} disabled={saving} />
                <View style={{ width: 12 }} />
                <Button title="Cancelar" onPress={() => setEditMode(false)} variant="secondary" />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.zone}>📍 {userData.zone}</Text>
              <Text style={styles.email}>{userData.email}</Text>
              <View style={{ marginTop: 8 }}>
                <Button title="Editar perfil" onPress={() => setEditMode(true)} />
              </View>
            </>
          )}
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  zone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#999',
  },
  editInput: {
    marginBottom: 8,
  },
  editPhotoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    paddingVertical: 4,
  },
  editPhotoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;

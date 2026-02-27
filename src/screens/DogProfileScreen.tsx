import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Alert, Image, Platform, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Button, Input, ScreenContainer } from '../components';
import { Snackbar } from '../components/Snackbar';
import { useAuth } from '../hooks/useAuth';
import { dogService } from '../services';
import { HealthEventsList } from '../components/HealthEventsList';
import { AddHealthEventForm } from '../components/AddHealthEventForm';
import { Dog } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'DogProfile'>;

const DogProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  // Estado y función para refrescar la lista de eventos de salud
  const [healthEventsKey, setHealthEventsKey] = React.useState(0);
  const refreshHealthEvents = () => setHealthEventsKey(k => k + 1);
  const { user } = useAuth();
  const isNew = route.params.dogId === 'new';

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [ageCategory, setAgeCategory] = useState('adulto');
  const [gender, setGender] = useState('macho');
  const [size, setSize] = useState('mediano');
  const [energyLevel, setEnergyLevel] = useState('medio');
  const [personality, setPersonality] = useState<string[]>([]);
  const [zone, setZone] = useState('');
  const [compatibility, setCompatibility] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originalDog, setOriginalDog] = useState<Dog | null>(null);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });

  React.useEffect(() => {
    const loadDog = async () => {
      if (!isNew) {
        try {
          setLoading(true);
          const dog = await dogService.getDogById(route.params.dogId);
          if (dog) {
            setOriginalDog(dog);
            setName(dog.name || '');
            setBreed((dog as any).breed || '');
            setAgeCategory((dog as any).ageCategory || 'adulto');
            setGender((dog as any).gender || 'macho');
            setSize((dog as any).size || 'mediano');
            setEnergyLevel((dog as any).energyLevel || 'medio');
            setPersonality((dog as any).personality || []);
            setCompatibility((dog as any).compatibility || []);
            setPhotoUrl((dog as any).photoUrl || '');
            setZone(dog.zone || '');
          }
        } catch (e) {
          // ignore
        } finally {
          setLoading(false);
        }
      }
    };

    loadDog();
  }, [isNew, route.params.dogId]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateDogForm = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'El nombre es requerido';
    else if (name.length < 2) errors.name = 'Mínimo 2 caracteres';
    if (!breed.trim()) errors.breed = 'La raza es requerida';
    if (!zone.trim()) errors.zone = 'La zona es requerida';
    if (!personality.length) errors.personality = 'Personalidad requerida';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDog = async () => {
    if (!user || !validateDogForm()) {
      setSnackbar({ visible: true, message: 'Por favor completa todos los campos correctamente' });
      return;
    }

    try {
      setLoading(true);

      let ownerId = user.uid;
      let finalPhotoUrl = photoUrl;
      if (photoUrl && (photoUrl.startsWith('file://') || photoUrl.startsWith('content://'))) {
        setPhotoUploading(true);
        try {
          // Subir la imagen a Firebase Storage
          const response = await fetch(photoUrl);
          const blob = await response.blob();
          const { storage } = require('../services/firebase');
          const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
          const storageRef = ref(storage, `dogPhotos/${ownerId}_${Date.now()}`);
          await uploadBytes(storageRef, blob);
          finalPhotoUrl = await getDownloadURL(storageRef);
        } catch (e) {
          Alert.alert('Error', 'No se pudo subir la foto');
        } finally {
          setPhotoUploading(false);
        }
      }
      const dogData: Omit<Dog, 'id' | 'createdAt'> = {
        ownerId,
        name,
        breed,
        photoUrl: finalPhotoUrl || 'https://via.placeholder.com/300',
        ageCategory: ageCategory as any,
        gender: gender as any,
        size: size as any,
        energyLevel: energyLevel as any,
        personality,
        compatibility,
        zone,
        isLost: (originalDog as any)?.isLost || false,
      };

      if (isNew) {
        await dogService.createDog(dogData);
        setSnackbar({ visible: true, message: '¡Perfil de tu perro creado correctamente!' });
      } else {
        await dogService.updateDog(route.params.dogId, dogData);
        setSnackbar({ visible: true, message: '¡Perfil actualizado!' });
      }

      setTimeout(() => navigation.goBack(), 1200);
    } catch (error) {
      setSnackbar({ visible: true, message: 'No pudimos guardar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de detalle (solo vista, no edición)
  if (!isNew && originalDog) {
    return (
      <ScreenContainer title={originalDog.name || 'Detalle del perro'}>
        <ScrollView contentContainerStyle={styles.detailContent}>
          {/* Foto grande */}
          <View style={styles.imageContainer}>
            <View style={styles.imageShadow}>
              <View style={styles.imageBorder}>
                <View style={styles.imageInner}>
                  <Image
                    source={originalDog.photoUrl ? { uri: originalDog.photoUrl } : require('../../assets/dog-placeholder.png')}
                    style={{ width: 220, height: 220, borderRadius: 110 }}
                    resizeMode="cover"
                    accessibilityLabel={originalDog.name}
                  />
                </View>
              </View>
            </View>
          </View>
          {/* Personalidad destacada */}
          <Text style={styles.detailTitle}>{originalDog.name}</Text>
          <Text style={styles.detailBreed}>{originalDog.breed}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Personalidad:</Text>
            <Text style={styles.detailValue}>{(originalDog.personality || []).join(', ')}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nivel de energía:</Text>
            <Text style={styles.detailValue}>{originalDog.energyLevel}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Zona:</Text>
            <Text style={styles.detailValue}>{originalDog.zone}</Text>
          </View>
          {/* Calendario de Salud */}
          <AddHealthEventForm dogId={originalDog.id} onEventAdded={refreshHealthEvents} />
          <HealthEventsList dogId={originalDog.id} key={healthEventsKey} />
          {/* Texto emocional */}
          <View style={styles.emotionBox}>
            <Text style={styles.emotionText}>
              {`Ideal para jugar en parques y convivir con otros perritos. ${originalDog.name} es ${originalDog.personality?.[0] || 'muy amigable'} y tiene energía ${originalDog.energyLevel}. ¡Te va a encantar!`}
            </Text>
          </View>
        </ScrollView>
        <Snackbar visible={snackbar.visible} message={snackbar.message} onHide={() => setSnackbar({ visible: false, message: '' })} />
      </ScreenContainer>
    );
  }

  // Pantalla de edición/creación
  return (
    <ScreenContainer title={isNew ? 'Nuevo Perrito' : 'Editar Perrito'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Foto del perrito */}
        <TouchableOpacity style={styles.avatar} onPress={async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });
          if (!result.canceled && result.assets && result.assets[0].uri) {
            setPhotoUrl(result.assets[0].uri);
          }
        }} disabled={photoUploading} accessibilityLabel="Cambiar foto del perrito">
          <Image
            source={photoUrl ? { uri: photoUrl } : require('../../assets/dog-placeholder.png')}
            style={styles.avatarImg}
            resizeMode="cover"
            accessibilityLabel="Foto del perrito"
          />
          <View style={styles.editPhotoOverlay}>
            <Text style={styles.editPhotoText}>{photoUploading ? 'Subiendo...' : 'Cambiar foto'}</Text>
          </View>
        </TouchableOpacity>
        <Input
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
          editable={!loading}
          error={formErrors.name}
        />
        <Input
          placeholder="Raza"
          value={breed}
          onChangeText={setBreed}
          editable={!loading}
          error={formErrors.breed}
        />
        <Input
          placeholder="Zona"
          value={zone}
          onChangeText={setZone}
          editable={!loading}
          error={formErrors.zone}
        />
        {/* Selectores de personalidad */}
        <Text style={styles.label}>Personalidad</Text>
        <View style={styles.row}>
          {['juguetón', 'tranquilo', 'sociable', 'protector', 'curioso', 'obediente'].map((trait) => (
            <TouchableOpacity
              key={trait}
              style={[styles.chip, personality.includes(trait) && styles.chipSelected]}
              onPress={() => setPersonality((prev) => prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait])}
              disabled={loading}
            >
              <Text style={[styles.chipText, personality.includes(trait) && styles.chipTextSelected]}>{trait}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Selectores de compatibilidad */}
        <Text style={styles.label}>Compatibilidad</Text>
        <View style={styles.row}>
          {['niños', 'perros', 'gatos', 'adultos', 'mayores'].map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, compatibility.includes(c) && styles.chipSelected]}
              onPress={() => setCompatibility((prev) => prev.includes(c) ? prev.filter(t => t !== c) : [...prev, c])}
              disabled={loading}
            >
              <Text style={[styles.chipText, compatibility.includes(c) && styles.chipTextSelected]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Selectores de género, tamaño, energía, edad */}
        <Text style={styles.label}>Género</Text>
        <View style={styles.row}>
          {['macho', 'hembra'].map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.chip, gender === g && styles.chipSelected]}
              onPress={() => setGender(g)}
              disabled={loading}
            >
              <Text style={[styles.chipText, gender === g && styles.chipTextSelected]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Tamaño</Text>
        <View style={styles.row}>
          {['pequeño', 'mediano', 'grande'].map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, size === s && styles.chipSelected]}
              onPress={() => setSize(s)}
              disabled={loading}
            >
              <Text style={[styles.chipText, size === s && styles.chipTextSelected]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Nivel de energía</Text>
        <View style={styles.row}>
          {['bajo', 'medio', 'alto'].map((e) => (
            <TouchableOpacity
              key={e}
              style={[styles.chip, energyLevel === e && styles.chipSelected]}
              onPress={() => setEnergyLevel(e)}
              disabled={loading}
            >
              <Text style={[styles.chipText, energyLevel === e && styles.chipTextSelected]}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Edad</Text>
        <View style={styles.row}>
          {['cachorro', 'adulto', 'senior'].map((a) => (
            <TouchableOpacity
              key={a}
              style={[styles.chip, ageCategory === a && styles.chipSelected]}
              onPress={() => setAgeCategory(a)}
              disabled={loading}
            >
              <Text style={[styles.chipText, ageCategory === a && styles.chipTextSelected]}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title={isNew ? 'Crear Perrito' : 'Guardar Cambios'}
          onPress={handleSaveDog}
          disabled={loading || Object.keys(formErrors).length > 0 || !name || !breed || !zone || !personality}
        />
      </ScrollView>
      <Snackbar visible={snackbar.visible} message={snackbar.message} onHide={() => setSnackbar({ visible: false, message: '' })} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'center',
    position: 'relative',
  },
  avatarImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
  },
  editPhotoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
    paddingVertical: 4,
  },
  editPhotoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chip: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  chipSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  chipText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#fff',
  },
  detailContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  imageShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 120,
  },
  imageBorder: {
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 120,
    padding: 4,
  },
  imageInner: {
    borderRadius: 110,
    overflow: 'hidden',
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  detailBreed: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'center',
  },
  detailLabel: {
    fontWeight: '600',
    color: '#444',
    marginRight: 6,
  },
  detailValue: {
    color: '#222',
  },
  emotionBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginTop: 18,
    marginBottom: 24,
    alignSelf: 'stretch',
  },
  emotionText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    // use spacing on children instead of gap for web compatibility
  },
  halfInput: {
    flex: 1,
  },
  halfInputSpacing: {
    marginRight: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
});

export default DogProfileScreen;

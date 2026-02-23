import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, Alert, Image } from 'react-native';
// import placeholderImg from '../../assets/placeholder.png';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Button, Input, ScreenContainer } from '../components';
import { useAuth } from '../hooks/useAuth';
import { useOwnerDogs } from '../hooks/useDogs';
import { lostDogService, dogService } from '../services';
import { LostDogAlert } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'LostDog'>;

export const LostDogScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = useAuth();
  const { dogs } = useOwnerDogs(user?.uid);
  const [selectedDogId, setSelectedDogId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Si viene un dogId desde la ruta, seleccionarlo automáticamente
  useEffect(() => {
    if (route.params?.dogId && route.params.dogId !== 'new') {
      setSelectedDogId(route.params.dogId);
    }
  }, [route.params]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedDogId) newErrors.selectedDogId = 'Selecciona un perrito';
    if (!description.trim()) newErrors.description = 'La descripción es requerida';
    if (!location.trim()) newErrors.location = 'La ubicación es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReportLost = async () => {
    if (!validateForm() || !user) return;

    try {
      setLoading(true);

      const selectedDog = dogs.find((d) => d.id === selectedDogId);
      if (!selectedDog) {
        Alert.alert('Error', 'Perrito no encontrado');
        return;
      }

      // Crear la alerta
      const alertData: Omit<LostDogAlert, 'id'> = {
        ownerId: user.uid,
        dogId: selectedDog.id,
        dogName: selectedDog.name,
        description,
        location,
        date: Date.now(),
        resolved: false,
        photo: selectedDog.photoUrl || 'https://via.placeholder.com/300',
      };

      await lostDogService.reportLostDog(alertData);

      // Marcar el perro como perdido
      await dogService.updateDog(selectedDog.id, {
        isLost: true,
        lostDate: Date.now(),
        lostDescription: description,
      });

      Alert.alert(
        'Alerta creada',
        'Tu comunidad ha sido notificada. ¡Esperamos que encuentres a tu perrito pronto! 🐾',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No pudimos crear la alerta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (dogs.length === 0) {
    return (
      <ScreenContainer title="Perrito Perdido">
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🐕</Text>
          <Text style={styles.emptyTitle}>No tienes perritos registrados</Text>
          <Text style={styles.emptyText}>
            Primero necesitas crear un perfil para tu perrito
          </Text>
          <Button
            title="Crear Perfil de Perrito"
            onPress={() => navigation.navigate('DogProfile', { dogId: 'new' })}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer title="Reportar Perrito Perdido">
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>
          Si tu perrito se perdió, crea una alerta para que tu comunidad pueda ayudar 🚨
        </Text>

        {/* Mostrar foto del perrito seleccionado o placeholder */}
        {selectedDogId && (
          (() => {
            const selectedDog = dogs.find((d) => d.id === selectedDogId);
            if (!selectedDog) return null;
            return (
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <Image
                  source={selectedDog.photoUrl ? { uri: selectedDog.photoUrl } : placeholderImg}
                  style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#eee' }}
                  resizeMode="cover"
                  accessibilityLabel="Foto del perrito perdido"
                />
              </View>
            );
          })()
        )}
        <View style={styles.section}>
          <Text style={styles.label}>Selecciona tu perrito:</Text>
          {dogs.map((dog) => (
            <Button
              key={dog.id}
              title={`${dog.name} - ${dog.breed}`}
              onPress={() => setSelectedDogId(dog.id)}
              variant={selectedDogId === dog.id ? 'primary' : 'secondary'}
              disabled={loading}
            />
          ))}
          {errors.selectedDogId && (
            <Text style={styles.errorText}>{errors.selectedDogId}</Text>
          )}
        </View>

        <Input
          placeholder="Descripción (color, características, collar, etc.)"
          value={description}
          onChangeText={setDescription}
          editable={!loading}
          multiline
          numberOfLines={4}
          error={errors.description}
        />

        <Input
          placeholder="Última ubicación conocida"
          value={location}
          onChangeText={setLocation}
          editable={!loading}
          error={errors.location}
        />

        <Button
          title="Crear Alerta"
          onPress={handleReportLost}
          disabled={loading}
          variant="danger"
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Consejos:</Text>
          <Text style={styles.infoText}>
            • Incluye detalles específicos sobre tu perrito{'\n'}
            • Menciona si tiene collar o placa{'\n'}
            • Proporciona la ubicación exacta donde se perdió{'\n'}
            • Cuando lo encuentres, marca la alerta como resuelta
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
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

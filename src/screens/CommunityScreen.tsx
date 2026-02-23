import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { DogCard } from '../components/DogCard';
import { matchService } from '../services';
import { useAuth } from '../hooks/useAuth';
import { useDogs } from '../hooks/useDogs';
import { Dog } from '../types/models';
import { ScreenContainer } from '../components';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;


export const CommunityScreen: React.FC<Props> = ({ navigation }) => {
  // Log para depuración de navigation
  React.useEffect(() => {
    // Solo en desarrollo
    if (typeof window !== 'undefined') {
      // @ts-ignore
      console.log('navigation:', navigation);
    }
  }, [navigation]);
  const { user } = useAuth();
  const [likedDogIds, setLikedDogIds] = useState<string[]>([]);
  const [zone, setZone] = useState<string>('');
  const [loadingZone, setLoadingZone] = useState(false);
  const { dogs, loading } = useDogs(zone, !zone);

  React.useEffect(() => {
    const fetchZone = async () => {
      if (user?.uid) {
        setLoadingZone(true);
        try {
          const userData = await require('../services/auth').authService.getUserData(user.uid);
          setZone(userData?.zone || '');
        } finally {
          setLoadingZone(false);
        }
      }
    };
    fetchZone();
  }, [user?.uid]);

  // Filtrar perros: no mostrar los del usuario ni los ya "likeados"
  const suggestedDogs = dogs.filter(
    (dog) => dog.ownerId !== user?.uid && !likedDogIds.includes(dog.id)
  );

  const handleLike = async (dog: Dog) => {
    if (!user) return;
    // Crear match (usuario actual y dueño del perro)
    await matchService.createMatch({
      userId1: user.uid,
      userId2: dog.ownerId,
      dogId1: '', // Si quieres, puedes guardar el id del perro del usuario
      dogId2: dog.id,
      status: 'pending',
    });
    setLikedDogIds((prev) => [...prev, dog.id]);

    // Crear o buscar chat y navegar automáticamente
    try {
      const chatService = require('../services/chatService').chatService;
      const chatId = await chatService.createChat(user.uid, dog.ownerId, '', dog.id);
      // Obtener nombre del otro usuario (puedes mejorarlo si tienes más datos)
      const userService = require('../services/auth').authService;
      const otherUser = await userService.getUserData(dog.ownerId);
      console.log('Navegando a Chat:', { chatId, otherUserName: otherUser?.name || 'Usuario' });
      navigation.navigate('Chat', { chatId, otherUserName: otherUser?.name || 'Usuario' });
    } catch (e) {
      console.error('Error al abrir chat:', e);
    }
  };

  const handleDislike = (dog: Dog) => {
    setLikedDogIds((prev) => [...prev, dog.id]);
  };

  if (loadingZone) {
    return (
      <ScreenContainer title="Comunidad">
        <Text style={styles.loadingText}>Cargando tu zona...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer title="Comunidad">
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          Descubre nuevos amigos para tu perrito cerca de ti 🐾
        </Text>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Cargando sugerencias...</Text>
      ) : suggestedDogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text style={styles.emptyTitle}>¡No hay más sugerencias por ahora!</Text>
          <Text style={styles.emptyText}>
            Vuelve más tarde para descubrir nuevos amigos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={suggestedDogs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DogCard
              dog={item}
              onLike={() => handleLike(item)}
              onDislike={() => handleDislike(item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
  },
  loadingText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyEmoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  stat: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#d32f2f',
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 100,
  },
});

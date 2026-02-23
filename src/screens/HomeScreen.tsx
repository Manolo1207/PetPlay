import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, FlatList, Text, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Button, DogCard, ScreenContainer } from '../components';
import { useAuth } from '../hooks/useAuth';
import { useDogs } from '../hooks/useDogs';
import { Platform } from 'react-native';
import { authService } from '../services/auth';
import { matchService, chatService } from '../services';
import { Dog } from '../types/models';
import { TodayWalkSummary } from '../components/TodayWalkSummary';
// import { WalkHistory } from '../components/WalkHistory';
import { useDaily } from '../hooks/useDaily';
import { LanguageContext } from '../../App';
import { t } from '../utils/i18n';
import { PetPlayBackground } from '../components/PetPlayBackground';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { language } = useContext(LanguageContext);
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  // Persistencia de zona seleccionada
  const [persistedZone, setPersistedZone] = useState<string | null>(null);
  const [dogsLoading, setDogsLoading] = useState(true);
  const { dogs } = useDogs(userData?.zone || '', !userData);

  useFocusEffect(
    React.useCallback(() => {
      const loadUserData = async () => {
        if (user) {
          let data = await authService.getUserData(user.uid);
          // Si hay zona persistida, la usamos
          let zone = data?.zone;
          let storedZone = null;
          try {
            if (Platform.OS === 'web') {
              storedZone = window.localStorage.getItem('petplay_zone');
            } else {
              const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
              storedZone = await AsyncStorage.getItem('petplay_zone');
            }
          } catch { }
          if (storedZone) {
            data = { ...data, zone: storedZone };
            setPersistedZone(storedZone);
          } else {
            setPersistedZone(zone);
          }
          setUserData(data);
          setDogsLoading(false);
        }
      };
      loadUserData();
    }, [user])
  );

  // Cuando el usuario cambia de zona, persistir
  useEffect(() => {
    if (userData?.zone) {
      (async () => {
        try {
          if (Platform.OS === 'web') {
            window.localStorage.setItem('petplay_zone', userData.zone);
          } else {
            const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
            await AsyncStorage.setItem('petplay_zone', userData.zone);
          }
        } catch { }
      })();
    }
  }, [userData?.zone]);

  const handleLike = async (dog: Dog) => {
    if (!user || !userData) return;

    try {
      // Crear el match
      const matchId = await matchService.createMatch({
        userId1: user.uid,
        userId2: dog.ownerId,
        dogId1: '', // El usuario aún no tiene perro creado en el MVP
        dogId2: dog.id,
        status: 'pending',
      });

      // Crear el chat automáticamente para los usuarios del match
      await chatService.createChat(matchId, [user.uid, dog.ownerId]);

      // Buscar el chat creado para este match
      const chats = await chatService.getUserChats(user.uid);
      const chat = chats.find((c: any) => c.matchId === matchId);
      if (chat) {
        // Buscar nombre del otro usuario
        const otherUserName = dog.name || 'Usuario';
        navigation.navigate('Chat', { chatId: chat.id, otherUserName });
      } else {
        navigation.navigate('MatchSuccess', { dogId: dog.id });
      }
    } catch (error) {
      Alert.alert('Error', 'No pudimos enviar la invitación');
    }
  };

  const handleDislike = () => {
    moveToNext();
  };

  const moveToNext = () => {
    if (currentIndex < dogs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert(
        'Sin más perritos',
        'Vuelve más tarde para ver nuevos amigos 🐾'
      );
      setCurrentIndex(0);
    }
  };

  // Daily hook: lógica diaria centralizada
  const daily = useDaily();

  if (dogsLoading) {
    return (
      <PetPlayBackground>
        <ScreenContainer title={t('home.loading')}>
          <View style={styles.centerContainer}>
            <Text>{t('home.loading')}</Text>
          </View>
        </ScreenContainer>
      </PetPlayBackground>
    );
  }

  if (dogs.length === 0) {
    return (
      <PetPlayBackground>
        <ScreenContainer title={t('home.title')}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🐾</Text>
            <Text style={styles.emptyTitle}>{t('home.noDogs')}</Text>
            <Text style={styles.emptyText}>{t('home.beFirst')}</Text>
            <Button
              title={t('home.createDog')}
              onPress={() => navigation.navigate('DogProfile', { dogId: 'new' })}
            />
          </View>
        </ScreenContainer>
      </PetPlayBackground>
    );
  }

  const currentDog = dogs[currentIndex];

  return (
    <PetPlayBackground>
      <ScreenContainer title={t('home.title')}>
        {/* Tip del Día usando daily */}
        {daily.tip && (
          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>{t('home.tipTitle')}</Text>
            <Text style={styles.tipText}>{daily.tip}</Text>
          </View>
        )}
        {/* Recordatorio diario si no ha guardado paseo */}
        {daily.reminder && (
          <View style={styles.reminderBox}>
            <Text style={styles.reminderText}>{t('home.reminder')}</Text>
          </View>
        )}
        {/* Resumen del paseo diario */}
        <TodayWalkSummary dogId={currentDog.id} dogName={currentDog.name} />
        <View style={styles.dogsCountBox}>
          <Text style={styles.dogsCountText}>{dogs.length} {t('home.dogsNearby')}</Text>
        </View>
        <FlatList
          data={[currentDog]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DogCard
              dog={item}
              onLike={() => handleLike(item)}
              onDislike={handleDislike}
            />
          )}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {t('home.counter', currentIndex + 1, dogs.length)}
          </Text>
        </View>
        {/* <WalkHistory dogId={currentDog.id} /> */}
        {/* Puedes agregar aquí más lógica diaria si es necesario */}
      </ScreenContainer>
    </PetPlayBackground>
  );
};

const styles = StyleSheet.create({
  reminderBox: {
    backgroundColor: '#ffeaea',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#ff5252',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  reminderText: {
    fontSize: 15,
    color: '#b71c1c',
    fontWeight: 'bold',
  },
  dogsCountBox: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  dogsCountText: {
    fontSize: 15,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  listContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  counter: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  counterText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
  },
  dailySummary: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  dailySummaryText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
  },
  tipBox: {
    backgroundColor: '#fffbe6',
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#ffd600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tipTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#bfa100',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 15,
    color: '#333',
  },
});

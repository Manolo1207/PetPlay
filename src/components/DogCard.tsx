// ...existing code...
interface DogCardProps {
  dog: Dog;
  onLike: () => void;
  onDislike: () => void;
}

export const DogCard: React.FC<DogCardProps> = ({ dog, onLike, onDislike }) => {
  const isNew = Date.now() - dog.createdAt < 3 * 24 * 60 * 60 * 1000;
  if (isWeb) {
    return (
      <View
        style={styles.card}
        accessible={true}
        accessibilityLabel={`Perro ${dog.name}, raza ${dog.breed}, edad ${dog.ageCategory}, tamaño ${dog.size}, energía ${dog.energyLevel}, personalidad: ${dog.personality.join(', ')}`}
      >
        <View style={styles.header} accessibilityRole="header">
          <Text style={styles.name} accessibilityRole="text" accessibilityLabel={`Nombre: ${dog.name}`}>{dog.name}</Text>
          {isNew && (
            <View style={styles.newBadge} accessibilityLabel="Nuevo perro" accessibilityRole="text">
              <Text style={styles.newBadgeText}>Nuevo</Text>
            </View>
          )}
          <Text style={styles.breed} accessibilityRole="text" accessibilityLabel={`Raza: ${dog.breed}`}>{dog.breed}</Text>
        </View>
        <View style={styles.info} accessibilityRole="text">
          <Text style={styles.label} accessibilityLabel={`Edad: ${dog.ageCategory}`}>🎂 {dog.ageCategory}</Text>
          <Text style={styles.label} accessibilityLabel={`Tamaño: ${dog.size}`}>⚖️ {dog.size}</Text>
          <Text style={styles.label} accessibilityLabel={`Energía: ${dog.energyLevel}`}>💪 {dog.energyLevel}</Text>
        </View>
        <View style={styles.personalityContainer}>
          <Text style={styles.personalityLabel} accessibilityRole="text">Personalidad:</Text>
          <View style={styles.personality} accessibilityRole="list">
            {dog.personality.map((trait, idx) => (
              <Text key={idx} style={styles.trait} accessibilityRole="text" accessibilityLabel={`Personalidad: ${trait}`}>{trait}</Text>
            ))}
          </View>
        </View>
        <View style={styles.buttons}>
          <View style={styles.buttonItem}>
            <Button
              title="No por ahora"
              onPress={onDislike}
              variant="secondary"
              style={{ minWidth: 44, minHeight: 44 }}
            />
          </View>
          <View style={styles.buttonItemLast}>
            <Button
              title="¡Me gustaría!"
              onPress={onLike}
              style={{ minWidth: 44, minHeight: 44 }}
            />
          </View>
        </View>
      </View>
    );
  }
  // Versión móvil con swipe animado
  const screenWidth = Dimensions.get('window').width;
  const translateX = useSharedValue(0);
  const cardOpacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: cardOpacity.value,
  }));
  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event: any) => {
      translateX.value = event.translationX;
    },
    onEnd: (event: any) => {
      if (event.translationX > 100) {
        translateX.value = withTiming(screenWidth, { duration: 200 }, () => {
          cardOpacity.value = withTiming(0, { duration: 120 }, () => runOnJS(onLike)());
        });
      } else if (event.translationX < -100) {
        translateX.value = withTiming(-screenWidth, { duration: 200 }, () => {
          cardOpacity.value = withTiming(0, { duration: 120 }, () => runOnJS(onDislike)());
        });
      } else {
        translateX.value = withSpring(0);
      }
    },
  });
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.header}>
          <Text style={styles.name}>{dog.name}</Text>
          {isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>Nuevo</Text>
            </View>
          )}
          <Text style={styles.breed}>{dog.breed}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>🎂 {dog.ageCategory}</Text>
          <Text style={styles.label}>⚖️ {dog.size}</Text>
          <Text style={styles.label}>💪 {dog.energyLevel}</Text>
        </View>
        <View style={styles.personalityContainer}>
          <Text style={styles.personalityLabel}>Personalidad:</Text>
          <View style={styles.personality}>
            {dog.personality.map((trait, idx) => (
              <Text key={idx} style={styles.trait}>
                {trait}
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.buttons}>
          <View style={styles.buttonItem}>
            <Button title="No por ahora" onPress={onDislike} variant="secondary" />
          </View>
          <View style={styles.buttonItemLast}>
            <Button title="¡Me gustaría!" onPress={onLike} />
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

import React from 'react';
import { StyleSheet, View, Text, Dimensions, Platform } from 'react-native';
import { Dog } from '../types/models';
import { Button } from './Button';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#222',
  },
  header: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  newBadge: {
    backgroundColor: '#C62828',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    marginRight: 4,
    alignSelf: 'center',
  },
  newBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111',
    letterSpacing: 0.3,
    textShadowColor: '#FFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  breed: {
    fontSize: 18,
    color: '#222',
    marginTop: 4,
    fontWeight: '600',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#B71C1C',
  },
  label: {
    fontSize: 17,
    color: '#222',
    fontWeight: '700',
  },
  personalityContainer: {
    marginBottom: 12,
  },
  personalityLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  personality: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  trait: {
    backgroundColor: '#FFD700',
    color: '#222',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
    marginBottom: 8,
    letterSpacing: 0.2,
    borderWidth: 1,
    borderColor: '#222',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 12,
  },
  buttonItem: {
    marginRight: 8,
    flex: 1,
    minWidth: 44,
    minHeight: 44,
  },
  buttonItemLast: {
    flex: 1,
    minWidth: 44,
    minHeight: 44,
  },
});

const isWeb = Platform.OS === 'web';
let Animated: any, useSharedValue: any, useAnimatedStyle: any, withSpring: any, withTiming: any, runOnJS: any, useAnimatedGestureHandler: any, PanGestureHandler: any;
if (!isWeb) {
  // @ts-ignore
  ({ default: Animated, useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS, useAnimatedGestureHandler } = require('react-native-reanimated'));
  // @ts-ignore
  ({ PanGestureHandler } = require('react-native-gesture-handler'));
}


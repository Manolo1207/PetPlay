import React from 'react';
import { setOnboardingSeen } from '../utils/onboarding';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Button, ScreenContainer } from '../components';
import { PetPlayBackground } from '../components/PetPlayBackground';

const slides = [
  {
    key: 'slide1',
    emoji: '🌳',
    title: 'El parque de juegos, ahora en tu bolsillo.'
  },
  {
    key: 'slide2',
    emoji: '🤝',
    title: 'Haz match con los mejores amigos de tu perro.'
  },
  {
    key: 'slide3',
    emoji: '🐾',
    title: 'Encuentra la manada perfecta cerca de ti.'
  },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'> & {
  onFinish?: () => void;
};

export const OnboardingScreen: React.FC<Props> = ({ navigation, onFinish }) => {
  const [index, setIndex] = React.useState(0);
  const slide = slides[index];

  const handleNext = async () => {
    if (index < slides.length - 1) {
      setIndex(index + 1);
    } else {
      await setOnboardingSeen();
      if (onFinish) onFinish();
      else navigation.replace('Login');
    }
  };

  return (
    <PetPlayBackground>
      <ScreenContainer>
        <View style={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.emoji}>{slide.emoji}</Text>
            <Text style={styles.title}>{slide.title}</Text>
          </View>
          <View style={styles.footer}>
            <Button
              title={index < slides.length - 1 ? 'Siguiente' : '¡Empezar a jugar!'}
              onPress={handleNext}
            />
          </View>
          {/* Disclaimer legal visible solo en la última pantalla */}
          {index === slides.length - 1 && (
            <View style={styles.disclaimerBox}>
              <Text style={styles.disclaimerText}>
                Al usar PetPlay aceptas los términos y condiciones.
              </Text>
              <Text style={styles.disclaimerText}>
                PetPlay es una plataforma de conexión. Los encuentros físicos son responsabilidad de los dueños.
              </Text>
            </View>
          )}
        </View>
      </ScreenContainer>
    </PetPlayBackground>
  );
};

// Removed duplicate return block

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 40,
  },
  disclaimerBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
    marginTop: 8,
    alignSelf: 'stretch',
  },
  disclaimerText: {
    color: '#555',
    fontSize: 15,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
});

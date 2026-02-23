import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LostDogAlert } from '../types/models';

interface LostDogCardProps {
  alert: LostDogAlert;
  onFoundPress?: () => void;
}

export const LostDogCard: React.FC<LostDogCardProps> = ({ alert, onFoundPress }) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES');
  };

  return (
    <View style={styles.card} accessibilityRole="summary">
      <View style={styles.alertBadge} accessibilityLabel="Alerta de perro perdido" accessibilityRole="text">
        <Text style={styles.alertText}>🚨 PERRITO PERDIDO 🚨</Text>
      </View>

      <Text style={styles.name} accessibilityRole="header">{alert.dogName}</Text>
      <Text style={styles.date}>Perdido el: {formatDate(alert.date)}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Descripción:</Text>
        <Text style={styles.description}>{alert.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Última ubicación:</Text>
        <Text style={styles.description}>{alert.location}</Text>
      </View>

      {onFoundPress && (
        <TouchableOpacity style={styles.button} onPress={onFoundPress} accessibilityRole="button" accessibilityLabel="Marcar como encontrado">
          <Text style={styles.buttonText}>✅ Lo encontré</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 12,
    marginVertical: 10,
    borderLeftWidth: 6,
    borderLeftColor: '#B71C1C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
    elevation: 4,
  },
  alertBadge: {
    backgroundColor: '#F8BBD0',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  alertText: {
    color: '#B71C1C',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  date: {
    fontSize: 15,
    color: '#B71C1C',
    marginBottom: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: '#222',
    lineHeight: 22,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
    borderWidth: 2,
    borderColor: '#0D47A1',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});

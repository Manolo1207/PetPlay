import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  disabled = false,
  loading = false,
  error = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={loading ? 'Cargando...' : title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      activeOpacity={0.85}
    // focusable prop removed (not supported by TouchableOpacity)
    >
      <Text
        style={[
          styles.text,
          (variant === 'secondary' || variant === 'danger') && styles.darkText,
        ]}
        accessibilityRole="text"
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: '#C62828', // Rojo oscuro accesible
  },
  secondary: {
    backgroundColor: '#E0E0E0', // Gris más oscuro para contraste
    borderWidth: 1,
    borderColor: '#888',
  },
  danger: {
    backgroundColor: '#B71C1C', // Rojo aún más oscuro para errores
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  darkText: {
    color: '#111',
  },
});

import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  error?: string;
}

export const Input: React.FC<InputProps> = ({ error, style, ...props }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.inputError, style as any]}
        placeholderTextColor="#666"
        accessibilityLabel={props.placeholder || 'Campo de texto'}
        accessibilityRole="text"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: '#888',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    backgroundColor: '#FFF',
    color: '#222',
  },
  inputError: {
    borderColor: '#B71C1C',
  },
  errorText: {
    color: '#B71C1C',
    fontSize: 14,
    marginTop: 4,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
});

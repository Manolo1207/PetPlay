import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  children: React.ReactNode;
  title?: string;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, title }) => {
  return (
    <SafeAreaView style={styles.container}>
      {title && (
        <Text
          style={styles.title}
          accessibilityRole="header"
          aria-level={1}
        >
          {title}
        </Text>
      )}
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
});

import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export interface SnackbarProps {
    message: string;
    visible: boolean;
    onHide: () => void;
}

export const Snackbar: React.FC<SnackbarProps> = ({ message, visible, onHide }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
            setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => onHide());
            }, 2000);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.snackbar, { opacity: fadeAnim }]} accessibilityRole="alert" accessibilityLiveRegion="polite">
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    snackbar: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: '#222',
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 28,
        zIndex: 999,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFD700',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 5,
    },
    text: {
        color: '#FFD700',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: 0.2,
    },
});

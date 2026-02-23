import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';

interface SocialButtonProps {
    onPress: () => void;
    title: string;
    logo: any;
    variant?: 'google' | 'facebook' | 'apple';
    disabled?: boolean;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ onPress, title, logo, variant = 'google', disabled = false }) => {
    return (
        <TouchableOpacity
            style={[styles.button, styles[variant], disabled && styles.disabled]}
            onPress={onPress}
            disabled={disabled}
            accessibilityLabel={title}
            accessibilityRole="button"
            activeOpacity={0.85}
        >
            <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} />
            </View>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        minHeight: 48,
        marginBottom: 12,
        justifyContent: 'center',
    },
    google: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#4285F4',
    },
    facebook: {
        backgroundColor: '#1877F2',
    },
    apple: {
        backgroundColor: '#000',
    },
    disabled: {
        opacity: 0.5,
    },
    logoContainer: {
        marginRight: 12,
    },
    logo: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    text: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
    },
});

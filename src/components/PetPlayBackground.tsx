import React from 'react';
import { useColorScheme, StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';

// Paleta de colores y tipografía
export const colors = {
    textTitle: '#FFF',
    textBody: '#F5F5F5',
    textBodyDark: '#FFE5B4',
    buttonLight: '#FF8C00',
    buttonDark: '#D35400',
};

export const typography = {
    title: {
        color: colors.textTitle,
        fontWeight: 'bold',
        fontSize: 24,
    },
    body: {
        color: colors.textBody,
        fontSize: 16,
    },
    bodyDark: {
        color: colors.textBodyDark,
        fontSize: 16,
    },
    button: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
};

// Componente de fondo con gradiente
export const PetPlayBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const scheme = useColorScheme();
    const colorsBg =
        scheme === 'dark'
            ? (['#331A00', '#663300', '#1A0D00'] as const)
            : (['#FFAD60', '#FF8C00', '#D35400'] as const);
    return (
        <LinearGradient colors={colorsBg} style={styles.background}>
            <PetPlayPattern />
            <View style={styles.inner}>{children}</View>
        </LinearGradient>
    );
};

// Estilos para tarjetas (glassmorphism mate)
export const getCardStyles = (isDark: boolean) =>
    StyleSheet.create({
        card: {
            backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.15)',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.3)',
            overflow: 'hidden',
            // Para blur, usar expo-blur en el componente
        },
    });

// Patrón de iconos SVG sutiles
const icons = [
    <Svg width={32} height={32} key="paw">
        <Path d="M16 24c4 0 8-4 8-8s-4-8-8-8-8 4-8 8 4 8 8 8z" fill="currentColor" />
    </Svg>,
    <Svg width={32} height={32} key="bone">
        <Path d="M6 16c0-2 2-4 4-4h12c2 0 4 2 4 4s-2 4-4 4H10c-2 0-4-2-4-4z" fill="currentColor" />
    </Svg>,
    <Svg width={32} height={32} key="ball">
        <Circle cx={16} cy={16} r={12} fill="currentColor" />
    </Svg>,
];

export const PetPlayPattern: React.FC = () => {
    const scheme = useColorScheme();
    const color = scheme === 'dark' ? '#D35400' : '#FFF';
    const opacity = 0.05;
    const { width, height } = Dimensions.get('window');
    const positions = Array.from({ length: 12 }).map(() => ({
        left: Math.random() * width,
        top: Math.random() * height,
        icon: icons[Math.floor(Math.random() * icons.length)],
    }));

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {positions.map((pos, i) => (
                <View
                    key={i}
                    style={{
                        position: 'absolute',
                        left: pos.left,
                        top: pos.top,
                        opacity,
                    }}
                >
                    {React.cloneElement(pos.icon, { color })}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    inner: {
        flex: 1,
    },
});

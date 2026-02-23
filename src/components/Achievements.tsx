import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BADGES = [
    {
        key: 'explorer',
        label: 'Explorador',
        description: '10 km caminados en total',
        icon: '🥾',
    },
    {
        key: 'earlybird',
        label: 'Madrugador',
        description: '5 paseos antes de las 8:00 AM',
        icon: '🌅',
    },
    {
        key: 'unstoppable',
        label: 'Imparable',
        description: 'Racha de 7 días cumpliendo la meta',
        icon: '🔥',
    },
];

export const Achievements: React.FC = () => {
    const [badges, setBadges] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        (async () => {
            // Leer progreso de logros desde AsyncStorage
            const explorer = Number(await AsyncStorage.getItem('walkTotalKm')) >= 10;
            const earlybird = Number(await AsyncStorage.getItem('walkEarlyCount')) >= 5;
            // Para unstoppable, usar walkMaxStreak (racha máxima)
            const unstoppable = Number(await AsyncStorage.getItem('walkMaxStreak')) >= 7;
            setBadges({ explorer, earlybird, unstoppable });
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Logros</Text>
            <View style={styles.badgeList}>
                {BADGES.map((b) => (
                    <View key={b.key} style={[styles.badge, badges[b.key] ? styles.badgeActive : styles.badgeInactive]}>
                        <Text style={styles.icon}>{b.icon}</Text>
                        <Text style={styles.label}>{b.label}</Text>
                        <Text style={styles.desc}>{b.description}</Text>
                        {badges[b.key] && <Text style={styles.earned}>¡Obtenido!</Text>}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginVertical: 18, padding: 12, backgroundColor: '#fff', borderRadius: 12 },
    title: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
    badgeList: { flexDirection: 'row', justifyContent: 'space-around' },
    badge: { alignItems: 'center', padding: 10, borderRadius: 10, width: 110, marginHorizontal: 4 },
    badgeActive: { backgroundColor: '#e3f7e3', borderWidth: 2, borderColor: '#388e3c' },
    badgeInactive: { backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#bbb' },
    icon: { fontSize: 36, marginBottom: 6 },
    label: { fontWeight: 'bold', fontSize: 15, marginBottom: 2 },
    desc: { fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 2 },
    earned: { color: '#388e3c', fontWeight: 'bold', fontSize: 13 },
});

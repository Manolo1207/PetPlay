import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export interface VetProfileProps {
    name: string;
    address: string;
    hours: string;
    phone: string;
    services: string[];
    rating?: number;
}

export const VetProfileCard: React.FC<VetProfileProps> = ({
    name,
    address,
    hours,
    phone,
    services,
    rating,
}) => {
    return (
        <View
            style={styles.card}
            accessible={true}
            accessibilityLabel={`Veterinaria ${name}, dirección ${address}, horario ${hours}, teléfono ${phone}, servicios: ${services.join(', ')}, rating: ${rating !== undefined ? rating.toFixed(1) : 'N/A'}`}
        >
            <Text style={styles.name} accessibilityRole="header">{name}</Text>
            <Text style={styles.address}>{address}</Text>
            <Text style={styles.hours}>Horario: {hours}</Text>
            <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${phone}`)}
                accessibilityRole="button"
                accessibilityLabel={`Llamar a ${name}`}
                style={{ minWidth: 44, minHeight: 44, justifyContent: 'center' }}
            >
                <Text style={styles.phone}>📞 {phone}</Text>
            </TouchableOpacity>
            <View style={styles.services}>
                <Text style={styles.servicesTitle}>Servicios:</Text>
                {services.map((s, i) => (
                    <Text key={i} style={styles.serviceItem}>• {s}</Text>
                ))}
            </View>
            {rating !== undefined && (
                <View style={styles.ratingRow}>
                    <Text style={styles.rating}>⭐ {rating.toFixed(1)}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FAFAFA',
        borderRadius: 14,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.13,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#1976D2',
    },
    name: { fontSize: 22, fontWeight: 'bold', color: '#111', marginBottom: 6, letterSpacing: 0.3 },
    address: { fontSize: 16, color: '#222', marginBottom: 2, fontWeight: '500' },
    hours: { fontSize: 15, color: '#1976D2', marginBottom: 2, fontWeight: '600' },
    phone: { fontSize: 17, color: '#1976D2', fontWeight: 'bold', marginBottom: 8 },
    services: { marginTop: 8 },
    servicesTitle: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 2 },
    serviceItem: { fontSize: 14, color: '#333', marginLeft: 10 },
    ratingRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center' },
    rating: { fontSize: 17, color: '#FFD700', fontWeight: 'bold' },
});

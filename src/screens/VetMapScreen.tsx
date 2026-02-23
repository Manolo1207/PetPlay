import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Linking, Platform, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
const Marker = (MapView as any).Marker;
import * as Location from 'expo-location';

interface Vet {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    phone: string;
}

const mockVets: Vet[] = [
    {
        id: '1',
        name: 'Veterinaria Central',
        latitude: 19.4326,
        longitude: -99.1332,
        phone: '+525512345678',
    },
    {
        id: '2',
        name: 'Pet Salud',
        latitude: 19.435,
        longitude: -99.140,
        phone: '+525598765432',
    },
];

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    // Haversine formula
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export const VetMapScreen: React.FC = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permiso de ubicación denegado');
                return;
            }
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
        })();
    }, []);

    const openMaps = (lat: number, lon: number) => {
        const url = Platform.select({
            ios: `http://maps.apple.com/?daddr=${lat},${lon}`,
            android: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`,
        });
        if (url) Linking.openURL(url);
    };

    if (!location) {
        return <View style={styles.center}><Text>Obteniendo ubicación...</Text></View>;
    }

    return (
        <View style={{ flex: 1 }}>
            {/* @ts-expect-error Expo Managed workaround */}
            <MapView
                style={{ flex: 1 }}
                region={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                showsUserLocation
            >
                {mockVets.map(vet => (
                    <Marker
                        key={vet.id}
                        coordinate={{ latitude: vet.latitude, longitude: vet.longitude }}
                        title={vet.name}
                        description={`A ${getDistance(location.coords.latitude, location.coords.longitude, vet.latitude, vet.longitude).toFixed(2)} km`}
                    />
                ))}
            </MapView>
            {/* Lista de veterinarias debajo del mapa para acciones rápidas */}
            <View style={{ padding: 12 }}>
                {mockVets.map(vet => (
                    <View key={vet.id} style={styles.marker}>
                        <Text style={styles.markerTitle}>{vet.name}</Text>
                        <Text style={styles.markerDistance}>{`A ${getDistance(location.coords.latitude, location.coords.longitude, vet.latitude, vet.longitude).toFixed(2)} km`}</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(`tel:${vet.phone}`)}>
                                <Text style={styles.buttonText}>📞 Llamar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => openMaps(vet.latitude, vet.longitude)}>
                                <Text style={styles.buttonText}>📍 Cómo llegar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    marker: { backgroundColor: '#fff', padding: 8, borderRadius: 8, alignItems: 'center', minWidth: 120 },
    markerTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
    markerDistance: { fontSize: 12, color: '#666', marginBottom: 6 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
    button: { backgroundColor: '#FF6B6B', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginHorizontal: 2 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});

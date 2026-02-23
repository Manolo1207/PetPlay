import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Button, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Dog } from '../types/models';

interface Props {
    visible: boolean;
    onClose: () => void;
    dog: Dog;
    onSubmit: (location: { lat: number; lng: number }) => void;
}

export const LostDogQuickForm: React.FC<Props> = ({ visible, onClose, dog, onSubmit }) => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [manual, setManual] = useState(false);
    const [error, setError] = useState('');
    const [manualInput, setManualInput] = useState('');

    const getLocation = async () => {
        setLoading(true);
        setError('');
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Permiso de ubicación denegado');
                setLoading(false);
                return;
            }
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        } catch (e) {
            setError('No se pudo obtener la ubicación');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (visible) getLocation();
        else setLocation(null);
    }, [visible]);

    const handleManual = () => {
        setManual(true);
        setLocation(null);
    };

    const handleManualSubmit = () => {
        const [lat, lng] = manualInput.split(',').map(Number);
        if (!lat || !lng) {
            setError('Formato: lat,lng');
            return;
        }
        setLocation({ lat, lng });
        setManual(false);
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.bg}>
                <View style={styles.card}>
                    <Text style={styles.title}>¡Perdí a mi perro!</Text>
                    <Text style={styles.label}>Nombre: <Text style={styles.value}>{dog.name}</Text></Text>
                    <Text style={styles.label}>Raza: <Text style={styles.value}>{dog.breed}</Text></Text>
                    <Text style={styles.label}>Foto:</Text>
                    <View style={styles.imgBox}>
                        <img src={dog.photoUrl} alt={dog.name} style={{ width: 80, height: 80, borderRadius: 40 }} />
                    </View>
                    <Text style={styles.label}>Última ubicación conocida:</Text>
                    {loading ? <ActivityIndicator /> : location ? (
                        <Text style={styles.value}>{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</Text>
                    ) : manual ? (
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder="lat,lng"
                                value={manualInput}
                                onChangeText={setManualInput}
                            />
                            <Button title="Usar ubicación" onPress={handleManualSubmit} />
                        </View>
                    ) : (
                        <TouchableOpacity onPress={handleManual} style={styles.manualBtn}>
                            <Text style={styles.manualBtnText}>Ingresar manualmente</Text>
                        </TouchableOpacity>
                    )}
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    <View style={styles.row}>
                        <Button title="Cancelar" onPress={onClose} color="#888" />
                        <Button title="Reportar" onPress={() => location && onSubmit(location)} disabled={!location} color="#d32f2f" />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    bg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: 320, alignItems: 'center' },
    title: { fontWeight: 'bold', fontSize: 20, marginBottom: 10, color: '#d32f2f' },
    label: { fontWeight: '600', color: '#333', marginTop: 8 },
    value: { color: '#222' },
    imgBox: { marginVertical: 8 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 8, width: 120 },
    manualBtn: { marginTop: 8, marginBottom: 8 },
    manualBtnText: { color: '#1976d2', textDecorationLine: 'underline' },
    error: { color: 'red', marginTop: 6 },
    row: { flexDirection: 'row', gap: 16, marginTop: 16 },
});

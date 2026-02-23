import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Button } from 'react-native';
import { getTipOfTheDay } from '../services/tips';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
    ageCategory?: string;
    breed?: string;
}

export const TipOfDay: React.FC<Props> = ({ ageCategory, breed }) => {
    const tip = getTipOfTheDay(ageCategory, breed);
    const [modalVisible, setModalVisible] = useState(false);
    const [thanked, setThanked] = useState(false);

    const handleThank = async () => {
        setThanked(true);
        // Guarda el tip como leído para hoy
        const today = new Date().toISOString().slice(0, 10);
        await AsyncStorage.setItem('tipOfDayRead', `${tip.id}|${today}`);
    };

    // Al montar, revisa si ya fue leído hoy
    React.useEffect(() => {
        const checkRead = async () => {
            const today = new Date().toISOString().slice(0, 10);
            const saved = await AsyncStorage.getItem('tipOfDayRead');
            if (saved === `${tip.id}|${today}`) setThanked(true);
            else setThanked(false);
        };
        checkRead();
    }, [tip.id]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tip del Día 🐶</Text>
            <Text style={styles.tip}>{tip.text}</Text>
            <View style={styles.buttonsRow}>
                {tip.extendedText && (
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.buttonMore}>
                        <Text style={styles.buttonText}>Saber más</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleThank} style={[styles.buttonThank, thanked && styles.buttonThankActive]} disabled={thanked}>
                    <Text style={styles.buttonText}>{thanked ? '¡Gracias!' : '¡Gracias!'}</Text>
                </TouchableOpacity>
            </View>
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Más información</Text>
                        <Text style={styles.modalText}>{tip.extendedText}</Text>
                        <Button title="Cerrar" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: '#fffbe6', borderRadius: 8, padding: 16, marginVertical: 12 },
    title: { fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: '#b8860b' },
    tip: { fontSize: 15, color: '#444', marginBottom: 8 },
    buttonsRow: { flexDirection: 'row', gap: 12 },
    buttonMore: { backgroundColor: '#e0c97f', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 14, marginRight: 8 },
    buttonThank: { backgroundColor: '#b8860b', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 14 },
    buttonThankActive: { backgroundColor: '#a0a0a0' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 24, maxWidth: 320, alignItems: 'center' },
    modalTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
    modalText: { fontSize: 15, color: '#444', marginBottom: 18, textAlign: 'center' },
});

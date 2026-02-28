import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { addHealthEvent, HealthEventType, scheduleHealthNotification } from '../services/health';

interface Props {
    dogId: string;
    onEventAdded?: () => void;
}

export const AddHealthEventForm: React.FC<Props> = ({ dogId, onEventAdded }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<HealthEventType>('vacuna');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAdd = async () => {
        if (!title || !date) {
            setError('Título y fecha son obligatorios');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const event = { dogId, title, type, date, notes };
            await addHealthEvent(event);
            await scheduleHealthNotification(event);
            setTitle(''); setDate(''); setNotes('');
            if (onEventAdded) onEventAdded();
        } catch (e) {
            setError('No se pudo guardar el evento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agregar Evento de Salud</Text>
            <TextInput
                style={styles.input}
                placeholder="Título (ej. Vacuna Rabia)"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Fecha (YYYY-MM-DD)"
                value={date}
                onChangeText={setDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Notas (opcional)"
                value={notes}
                onChangeText={setNotes}
            />
            <View style={styles.typeRow}>
                <Text style={styles.typeLabel}>Tipo:</Text>
                <Button title="Vacuna" onPress={() => setType('vacuna')} color={type === 'vacuna' ? '#4caf50' : '#bbb'} />
                <Button title="Desparasitación" onPress={() => setType('desparasitación')} color={type === 'desparasitación' ? '#4caf50' : '#bbb'} />
                <Button title="Otro" onPress={() => setType('otro')} color={type === 'otro' ? '#4caf50' : '#bbb'} />
            </View>
            <Button title={loading ? 'Guardando...' : 'Agregar Evento'} onPress={handleAdd} disabled={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginVertical: 12 },
    title: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 8 },
    typeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    typeLabel: { marginRight: 8 },
    error: { color: 'red', marginBottom: 8 },
});

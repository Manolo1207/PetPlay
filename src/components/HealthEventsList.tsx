import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getHealthEvents, HealthEvent } from '../services/health';

interface Props {
    dogId: string;
}

export const HealthEventsList: React.FC<Props> = ({ dogId }) => {
    const [events, setEvents] = useState<HealthEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const data = await getHealthEvents(dogId);
            setEvents(data);
            setLoading(false);
        };
        fetchEvents();
    }, [dogId]);

    if (loading) return <Text>Cargando eventos de salud...</Text>;
    if (!events.length) return <Text>No hay eventos de salud registrados.</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Calendario de Salud</Text>
            <FlatList
                data={events}
                keyExtractor={item => item.id || item.date}
                renderItem={({ item }) => (
                    <View style={styles.eventBox}>
                        <Text style={styles.eventTitle}>{item.title}</Text>
                        <Text style={styles.eventType}>{item.type}</Text>
                        <Text style={styles.eventDate}>{new Date(item.date).toLocaleDateString()}</Text>
                        {item.notes ? <Text style={styles.eventNotes}>{item.notes}</Text> : null}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginVertical: 16 },
    title: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
    eventBox: { backgroundColor: '#f3f3f3', borderRadius: 8, padding: 12, marginBottom: 8 },
    eventTitle: { fontWeight: '600', fontSize: 16 },
    eventType: { color: '#888', fontSize: 13 },
    eventDate: { color: '#555', fontSize: 13 },
    eventNotes: { color: '#444', fontSize: 13, marginTop: 4 },
});

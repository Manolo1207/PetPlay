import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { getWalks } from '../services/walks';
import { BarChart } from 'react-native-chart-kit';

interface Props {
    dogId: string;
}

export const WalkHistory: React.FC<Props> = ({ dogId }) => {
    const [walks, setWalks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const data = await getWalks(dogId);
            setWalks(data);
            setLoading(false);
        };
        fetch();
    }, [dogId]);

    // Últimos 7 días
    const last7 = Array(7)
        .fill(0)
        .map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const date = d.toISOString().slice(0, 10);
            const walk = walks.find((w) => w.date === date);
            return { date, steps: walk?.steps || 0 };
        });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historial de Paseos</Text>
            <BarChart
                data={{
                    labels: last7.map((w) => w.date.slice(5)),
                    datasets: [{ data: last7.map((w) => w.steps) }],
                }}
                width={Dimensions.get('window').width - 32}
                height={180}
                yAxisLabel=""
                yAxisSuffix=" pasos"
                chartConfig={{
                    backgroundColor: '#e3f7e3',
                    backgroundGradientFrom: '#e3f7e3',
                    backgroundGradientTo: '#e3f7e3',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                }}
                style={{ borderRadius: 12, marginVertical: 8 }}
                fromZero
                showBarTops
            />
            <FlatList
                data={walks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.date}>{item.date}</Text>
                        <Text style={styles.steps}>{item.steps} pasos</Text>
                        <Text style={styles.km}>{item.distanceKm.toFixed(2)} km</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No hay paseos guardados.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: '#fff', borderRadius: 12, marginVertical: 12 },
    title: { fontWeight: 'bold', fontSize: 18, marginBottom: 12 },
    item: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
    date: { fontSize: 15, color: '#333' },
    steps: { fontSize: 15, color: '#228B22' },
    km: { fontSize: 15, color: '#666' },
    empty: { textAlign: 'center', color: '#999', marginTop: 16 },
});

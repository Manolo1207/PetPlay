import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { getTodayWalk, addWalk, getPedometerData } from '../services/walks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon';

interface Props {
    dogId: string;
    dogName: string;
}

export const TodayWalkSummary: React.FC<Props> = ({ dogId, dogName }) => {
    const [walk, setWalk] = useState<{ steps: number; distanceKm: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [goal, setGoal] = useState<number>(5000);
    const [goalInput, setGoalInput] = useState('');
    const [goalMet, setGoalMet] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [streak, setStreak] = useState(0);

    const fetchWalk = async () => {
        setLoading(true);
        setError('');
        try {
            const pedometer = await getPedometerData();
            setWalk(pedometer);
        } catch (e) {
            setError('No se pudo obtener datos del podómetro');
        } finally {
            setLoading(false);
        }
    };

    // Cargar meta y racha desde AsyncStorage
    useEffect(() => {
        (async () => {
            const storedGoal = await AsyncStorage.getItem('walkGoal');
            if (storedGoal) setGoal(Number(storedGoal));
            const today = new Date().toISOString().slice(0, 10);
            const streakData = await AsyncStorage.getItem('walkStreak');
            if (streakData) {
                const { lastDate, count } = JSON.parse(streakData);
                if (lastDate === today) setStreak(count);
                else setStreak(0);
            }
        })();
    }, []);

    const handleSave = async () => {
        if (!walk) return;
        setError('');
        try {
            const today = new Date().toISOString().slice(0, 10);
            await addWalk({ dogId, date: today, steps: walk.steps, distanceKm: walk.distanceKm });
            setSaved(true);
            // --- LOGROS ---
            // 1. Total km
            const prevKm = Number(await AsyncStorage.getItem('walkTotalKm')) || 0;
            await AsyncStorage.setItem('walkTotalKm', String(prevKm + walk.distanceKm));
            // 2. Paseos antes de las 8am
            const now = new Date();
            if (now.getHours() < 8) {
                const early = Number(await AsyncStorage.getItem('walkEarlyCount')) || 0;
                await AsyncStorage.setItem('walkEarlyCount', String(early + 1));
            }
            // 3. Racha y racha máxima
            if (walk.steps >= goal) {
                setGoalMet(true);
                setShowConfetti(true);
                const streakData = await AsyncStorage.getItem('walkStreak');
                let count = 1;
                if (streakData) {
                    const { lastDate, count: prev } = JSON.parse(streakData);
                    if (lastDate === today) count = prev;
                    else if (lastDate === new Date(Date.now() - 86400000).toISOString().slice(0, 10)) count = prev + 1;
                }
                setStreak(count);
                await AsyncStorage.setItem('walkStreak', JSON.stringify({ lastDate: today, count }));
                // Racha máxima
                const maxStreak = Number(await AsyncStorage.getItem('walkMaxStreak')) || 0;
                if (count > maxStreak) await AsyncStorage.setItem('walkMaxStreak', String(count));
            } else {
                setGoalMet(false);
            }
        } catch (e) {
            setError('No se pudo guardar el paseo');
        }
    };

    const handleSetGoal = async () => {
        const val = Number(goalInput);
        if (!isNaN(val) && val > 0) {
            setGoal(val);
            await AsyncStorage.setItem('walkGoal', String(val));
            setGoalInput('');
        }
    };

    useEffect(() => {
        fetchWalk();
    }, []);
    useEffect(() => {
        if (walk && walk.steps >= goal) {
            setGoalMet(true);
        } else {
            setGoalMet(false);
        }
    }, [walk, goal]);

    if (loading) return <Text>Cargando paseo de hoy...</Text>;
    if (error) return <Text style={styles.error}>{error}</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Paseo de hoy con {dogName}</Text>
            <Text style={styles.data}>Pasos: {walk?.steps ?? 0} / Meta: {goal}</Text>
            <Text style={styles.data}>Distancia: {walk?.distanceKm.toFixed(2) ?? '0.00'} km</Text>
            <View style={styles.goalBox}>
                <TextInput
                    style={styles.input}
                    placeholder="Nueva meta de pasos"
                    value={goalInput}
                    onChangeText={setGoalInput}
                    keyboardType="numeric"
                />
                <Button title="Guardar meta" onPress={handleSetGoal} disabled={!goalInput} />
            </View>
            <Button title={saved ? '¡Guardado!' : goalMet ? '¡Meta Cumplida!' : 'Guardar paseo'} onPress={handleSave} disabled={saved || !walk} />
            {goalMet && <Text style={styles.goalMet}>🎉 ¡Meta diaria cumplida!</Text>}
            {showConfetti && <ConfettiCannon count={100} origin={{ x: 180, y: 0 }} fadeOut onAnimationEnd={() => setShowConfetti(false)} />}
            {streak > 1 && <Text style={styles.streak}>🔥 Racha: {streak} días seguidos cumpliendo tu meta</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: '#e3f7e3', borderRadius: 8, padding: 16, marginVertical: 12 },
    title: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
    data: { fontSize: 15, marginBottom: 4 },
    error: { color: 'red', marginBottom: 8 },
    goalBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 6, padding: 6, width: 100, marginRight: 8, backgroundColor: '#fff' },
    goalMet: { color: '#388e3c', fontWeight: 'bold', fontSize: 16, marginTop: 8 },
    streak: { color: '#ff9800', fontWeight: 'bold', fontSize: 15, marginTop: 8 },
});

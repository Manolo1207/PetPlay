import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { ScreenContainer } from '../components';
import { useDogs } from '../hooks/useDogs';
import { useAuth } from '../hooks/useAuth';
import { WalkHistory } from '../components/WalkHistory';

// Simulación de datos de racha y paseos
const streakDays = 7;
const walkHistory = [
    { date: '2026-02-19', steps: 3200, duration: '30 min' },
    { date: '2026-02-18', steps: 4100, duration: '45 min' },
    { date: '2026-02-17', steps: 2800, duration: '25 min' },
    { date: '2026-02-16', steps: 5000, duration: '60 min' },
    { date: '2026-02-15', steps: 3500, duration: '35 min' },
];

// Objetivo diario de pasos
const dailyGoal = 4000;

// Calcular progreso de hoy
const today = '2026-02-19'; // En real usaría new Date().toISOString().slice(0,10)
const todayWalk = walkHistory.find(w => w.date === today);
const todaySteps = todayWalk ? todayWalk.steps : 0;
const progress = Math.min(todaySteps / dailyGoal, 1);

// Resumen semanal
const totalSteps = walkHistory.reduce((sum, w) => sum + w.steps, 0);
const totalMinutes = walkHistory.reduce((sum, w) => sum + parseInt(w.duration), 0);

export const ExerciseScreen: React.FC = () => {
    const { user } = useAuth();
    const { dogs } = useDogs('', !user);
    const currentDog = dogs && dogs.length > 0 ? dogs[0] : null;
    return (
        <ScreenContainer title="Ejercicio">
            <ScrollView contentContainerStyle={styles.content}>
                {/* Racha */}
                <View style={styles.streakContainer}>
                    <Text style={styles.streakTitle}>¡Racha de paseos!</Text>
                    <Text style={styles.streakDays}>{streakDays} días seguidos 🏆</Text>
                </View>

                {/* Objetivo diario */}
                <View style={styles.goalContainer}>
                    <Text style={styles.goalTitle}>Objetivo diario</Text>
                    <Text style={styles.goalSteps}>{todaySteps} / {dailyGoal} pasos</Text>
                    <ProgressBar progress={progress} color="#4caf50" style={styles.progressBar} />
                    <Text style={styles.goalTip}>{progress >= 1 ? '¡Objetivo alcanzado! 🎉' : '¡Sigue así para lograrlo!'}</Text>
                </View>

                {/* Resumen semanal */}
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Resumen semanal</Text>
                    <Text style={styles.summaryText}>Pasos totales: {totalSteps}</Text>
                    <Text style={styles.summaryText}>Minutos totales: {totalMinutes}</Text>
                </View>

                {/* Gráfico simple de actividad */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Actividad diaria</Text>
                    <View style={styles.chartBarWrapper}>
                        {walkHistory.map((w, idx) => (
                            <View key={w.date} style={styles.chartBarItem}>
                                <View style={[styles.chartBar, { height: Math.max(10, w.steps / 50), backgroundColor: w.date === today ? '#4caf50' : '#90caf9' }]} />
                                <Text style={styles.chartLabel}>{w.date.slice(5)}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Historial de paseos */}
                {currentDog && (
                    <View style={{ marginBottom: 24 }}>
                        <WalkHistory dogId={currentDog.id} />
                    </View>
                )}
            </ScrollView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    goalContainer: {
        backgroundColor: '#e8f5e9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        alignItems: 'center',
    },
    goalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    goalSteps: {
        fontSize: 16,
        marginBottom: 8,
    },
    progressBar: {
        width: '90%',
        height: 12,
        borderRadius: 6,
        marginBottom: 6,
        backgroundColor: '#c8e6c9',
    },
    goalTip: {
        fontSize: 14,
        color: '#388e3c',
    },
    summaryContainer: {
        backgroundColor: '#fffde7',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        alignItems: 'center',
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    summaryText: {
        fontSize: 16,
    },
    chartContainer: {
        backgroundColor: '#e3f2fd',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    chartBarWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 80,
        marginTop: 8,
    },
    chartBarItem: {
        alignItems: 'center',
        width: 32,
    },
    chartBar: {
        width: 18,
        borderRadius: 6,
        marginBottom: 4,
    },
    chartLabel: {
        fontSize: 12,
        color: '#1976d2',
    },
    streakContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    streakTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    streakDays: {
        fontSize: 22,
        color: '#FF6B6B',
        fontWeight: 'bold',
    },
    historyContainer: {
        marginBottom: 24,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    walkItem: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    walkDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    walkSteps: {
        fontSize: 15,
        color: '#333',
    },
    walkDuration: {
        fontSize: 14,
        color: '#999',
    },
});

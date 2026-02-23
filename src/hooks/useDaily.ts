import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * useDaily: Hook centralizado para lógica diaria del usuario.
 * - Resetea contadores diarios
 * - Provee tip del día
 * - Permite lógica de recordatorios, badges, etc.
 */
export function useDaily() {
    const [today, setToday] = useState(() => new Date().toISOString().slice(0, 10));
    const [tip, setTip] = useState<string | null>(null);
    const [isNewDay, setIsNewDay] = useState(false);
    const [reminder, setReminder] = useState<string | null>(null);

    useEffect(() => {
        const checkDay = async () => {
            const lastDay = await AsyncStorage.getItem('lastDailyDate');
            const now = new Date().toISOString().slice(0, 10);
            setToday(now);
            if (lastDay !== now) {
                setIsNewDay(true);
                await AsyncStorage.setItem('lastDailyDate', now);
                // Resetear recordatorio diario
                setReminder(null);
                // Si ayer no cumplió la meta, resetear racha
                const streakData = await AsyncStorage.getItem('walkStreak');
                if (streakData) {
                    const { lastDate, count } = JSON.parse(streakData);
                    if (lastDate !== now) {
                        // No guardó paseo hoy, racha se reinicia
                        await AsyncStorage.setItem('walkStreak', JSON.stringify({ lastDate: now, count: 0 }));
                    }
                }
            } else {
                setIsNewDay(false);
            }
            // Recordatorio si no ha guardado paseo hoy
            const todayWalk = await AsyncStorage.getItem('walkSaved_' + now);
            if (!todayWalk) {
                setReminder('¡No olvides registrar el paseo de hoy para mantener tu racha!');
            } else {
                setReminder(null);
            }
        };
        checkDay();
    }, []);

    // Ejemplo: obtener tip del día (puedes personalizar la fuente)
    useEffect(() => {
        // Aquí podrías obtener el tip del día desde un array, API, etc.
        const tips = [
            'Recuerda hidratar a tu perro después del paseo.',
            'Un paseo corto es mejor que ninguno.',
            'Revisa las patas de tu perro después de caminar.',
            'Premia a tu perro por buen comportamiento en el paseo.',
        ];
        const idx = Math.floor(Math.random() * tips.length);
        setTip(tips[idx]);
    }, [today]);

    return {
        today,
        isNewDay,
        tip,
        reminder,
        // Puedes exponer más lógica diaria aquí
    };
}

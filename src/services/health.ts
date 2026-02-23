import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy
} from 'firebase/firestore';
import * as Notifications from 'expo-notifications';

export type HealthEventType = 'vacuna' | 'desparasitación' | 'otro';

export interface HealthEvent {
    id?: string;
    dogId: string;
    type: HealthEventType;
    title: string;
    date: string; // ISO
    notes?: string;
}

export const addHealthEvent = async (event: HealthEvent) => {
    const ref = await addDoc(collection(db, 'healthEvents'), event);
    return ref.id;
};

export const getHealthEvents = async (dogId: string): Promise<HealthEvent[]> => {
    const q = query(
        collection(db, 'healthEvents'),
        where('dogId', '==', dogId),
        orderBy('date')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HealthEvent));
};

// Usa el tipo correcto para el trigger
export const scheduleHealthNotification = async (event: HealthEvent) => {
    const triggerTime = new Date(event.date).getTime() - Date.now();
    const trigger: Notifications.TimeIntervalTriggerInput | null = triggerTime > 0
        ? { seconds: Math.floor(triggerTime / 1000), repeats: false, type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL }
        : null;
    if (trigger) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: `Recordatorio: ${event.title}`,
                body: `No olvides la ${event.type} para tu perro.`,
            },
            trigger,
        });
    }
};
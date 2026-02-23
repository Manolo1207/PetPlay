import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit
} from 'firebase/firestore';
import { Pedometer } from 'expo-sensors';

export interface Walk {
    id?: string;
    dogId: string;
    date: string; // YYYY-MM-DD
    steps: number;
    distanceKm: number;
}

export const addWalk = async (walk: Walk) => {
    const ref = await addDoc(collection(db, 'walks'), walk);
    return ref.id;
};

export const getWalks = async (dogId: string): Promise<Walk[]> => {
    const q = query(
        collection(db, 'walks'),
        where('dogId', '==', dogId),
        orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Walk));
};

export const getTodayWalk = async (dogId: string): Promise<Walk | null> => {
    const today = new Date().toISOString().slice(0, 10);
    const q = query(
        collection(db, 'walks'),
        where('dogId', '==', dogId),
        where('date', '==', today),
        limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Walk;
};

export const getPedometerData = async (): Promise<{ steps: number; distanceKm: number }> => {
    const end = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const result = await Pedometer.getStepCountAsync(start, end);
    // Aproximación: 1 paso ≈ 0.0007 km
    const distanceKm = result.steps * 0.0007;
    return { steps: result.steps, distanceKm };
};
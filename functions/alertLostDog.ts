import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

admin.initializeApp();
const db = admin.firestore();

// Haversine formula to calculate distance between two lat/lng points in km
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        0.5 - Math.cos(dLat) / 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        (1 - Math.cos(dLng)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}

// Expo push endpoint
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

interface User {
    id: string;
    location?: { lat: number; lng: number };
    pushToken?: string;
    [key: string]: any;
}

export const alertLostDog = functions.https.onCall(async (data: any, context) => {
    const { dogName, dogPhotoUrl, lastLocation, ownerId } = data;
    if (!lastLocation || !lastLocation.lat || !lastLocation.lng) {
        throw new functions.https.HttpsError('invalid-argument', 'Ubicación requerida');
    }

    // 1. Obtener todos los usuarios con ubicación y pushToken
    const usersSnap = await db.collection('users').get();
    const users: User[] = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 2. Filtrar usuarios en radio de 5km
    const nearby = users.filter(u => {
        if (!u.location || !u.pushToken) return false;
        const dist = getDistanceKm(lastLocation.lat, lastLocation.lng, u.location.lat, u.location.lng);
        return dist <= 5;
    });

    // 3. Enviar notificación push a cada uno
    const messages = nearby.map(u => ({
        to: u.pushToken,
        sound: 'default',
        title: '¡Alerta cerca de ti!',
        body: `¡${dogName} se ha perdido cerca de ti! ¿Lo has visto?`,
        data: { dogName, dogPhotoUrl, type: 'lostDogAlert' },
        priority: 'high',
    }));

    // Expo permite enviar hasta 100 mensajes por petición
    for (let i = 0; i < messages.length; i += 100) {
        const chunk = messages.slice(i, i + 100);
        await fetch(EXPO_PUSH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chunk),
        });
    }

    return { notified: nearby.length };
});

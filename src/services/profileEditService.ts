import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const profileEditService = {
    async canEditProfile(uid: string) {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) return { allowed: true, count: 0, lastEdit: null };
        const data = snap.data();
        const edits = data.profileEditHistory || [];
        const now = Date.now();
        // Filtrar los edits de los últimos 30 días
        const recentEdits = edits.filter((e: any) => now - e.timestamp < 30 * 24 * 60 * 60 * 1000);
        return {
            allowed: recentEdits.length < 3,
            count: recentEdits.length,
            lastEdit: recentEdits.length > 0 ? recentEdits[recentEdits.length - 1].timestamp : null,
        };
    },
    async recordEdit(uid: string, type: 'name' | 'photo') {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : {};
        const edits = data.profileEditHistory || [];
        edits.push({ type, timestamp: Date.now() });
        await setDoc(ref, { profileEditHistory: edits }, { merge: true });
    },
};

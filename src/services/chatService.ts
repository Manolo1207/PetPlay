import { db } from './firebase';
import { collection, doc, setDoc, getDoc, deleteDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

export const chatService = {
    async createChat(userA: string, userB: string, dogA: string, dogB: string) {
        // Chat ID: sorted user IDs
        const chatId = [userA, userB].sort().join('_');
        const chatRef = doc(db, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);
        if (!chatSnap.exists()) {
            await setDoc(chatRef, {
                users: [userA, userB],
                dogs: [dogA, dogB],
                createdAt: Timestamp.now(),
                lastMessageAt: null,
                messages: [],
                autoDeleteAt: Timestamp.now().toMillis() + 24 * 60 * 60 * 1000,
                unreadCount: { [userA]: 0, [userB]: 0 },
            });
        }
        return chatId;
    },
    async getUserChats(userId: string) {
        const q = query(collection(db, 'chats'), where('users', 'array-contains', userId));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async deleteChat(chatId: string) {
        await deleteDoc(doc(db, 'chats', chatId));
    },
    async checkAutoDeleteChats() {
        const now = Date.now();
        const q = query(collection(db, 'chats'), where('autoDeleteAt', '<=', now), where('messages', '==', []));
        const snap = await getDocs(q);
        for (const docSnap of snap.docs) {
            await deleteDoc(docSnap.ref);
        }
    },
    async addMessage(chatId: string, senderId: string, text: string) {
        const chatRef = doc(db, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);
        if (!chatSnap.exists()) return;
        const data = chatSnap.data();
        const messages = data.messages || [];
        messages.push({ senderId, text, timestamp: Timestamp.now() });
        // Actualizar contador de mensajes no leídos
        const unreadCount = { ...data.unreadCount };
        for (const userId of data.users) {
            if (userId !== senderId) unreadCount[userId] = (unreadCount[userId] || 0) + 1;
        }
        await setDoc(chatRef, {
            messages,
            lastMessageAt: Timestamp.now(),
            autoDeleteAt: null,
            unreadCount,
        }, { merge: true });
        // Enviar notificación push al destinatario
        for (const userId of data.users) {
            if (userId !== senderId) {
                // Obtener nombre y token push del destinatario
                const senderSnap = await getDoc(doc(db, 'users', senderId));
                const recipientSnap = await getDoc(doc(db, 'users', userId));
                const senderName = senderSnap.exists() ? (senderSnap.data().name || 'Usuario') : 'Usuario';
                const pushToken = recipientSnap.exists() ? recipientSnap.data().pushToken : null;
                if (pushToken) {
                    const notificationService = require('./notifications').notificationService;
                    await notificationService.notifyNewChatMessage(senderName, text);
                }
            }
        }
    },
    async markChatRead(chatId: string, userId: string) {
        const chatRef = doc(db, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);
        if (!chatSnap.exists()) return;
        const data = chatSnap.data();
        const unreadCount = { ...data.unreadCount, [userId]: 0 };
        await setDoc(chatRef, { unreadCount }, { merge: true });
    },
};

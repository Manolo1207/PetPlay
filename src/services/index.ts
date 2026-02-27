import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Dog, Match, LostDogAlert, Chat, Message } from '../types/models';

// ...existing code...

export const dogService = {
  async createDog(dog: Omit<Dog, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'dogs'), {
      ...dog,
      createdAt: Timestamp.now().toMillis(),
    });
    return docRef.id;
  },

  async getDogsByZone(zone: string): Promise<Dog[]> {
    const q = query(
      collection(db, 'dogs'),
      where('zone', '==', zone)
    );
    const querySnapshot = await getDocs(q);
    const dogs = querySnapshot.docs.map((doc) => ({
      ...(doc.data() as Dog),
      id: doc.id,
    }));
    // Filtrar perros perdidos en el cliente ya que Firestore no soporta != con null/undefined
    return dogs.filter((dog) => !dog.isLost);
  },

  async getDogById(dogId: string): Promise<Dog | null> {
    const docRef = doc(db, 'dogs', dogId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { ...(docSnap.data() as Dog), id: dogId } : null;
  },

  async getOwnerDogs(ownerId: string): Promise<Dog[]> {
    const q = query(collection(db, 'dogs'), where('ownerId', '==', ownerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...(doc.data() as Dog),
      id: doc.id,
    }));
  },

  async updateDog(dogId: string, updates: Partial<Dog>): Promise<void> {
    const docRef = doc(db, 'dogs', dogId);
    await updateDoc(docRef, updates);
  },

  async deleteDog(dogId: string): Promise<void> {
    await deleteDoc(doc(db, 'dogs', dogId));
  },
};
// ...existing code...


// Chat service for handling chat and message creation/retrieval
export const chatService = {
  async createChat(matchId: string, userIds: [string, string]): Promise<string> {
    // Create a chat document for a match between two users
    const docRef = await addDoc(collection(db, 'chats'), {
      userIds,
      matchId,
      createdAt: Timestamp.now().toMillis(),
      lastMessage: null,
    });
    return docRef.id;
  },

  async getUserChats(userId: string): Promise<Chat[]> {
    // Get all chats for a user
    const q = query(collection(db, 'chats'), where('userIds', 'array-contains', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ ...(doc.data() as Chat), id: doc.id }));
  },

  async sendMessage(chatId: string, senderId: string, text: string): Promise<string> {
    // Add a message to the messages subcollection of a chat
    const messageRef = await addDoc(collection(db, 'chats', chatId, 'messages'), {
      chatId,
      senderId,
      text,
      createdAt: Timestamp.now().toMillis(),
      readBy: [senderId],
    });
    // Update lastMessage in chat
    await updateDoc(doc(db, 'chats', chatId), {
      lastMessage: {
        id: messageRef.id,
        chatId,
        senderId,
        text,
        createdAt: Timestamp.now().toMillis(),
        readBy: [senderId],
      },
    });
    return messageRef.id;
  },

  async getMessages(chatId: string): Promise<Message[]> {
    // Get all messages for a chat
    const q = query(collection(db, 'chats', chatId, 'messages'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ ...(doc.data() as Message), id: doc.id }));
  },
};

export const matchService = {
  async createMatch(match: Omit<Match, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'matches'), {
      ...match,
      createdAt: Timestamp.now().toMillis(),
    });
    return docRef.id;
  },

  async getUserMatches(userId: string): Promise<Match[]> {
    const q = query(
      collection(db, 'matches'),
      where('userId1', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...(doc.data() as Match),
      id: doc.id,
    }));
  },

  async getRecentLikedDogs(userId: string, limit: number = 5): Promise<Dog[]> {
    // Busca los matches hechos por el usuario y trae los perros correspondientes
    const getUserMatches = async (userId: string): Promise<Match[]> => {
      const q = query(
        collection(db, 'matches'),
        where('userId1', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        ...(doc.data() as Match),
        id: doc.id,
      }));
    };
    const matches = await getUserMatches(userId);
    const dogIds = matches
      .sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0))
      .map((m: any) => m.dogId2)
      .slice(0, limit);
    // Busca los perros por id
    const dogs: Dog[] = [];
    for (const id of dogIds) {
      const dog = await dogService.getDogById(id);
      if (dog) dogs.push(dog);
    }
    return dogs;
  },

  async updateMatch(matchId: string, status: Match['status']): Promise<void> {
    const docRef = doc(db, 'matches', matchId);
    await updateDoc(docRef, { status, respondedAt: Timestamp.now().toMillis() });
  },
};

export const lostDogService = {

  async reportLostDog(alert: Omit<LostDogAlert, 'id' | 'date'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'lost_dogs'), {
      ...alert,
      date: Timestamp.now().toMillis(),
    });
    return docRef.id;
  },

  async getLostDogs(zone: string): Promise<LostDogAlert[]> {
    const q = query(
      collection(db, 'lost_dogs'),
      where('resolved', '==', false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...(doc.data() as LostDogAlert),
      id: doc.id,
    }));
  },

  async resolveLostDog(alertId: string): Promise<void> {
    const docRef = doc(db, 'lost_dogs', alertId);
    await updateDoc(docRef, { resolved: true });
  },
};

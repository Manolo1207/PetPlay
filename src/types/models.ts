export interface Dog {
  id: string;
  ownerId: string;
  name: string;
  breed: string;
  photoUrl: string;
  ageCategory: 'cachorro' | 'adulto' | 'senior';
  gender: 'macho' | 'hembra';
  size: 'pequeño' | 'mediano' | 'grande';
  energyLevel: 'bajo' | 'medio' | 'alto';
  personality: string[];
  compatibility: string[];
  zone: string;
  createdAt: number;
  isLost?: boolean;
  lostDate?: number;
  lostDescription?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  zone: string;
  createdAt: number;
  photoUrl?: string;
  showDogInFeed?: boolean;
  communityNotifications?: boolean;
}

export interface Match {
  id: string;
  userId1: string;
  userId2: string;
  dogId1: string;
  dogId2: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
  respondedAt?: number;
}

export interface LostDogAlert {
  id: string;
  ownerId: string;
  dogId: string;
  dogName: string;
  description: string;
  location: string;
  date: number;
  resolved: boolean;
  photo: string;
}

// Chat model for user-to-user messaging after a match
export interface Chat {
  id: string;
  userIds: [string, string]; // Always two users per chat
  matchId: string; // The match that triggered the chat
  createdAt: number;
  lastMessage?: Message;
}

// Message model for chat messages
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: number;
  readBy: string[]; // userIds who have read the message
}

import { Timestamp } from 'firebase/firestore';

export type MessageType = 'text' | 'image' | 'trade-offer';
export type MessageStatus = 'sent' | 'delivered' | 'read';
export type ConversationType = 'direct' | 'group' | 'trade' | 'project';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Timestamp | null;
  read: boolean;
  type: MessageType;
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantIds: string[]; // Sorted array of participant IDs for uniqueness checking
  lastMessage: string | null;
  lastMessageTimestamp: Timestamp | null;
  lastMessageStatus?: MessageStatus;
  unreadCount: {
    [userId: string]: number;
  };
  conversationType: ConversationType;
  contextId?: string; // ID of related trade or project for trade/project conversations
  tradeName?: string;
  updatedAt: Timestamp;
  isTyping?: {
    [userId: string]: boolean;
  };
}

export interface UserProfile {
  id: string;
  displayName: string;
  profilePicture?: string;
  email: string;
  createdAt: Timestamp;
  lastSeen?: Timestamp;
  isOnline?: boolean;
  bio?: string;
  portfolio?: string;
  skills?: string[];
  endorsements?: {
    [skill: string]: string[]; // Array of user IDs who endorsed
  };
  skillLevels?: {
    [skill: string]: {
      level: number;
      endorsements: number;
    };
  };
}

import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  skills: string[];
  portfolio: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
  experience: number;
  level: number;
  badges: Badge[];
  endorsements: {
    [skillId: string]: string[];
  };
  skillLevels: {
    [skillId: string]: {
      level: number;
      experience: number;
    };
  };
  activeQuests: string[];
  completedQuests: string[];
  challengeProgress: {
    [challengeId: string]: {
      progress: number;
      completed: boolean;
      claimedRewards: boolean;
    };
  };
}

export interface Connection {
  id: string;
  userId: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: Timestamp;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface Trade {
  id: string;
  title: string;
  description: string;
  offeredSkills: string[];
  requestedSkills: string[];
  creatorId: string;
  status: 'open' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  ratings?: {
    [userId: string]: {
      rating: number;
      review?: string;
      createdAt: Date;
    };
  };
}

export interface Collaboration {
  id: string;
  title: string;
  description: string;
  roles: {
    title: string;
    skills: string[];
    filled: boolean;
    userId?: string;
  }[];
  creatorId: string;
  status: 'recruiting' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Timestamp;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTimestamp?: Timestamp;
  tradeId?: string;
  tradeName?: string;
  unreadCount: { [userId: string]: number };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'special';
  requirements: {
    type: 'trades' | 'collaborations' | 'endorsements' | 'skills';
    count: number;
    skillCategory?: string;
  }[];
  rewards: {
    xp: number;
    badge?: string;
    specialReward?: string;
  };
  startDate: Timestamp;
  endDate: Timestamp;
  participants: string[];
  completions: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  steps: {
    id: string;
    description: string;
    type: 'trade' | 'collaboration' | 'skill' | 'endorsement';
    requirement: {
      count: number;
      skillCategory?: string;
    };
    completed: boolean;
  }[];
  rewards: {
    xp: number;
    badge?: string;
    specialReward?: string;
  };
  userId: string;
  startedAt: Timestamp;
  completedAt?: Timestamp;
  expiresAt?: Timestamp;
}
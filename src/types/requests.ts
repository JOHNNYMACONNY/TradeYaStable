import { Timestamp } from 'firebase/firestore';

export type RequestStatus = 'pending' | 'accepted' | 'declined';
export type RequestType = 'application' | 'invitation';

interface BaseRequest {
  id: string;
  senderId: string;
  recipientId: string;
  status: RequestStatus;
  type: RequestType;
  createdAt: Timestamp;
  message?: string;
  expiresAt?: Timestamp;
  notificationSent?: boolean;
  viewedAt?: Timestamp;
  sender?: { // Add the sender field
    id: string;
    displayName: string;
    photoURL: string;
  };
}

export interface TradeRequest extends BaseRequest {
  tradeId: string;
  tradeName: string;
  terms?: string;
}

export interface ProjectPositionRequest extends BaseRequest {
  projectId: string;
  projectName: string;
  positionId: string;
  positionName: string;
  requiredSkills?: string[];
  proposedSkills?: string[];
}

export type Request = TradeRequest | ProjectPositionRequest;

export interface RequestNotification {
  id: string;
  requestId: string;
  recipientId: string;
  type: 'trade_request' | 'project_request';
  read: boolean;
  createdAt: Timestamp;
}

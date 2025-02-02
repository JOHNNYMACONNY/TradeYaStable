import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, MessageSquare, ExternalLink, Clock } from 'lucide-react';
import { ProfilePicture } from './ProfilePicture';
import { sendConnectionRequest } from '../lib/networking';
import type { UserProfile } from '../types';

interface UserProfileCardProps {
  profile: UserProfile;
  currentUserId?: string;
  connectionStatus: 'none' | 'pending' | 'accepted';
  onConnect?: (success: boolean) => void;
  onMessage?: (profile: UserProfile) => void;
}

export function UserProfileCard({ 
  profile, 
  currentUserId,
  connectionStatus: initialStatus,
  onConnect,
  onMessage 
}: UserProfileCardProps) {
  const [connectionStatus, setConnectionStatus] = useState(initialStatus);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!currentUserId || isConnecting) return;
    
    setIsConnecting(true);
    // Optimistically update the status
    setConnectionStatus('pending');
    
    try {
      await sendConnectionRequest(currentUserId, profile.id);
      onConnect?.(true);
    } catch (err) {
      // Revert on error
      console.error('Failed to send connection request:', err);
      setConnectionStatus('none');
      onConnect?.(false);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-start gap-4">
        <Link to={`/users/${profile.id}`}>
          <ProfilePicture url={profile.profilePicture} size="lg" />
        </Link>
        <div className="flex-1 min-w-0">
          <Link 
            to={`/users/${profile.id}`}
            className="text-lg font-medium text-gray-900 truncate hover:text-accent-clay transition-colors"
          >
            {profile.displayName}
          </Link>
          {profile.portfolio && (
            <a
              href={profile.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent-clay hover:text-accent-ochre flex items-center gap-1"
            >
              Portfolio <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {profile.bio || 'No bio available'}
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Top Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {profile.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-accent-sage/20 text-gray-900 text-sm rounded-full border border-accent-sage/30"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-earth-700 flex gap-2">
        {connectionStatus === 'accepted' ? (
          <button
            onClick={() => onMessage?.(profile)}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Message
          </button>
        ) : connectionStatus === 'pending' ? (
          <button
            disabled
            className="flex-1 btn-secondary flex items-center justify-center gap-2 opacity-75 cursor-not-allowed"
          >
            <Clock className="h-4 w-4" />
            Request Pending
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isConnecting || !currentUserId}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            {isConnecting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Connecting...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Connect
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
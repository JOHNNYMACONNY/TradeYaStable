import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MessageSquare, User, Clock, ArrowRight } from 'lucide-react';
import type { Conversation, UserProfile } from '../types';
import { ProfilePicture } from '../components/ProfilePicture';

export function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [participants, setParticipants] = useState<{ [key: string]: UserProfile }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const conversationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Conversation[];
        setConversations(conversationsData);

        // Fetch all participants' profiles
        const participantIds = new Set(
          conversationsData.flatMap(conv => conv.participants)
        );
        const participantsData: { [key: string]: UserProfile } = {};
        
        for (const participantId of participantIds) {
          if (participantId !== user.uid) {
            const userDoc = await db.collection('users').doc(participantId).get();
            if (userDoc.exists()) {
              participantsData[participantId] = {
                id: userDoc.id,
                ...userDoc.data()
              } as UserProfile;
            }
          }
        }
        
        setParticipants(participantsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load conversations');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const getOtherParticipant = (conversation: Conversation) => {
    const otherUserId = conversation.participants.find(id => id !== user?.uid);
    return otherUserId ? participants[otherUserId] : null;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card p-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-cyber-gray-800 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-cyber-gray-800 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-cyber-gray-800 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-display font-bold gradient-text mb-6">Messages</h1>

          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-cyber-gray-400" />
              <p className="text-cyber-gray-300">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation);
                const hasUnread = conversation.unreadCount?.[user.uid] > 0;
                
                return (
                  <div
                    key={conversation.id}
                    onClick={() => navigate(`/messages/${conversation.id}`)}
                    className={`group p-4 rounded-lg cursor-pointer transition-all duration-300
                      ${hasUnread 
                        ? 'bg-neon-blue/5 hover:bg-neon-blue/10' 
                        : 'hover:bg-cyber-gray-800/50'}`}
                  >
                    <div className="flex items-center">
                      <ProfilePicture 
                        url={otherParticipant?.profilePicture} 
                        size="md"
                        className="mr-4"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium text-cyber-gray-50 truncate">
                            {otherParticipant?.displayName || 'Unknown User'}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-cyber-gray-400">
                              {conversation.lastMessageTimestamp?.toDate().toLocaleDateString()}
                            </span>
                            <ArrowRight className="h-4 w-4 text-cyber-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        
                        {conversation.tradeName && (
                          <p className="text-sm text-neon-blue mb-1 truncate">
                            Re: {conversation.tradeName}
                          </p>
                        )}
                        
                        <p className="text-sm text-cyber-gray-300 truncate">
                          {conversation.lastMessage || 'No messages yet'}
                        </p>
                        
                        {hasUnread && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neon-blue/20 text-neon-blue mt-2">
                            {conversation.unreadCount[user.uid]} new
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
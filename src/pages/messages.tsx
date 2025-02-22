import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MessageSquare, User, ArrowRight, Check, CheckCheck } from 'lucide-react';
import type { Conversation, UserProfile } from '../types/messaging';
import { ProfilePicture } from '../components/ProfilePicture';

export function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [participants, setParticipants] = useState<{ [key: string]: UserProfile }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Query using participants array
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
        // Sort conversations by updatedAt locally
        const sortedConversations = [...conversationsData].sort((a, b) => {
          const timeA = a.updatedAt?.toMillis() || 0;
          const timeB = b.updatedAt?.toMillis() || 0;
          return timeB - timeA;
        });
        setConversations(sortedConversations);

        const participantIds = new Set(
          conversationsData.flatMap(conv => conv.participants.filter(id => id !== user.uid))
        );
        const participantsData: { [key: string]: UserProfile } = {};
        
        for (const participantId of participantIds) {
          if (participantId !== user.uid) {
            const userDocRef = doc(db, 'users', participantId);
            const userDoc = await getDoc(userDocRef);
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
                <div className="h-12 w-12 bg-earth-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-earth-300 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-earth-300 rounded w-3/4"></div>
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
        <div className="card p-4 border border-accent-rust/50 text-accent-rust">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span>{error}</span>
          </div>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-display font-bold text-text-primary mb-6">Messages</h1>

          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-earth-300" />
              <p className="text-text-muted">No conversations yet</p>
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
                        ? 'bg-accent-sage/10 hover:bg-accent-sage/20 border border-accent-sage/30' 
                        : 'hover:bg-earth-800/50 border border-earth-700/30'}`}
                  >
                    <div className="flex items-center">
                      <ProfilePicture 
                        url={otherParticipant?.profilePicture} 
                        size="md"
                        className="mr-4"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium text-text-primary truncate">
                            {otherParticipant?.displayName || 'Unknown User'}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {otherParticipant?.isOnline && (
                                  <span className="h-2 w-2 bg-accent-sage rounded-full" />
                                )}
                                <span className="text-sm text-text-muted">
                                  {conversation.lastMessageTimestamp ? (
                                    conversation.lastMessageTimestamp.toDate().toLocaleString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: 'numeric',
                                      minute: '2-digit'
                                    })
                                  ) : (
                                    'No messages'
                                  )}
                                </span>
                              </div>
                              {conversation.lastMessage && (
                                <span className="text-text-muted">
                                  {conversation.lastMessageStatus === 'read' ? (
                                    <CheckCheck className="h-4 w-4 text-accent-sage" />
                                  ) : conversation.lastMessageStatus === 'delivered' ? (
                                    <Check className="h-4 w-4 text-accent-sage" />
                                  ) : (
                                    <Check className="h-4 w-4 text-text-muted" />
                                  )}
                                </span>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        
                        {conversation.tradeName && (
                          <p className="text-sm text-accent-moss mb-1 truncate font-medium">
                            Re: {conversation.tradeName}
                          </p>
                        )}
                        
                        <p className="text-sm text-text-secondary truncate flex items-center gap-2">
                          {otherParticipant && conversation.isTyping?.[otherParticipant.id] === true ? (
                            <span className="text-accent-sage text-xs animate-pulse">
                              {otherParticipant.displayName} is typing...
                            </span>
                          ) : (
                            conversation.lastMessage || 'No messages yet'
                          )}
                        </p>
                        
                        {hasUnread && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-sage/20 text-accent-moss mt-2">
                            {conversation.unreadCount[user.uid]} new message{conversation.unreadCount[user.uid] > 1 ? 's' : ''}
                            {otherParticipant?.isOnline && conversation.isTyping?.[otherParticipant.id] && (
                              <span className="ml-2 text-accent-sage">●</span>
                            )}
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

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowLeft, Send, User } from 'lucide-react';
import type { Conversation, Message, UserProfile } from '../types';

export function Conversation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !user) return;

    // Subscribe to conversation updates
    const unsubConversation = onSnapshot(doc(db, 'conversations', id), (doc) => {
      if (doc.exists()) {
        const conversationData = { id: doc.id, ...doc.data() } as Conversation;
        setConversation(conversationData);

        // Fetch other participant's profile
        const otherUserId = conversationData.participants.find(pid => pid !== user.uid);
        if (otherUserId) {
          getDoc(doc(db, 'users', otherUserId)).then((userDoc) => {
            if (userDoc.exists()) {
              setOtherUser({ id: userDoc.id, ...userDoc.data() } as UserProfile);
            }
          });
        }
      }
    });

    // Subscribe to messages
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', id),
      orderBy('createdAt', 'asc')
    );

    const unsubMessages = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messagesData);
      setLoading(false);
    });

    return () => {
      unsubConversation();
      unsubMessages();
    };
  }, [id, user]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !conversation) return;

    try {
      // Add new message
      await addDoc(collection(db, 'messages'), {
        conversationId: id,
        senderId: user.uid,
        content: newMessage,
        createdAt: serverTimestamp(),
        read: false
      });

      // Update conversation
      await updateDoc(doc(db, 'conversations', id), {
        lastMessage: newMessage,
        lastMessageTimestamp: serverTimestamp(),
        [`unreadCount.${otherUser?.id}`]: (conversation.unreadCount?.[otherUser?.id] || 0) + 1,
        updatedAt: serverTimestamp()
      });

      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error || 'Conversation not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex items-center">
          <button
            onClick={() => navigate('/messages')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <User className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <h2 className="font-medium text-gray-900">
                {otherUser?.displayName || 'Unknown User'}
              </h2>
              {conversation.tradeName && (
                <p className="text-sm text-indigo-600">
                  Re: {conversation.tradeName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.senderId === user?.uid;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isOwnMessage
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-75 mt-1 block">
                      {message.createdAt?.toDate().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
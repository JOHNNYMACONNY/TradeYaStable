import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, Calendar, Users, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import type { Collaboration, UserProfile } from '../types';
import { XP_CONFIG, awardExperience, checkAndAwardBadges } from '../lib/reputation';

export function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Collaboration | null>(null);
  const [creator, setCreator] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    async function fetchProjectAndCreator() {
      if (!id) return;

      try {
        const projectDoc = await getDoc(doc(db, 'collaborations', id));
        if (!projectDoc.exists()) {
          setError('Project not found');
          return;
        }

        const projectData = { id: projectDoc.id, ...projectDoc.data() } as Collaboration;
        setProject(projectData);

        // Fetch creator details
        const creatorDoc = await getDoc(doc(db, 'users', projectData.creatorId));
        if (creatorDoc.exists()) {
          setCreator({ id: creatorDoc.id, ...creatorDoc.data() } as UserProfile);
        }
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    }

    fetchProjectAndCreator();
  }, [id]);

  const handleJoinRole = async (roleIndex: number) => {
    if (!user || !project || joining) return;

    setJoining(true);
    try {
      const updatedRoles = [...project.roles];
      updatedRoles[roleIndex] = {
        ...updatedRoles[roleIndex],
        filled: true,
        userId: user.uid
      };

      await updateDoc(doc(db, 'collaborations', project.id), {
        roles: updatedRoles,
        updatedAt: serverTimestamp()
      });

      setProject(prev => prev ? { ...prev, roles: updatedRoles } : null);
    } catch (err) {
      setError('Failed to join role');
    } finally {
      setJoining(false);
    }
  };

  const handleUpdateStatus = async (newStatus: Collaboration['status']) => {
    if (!project || !user || updatingStatus) return;

    setUpdatingStatus(true);
    try {
      await updateDoc(doc(db, 'collaborations', project.id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      // Award XP when project is completed
      if (newStatus === 'completed') {
        // Award XP to all participants
        const participants = project.roles
          .filter(role => role.filled && role.userId)
          .map(role => ({
            userId: role.userId!,
            skills: role.skills
          }));

        for (const participant of participants) {
          await awardExperience(
            participant.userId,
            XP_CONFIG.COLLABORATION_COMPLETION,
            participant.skills
          );
          
          // Check and award badges
          const participantProfile = await getDoc(doc(db, 'users', participant.userId));
          if (participantProfile.exists()) {
            await checkAndAwardBadges(participant.userId, participantProfile.data() as UserProfile);
          }
        }
      }

      setProject(prev => prev ? { ...prev, status: newStatus } : null);
      setShowStatusModal(false);
    } catch (err) {
      setError('Failed to update project status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleContact = async () => {
    if (!user || !project || !creator) return;
    
    try {
      // Create or get conversation
      const conversationRef = await addDoc(collection(db, 'conversations'), {
        participants: [user.uid, project.creatorId],
        projectId: id,
        projectName: project.title,
        lastMessage: '',
        unreadCount: {
          [project.creatorId]: 0,
          [user.uid]: 0
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      navigate(`/messages/${conversationRef.id}`);
    } catch (err) {
      setError('Failed to start conversation');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error || 'Project not found'}
        </div>
      </div>
    );
  }

  const isCreator = user?.uid === project.creatorId;
  const allRolesFilled = project.roles.every(role => role.filled);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                Posted {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
            <span className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${project.status === 'recruiting' ? 'bg-green-100 text-green-800' : 
                project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-gray-100 text-gray-800'}
            `}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>

          {/* Creator Info */}
          {creator && (
            <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
              <User className="h-12 w-12 text-gray-400 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">{creator.displayName}</h3>
                <p className="text-gray-600 text-sm">{creator.bio || 'No bio available'}</p>
              </div>
              {!isCreator && (
                <button
                  onClick={handleContact}
                  className="ml-auto flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <MessageSquare className="h-4 w-4" />
                  Contact
                </button>
              )}
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">About the Project</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{project.description}</p>
          </div>

          {/* Roles */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Team Roles</h2>
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-2" />
                <span>
                  {project.roles.filter(role => role.filled).length}/{project.roles.length} filled
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {project.roles.map((role, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{role.title}</h3>
                    {role.filled ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        Filled
                      </span>
                    ) : (
                      <button
                        onClick={() => handleJoinRole(index)}
                        disabled={joining || !user || isCreator}
                        className="px-4 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {joining ? 'Joining...' : 'Join Role'}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {isCreator && (
            <div className="flex gap-4">
              <button
                onClick={() => setShowStatusModal(true)}
                disabled={updatingStatus}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="h-5 w-5" />
                Update Status
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Update Project Status</h3>
            <div className="space-y-3">
              {project.status === 'recruiting' && (
                <button
                  onClick={() => handleUpdateStatus('in-progress')}
                  disabled={!allRolesFilled || updatingStatus}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <AlertCircle className="h-5 w-5" />
                  Start Project
                </button>
              )}
              {project.status !== 'completed' && (
                <button
                  onClick={() => handleUpdateStatus('completed')}
                  disabled={updatingStatus}
                  className="w-full flex items-center justify-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded hover:bg-green-200"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Mark as Completed
                </button>
              )}
              {project.status !== 'recruiting' && (
                <button
                  onClick={() => handleUpdateStatus('recruiting')}
                  disabled={updatingStatus}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
                >
                  Reopen Recruitment
                </button>
              )}
              <button
                onClick={() => setShowStatusModal(false)}
                className="w-full px-4 py-2 text-gray-600 hover:bg-gray-50 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
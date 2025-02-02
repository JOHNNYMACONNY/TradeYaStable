import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { X, Plus } from 'lucide-react';
import type { Trade } from '../types';

export function CreateTrade() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { add } = useFirestore<Trade>('trades');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    offeredSkill: '',
    requestedSkill: '',
    offeredSkills: [] as string[],
    requestedSkills: [] as string[],
  });

  const handleAddSkill = (type: 'offered' | 'requested') => {
    const skill = type === 'offered' ? formData.offeredSkill : formData.requestedSkill;
    if (!skill.trim()) return;

    const skillsArray = type === 'offered' ? 'offeredSkills' : 'requestedSkills';
    const skillField = type === 'offered' ? 'offeredSkill' : 'requestedSkill';

    if (!formData[skillsArray].includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        [skillsArray]: [...prev[skillsArray], skill.trim()],
        [skillField]: ''
      }));
    }
  };

  const handleRemoveSkill = (type: 'offered' | 'requested', skillToRemove: string) => {
    const skillsArray = type === 'offered' ? 'offeredSkills' : 'requestedSkills';
    setFormData(prev => ({
      ...prev,
      [skillsArray]: prev[skillsArray].filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.offeredSkills.length === 0 || formData.requestedSkills.length === 0) {
      setError('Please add at least one skill in each category');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await add({
        title: formData.title,
        description: formData.description,
        offeredSkills: formData.offeredSkills,
        requestedSkills: formData.requestedSkills,
        creatorId: user.uid,
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      navigate('/discover');
    } catch (err) {
      setError('Failed to create trade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Trade</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="What are you looking to trade?"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                placeholder="Describe your trade offer in detail..."
                required
              />
            </div>

            {/* Skills Offered */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills You're Offering
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={formData.offeredSkill}
                  onChange={(e) => setFormData(prev => ({ ...prev, offeredSkill: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('offered'))}
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add a skill you're offering..."
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill('offered')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.offeredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill('offered', skill)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Skills Requested */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills You're Looking For
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={formData.requestedSkill}
                  onChange={(e) => setFormData(prev => ({ ...prev, requestedSkill: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('requested'))}
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add a skill you're looking for..."
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill('requested')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.requestedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill('requested', skill)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Trade...' : 'Create Trade'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
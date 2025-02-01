import { UserProfile } from '../types';
import { calculateLevel, LEVEL_THRESHOLDS } from '../lib/reputation';
import { Award, Star, ThumbsUp, Trophy, Zap, Target } from 'lucide-react';

interface ReputationCardProps {
  profile: UserProfile;
  showEndorsements?: boolean;
}

export function ReputationCard({ profile, showEndorsements = true }: ReputationCardProps) {
  const level = calculateLevel(profile.experience);
  const nextLevelXP = LEVEL_THRESHOLDS[level + 1] || LEVEL_THRESHOLDS[level];
  const currentLevelXP = LEVEL_THRESHOLDS[level];
  const progress = ((profile.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="card">
      {/* Level and XP */}
      <div className="p-6 border-b border-cyber-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyber-gray-900 border border-cyber-gray-800 flex items-center justify-center">
                <span className="text-xs font-medium text-neon-green">{level}</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-cyber-gray-50">Level {level}</h3>
              <p className="text-sm text-cyber-gray-400">
                {profile.experience} / {nextLevelXP} XP
              </p>
            </div>
          </div>
          <Zap className="h-5 w-5 text-neon-orange animate-pulse" />
        </div>
        
        {/* XP Progress Bar */}
        <div className="relative h-2 bg-cyber-gray-800 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 bg-[length:20px_20px] bg-noise opacity-25" />
        </div>
      </div>

      {/* Skill Levels */}
      <div className="p-6 border-b border-cyber-gray-800">
        <h3 className="text-lg font-display font-semibold text-cyber-gray-50 mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-neon-orange" />
          Skill Levels
        </h3>
        <div className="space-y-3">
          {Object.entries(profile.skillLevels || {}).map(([skill, { level, experience }]) => (
            <div key={skill} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-cyber-gray-200 group-hover:text-neon-blue transition-colors">
                  {skill}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-neon-green">Lvl {level}</span>
                  {showEndorsements && profile.endorsements?.[skill] && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple">
                      <ThumbsUp className="h-3 w-3" />
                      <span className="text-xs font-medium">{profile.endorsements[skill].length}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="h-1 bg-cyber-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-300 group-hover:from-neon-purple group-hover:to-neon-blue"
                  style={{ width: `${(experience / 1000) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      {profile.badges && profile.badges.length > 0 && (
        <div className="p-6">
          <h3 className="text-lg font-display font-semibold text-cyber-gray-50 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-neon-orange" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {profile.badges.map((badge) => (
              <div
                key={badge.id}
                className="group p-3 rounded-lg bg-cyber-gray-800/50 hover:bg-cyber-gray-800 
                          border border-cyber-gray-700 hover:border-neon-blue 
                          transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-cyber-gray-50 group-hover:text-neon-blue transition-colors">
                      {badge.name}
                    </p>
                    <p className="text-xs text-cyber-gray-400 mt-1">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
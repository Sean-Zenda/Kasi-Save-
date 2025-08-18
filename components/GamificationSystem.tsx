import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Trophy, Star, Target, TrendingUp, Award, Flame, Coins, Crown } from 'lucide-react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: 'milestone' | 'streak' | 'goal' | 'social' | 'challenge';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirement: number;
  reward: {
    xp: number;
    coins: number;
    title?: string;
  };
  unlockedAt?: Date;
  progress: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  requirement: number;
  reward: {
    xp: number;
    coins: number;
  };
  progress: number;
  completed: boolean;
  expiresAt: Date;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  coins: number;
  streak: number;
  longestStreak: number;
  totalSaved: number;
  goalsCompleted: number;
  achievements: Achievement[];
  activeChallenges: Challenge[];
  title?: string;
}

const ACHIEVEMENTS: Omit<Achievement, 'progress' | 'unlockedAt'>[] = [
  {
    id: 'first_deposit',
    name: 'First Steps',
    description: 'Make your first deposit',
    icon: <Coins className="w-4 h-4" />,
    type: 'milestone',
    tier: 'bronze',
    requirement: 1,
    reward: { xp: 100, coins: 50 }
  },
  {
    id: 'saver_100',
    name: 'Century Saver',
    description: 'Save R100 or more',
    icon: <Target className="w-4 h-4" />,
    type: 'milestone',
    tier: 'bronze',
    requirement: 100,
    reward: { xp: 200, coins: 100 }
  },
  {
    id: 'saver_1000',
    name: 'Thousand Club',
    description: 'Save R1,000 or more',
    icon: <TrendingUp className="w-4 h-4" />,
    type: 'milestone',
    tier: 'silver',
    requirement: 1000,
    reward: { xp: 500, coins: 250 }
  },
  {
    id: 'saver_5000',
    name: 'High Roller',
    description: 'Save R5,000 or more',
    icon: <Crown className="w-4 h-4" />,
    type: 'milestone',
    tier: 'gold',
    requirement: 5000,
    reward: { xp: 1000, coins: 500 }
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day saving streak',
    icon: <Flame className="w-4 h-4" />,
    type: 'streak',
    tier: 'bronze',
    requirement: 7,
    reward: { xp: 300, coins: 150 }
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day saving streak',
    icon: <Award className="w-4 h-4" />,
    type: 'streak',
    tier: 'silver',
    requirement: 30,
    reward: { xp: 800, coins: 400 }
  },
  {
    id: 'first_goal',
    name: 'Goal Getter',
    description: 'Complete your first savings goal',
    icon: <Trophy className="w-4 h-4" />,
    type: 'goal',
    tier: 'silver',
    requirement: 1,
    reward: { xp: 600, coins: 300, title: 'Goal Achiever' }
  },
  {
    id: 'multi_goals',
    name: 'Multitasker',
    description: 'Have 3 active savings goals',
    icon: <Star className="w-4 h-4" />,
    type: 'goal',
    tier: 'gold',
    requirement: 3,
    reward: { xp: 800, coins: 400, title: 'Savings Pro' }
  }
];

const DAILY_CHALLENGES: Omit<Challenge, 'progress' | 'completed' | 'expiresAt'>[] = [
  {
    id: 'daily_deposit',
    name: 'Daily Saver',
    description: 'Make a deposit today',
    type: 'daily',
    requirement: 1,
    reward: { xp: 50, coins: 25 }
  },
  {
    id: 'daily_goal_check',
    name: 'Progress Check',
    description: 'Check your goal progress today',
    type: 'daily',
    requirement: 1,
    reward: { xp: 30, coins: 15 }
  },
  {
    id: 'daily_ai_chat',
    name: 'Wise Counsel',
    description: 'Chat with your AI coach today',
    type: 'daily',
    requirement: 1,
    reward: { xp: 40, coins: 20 }
  }
];

export const GamificationSystem = {
  // Calculate user level from XP
  calculateLevel: (totalXp: number): { level: number; xpToNextLevel: number } => {
    // Level formula: Level = floor(sqrt(totalXp / 100))
    const level = Math.floor(Math.sqrt(totalXp / 100)) || 1;
    const xpForCurrentLevel = level * level * 100;
    const xpForNextLevel = (level + 1) * (level + 1) * 100;
    const xpToNextLevel = xpForNextLevel - totalXp;
    
    return { level, xpToNextLevel };
  },

  // Initialize user stats
  initializeStats: (): UserStats => {
    const totalXp = 0;
    const { level, xpToNextLevel } = GamificationSystem.calculateLevel(totalXp);
    
    return {
      level,
      xp: 0,
      xpToNextLevel,
      totalXp,
      coins: 0,
      streak: 0,
      longestStreak: 0,
      totalSaved: 0,
      goalsCompleted: 0,
      achievements: ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        progress: 0
      })),
      activeChallenges: DAILY_CHALLENGES.map(challenge => ({
        ...challenge,
        progress: 0,
        completed: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      }))
    };
  },

  // Award XP and coins
  awardReward: (stats: UserStats, xp: number, coins: number): UserStats => {
    const newTotalXp = stats.totalXp + xp;
    const { level, xpToNextLevel } = GamificationSystem.calculateLevel(newTotalXp);
    
    return {
      ...stats,
      level,
      xp: newTotalXp - (level - 1) * (level - 1) * 100,
      xpToNextLevel,
      totalXp: newTotalXp,
      coins: stats.coins + coins
    };
  },

  // Check and unlock achievements
  checkAchievements: (stats: UserStats, data: {
    totalSaved: number;
    streak: number;
    goalsCompleted: number;
    activeGoalsCount: number;
    depositCount: number;
  }): { updatedStats: UserStats; newAchievements: Achievement[] } => {
    const newAchievements: Achievement[] = [];
    let updatedStats = { ...stats };

    updatedStats.achievements = stats.achievements.map(achievement => {
      if (achievement.unlockedAt) return achievement;

      let progress = 0;
      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_deposit':
          progress = Math.min(data.depositCount, 1);
          shouldUnlock = data.depositCount >= 1;
          break;
        case 'saver_100':
          progress = Math.min(data.totalSaved / 100, 1);
          shouldUnlock = data.totalSaved >= 100;
          break;
        case 'saver_1000':
          progress = Math.min(data.totalSaved / 1000, 1);
          shouldUnlock = data.totalSaved >= 1000;
          break;
        case 'saver_5000':
          progress = Math.min(data.totalSaved / 5000, 1);
          shouldUnlock = data.totalSaved >= 5000;
          break;
        case 'streak_7':
          progress = Math.min(data.streak / 7, 1);
          shouldUnlock = data.streak >= 7;
          break;
        case 'streak_30':
          progress = Math.min(data.streak / 30, 1);
          shouldUnlock = data.streak >= 30;
          break;
        case 'first_goal':
          progress = Math.min(data.goalsCompleted / 1, 1);
          shouldUnlock = data.goalsCompleted >= 1;
          break;
        case 'multi_goals':
          progress = Math.min(data.activeGoalsCount / 3, 1);
          shouldUnlock = data.activeGoalsCount >= 3;
          break;
        default:
          progress = achievement.progress;
      }

      if (shouldUnlock && !achievement.unlockedAt) {
        const unlockedAchievement = {
          ...achievement,
          progress: 1,
          unlockedAt: new Date()
        };
        newAchievements.push(unlockedAchievement);
        
        // Award XP and coins
        updatedStats = GamificationSystem.awardReward(
          updatedStats, 
          achievement.reward.xp, 
          achievement.reward.coins
        );
        
        // Set title if achievement provides one
        if (achievement.reward.title) {
          updatedStats.title = achievement.reward.title;
        }
        
        return unlockedAchievement;
      }

      return { ...achievement, progress };
    });

    return { updatedStats, newAchievements };
  },

  // Get tier color
  getTierColor: (tier: Achievement['tier']): string => {
    switch (tier) {
      case 'bronze': return 'text-amber-600';
      case 'silver': return 'text-slate-400';
      case 'gold': return 'text-yellow-500';
      case 'platinum': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  },

  // Get tier background
  getTierBackground: (tier: Achievement['tier']): string => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 dark:bg-amber-900/20';
      case 'silver': return 'bg-slate-100 dark:bg-slate-900/20';
      case 'gold': return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'platinum': return 'bg-purple-100 dark:bg-purple-900/20';
      default: return 'bg-gray-100 dark:bg-gray-900/20';
    }
  }
};

export interface GamificationStatsProps {
  stats: UserStats;
  compact?: boolean;
}

export const GamificationStats: React.FC<GamificationStatsProps> = ({ stats, compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-4 p-3 bg-card rounded-lg border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">{stats.level}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Level {stats.level}</span>
            <Progress value={(stats.xp / (stats.xp + stats.xpToNextLevel)) * 100} className="w-16 h-1" />
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">{stats.coins}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium">{stats.streak}</span>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Your Progress
          {stats.title && (
            <Badge variant="secondary" className="ml-2">
              {stats.title}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.level}</div>
            <div className="text-sm text-muted-foreground">Level</div>
            <Progress 
              value={(stats.xp / (stats.xp + stats.xpToNextLevel)) * 100} 
              className="mt-2 h-2"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {stats.xpToNextLevel} XP to next level
            </div>
          </div>
          
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-500">{stats.coins}</div>
            <div className="text-sm text-muted-foreground">Coins</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <div className="text-xl font-bold text-orange-500">{stats.streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
          
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <div className="text-xl font-bold text-green-500">{stats.achievements.filter(a => a.unlockedAt).length}</div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
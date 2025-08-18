import { UserBadge, StreakData } from './Achievements';

export const DEFAULT_BADGES: UserBadge[] = [
  // Milestone Badges
  {
    id: 'first-save',
    name: 'First Steps',
    description: 'Made your very first deposit',
    icon: 'PiggyBank',
    category: 'milestone',
    isEarned: false,
    requirement: 1,
    progress: 0,
    reward: '+5 Motivation Points'
  },
  {
    id: 'saver-100',
    name: 'Century Saver',
    description: 'Saved your first R100',
    icon: 'Target',
    category: 'milestone',
    isEarned: false,
    requirement: 100,
    progress: 0,
    reward: '+10 Motivation Points'
  },
  {
    id: 'saver-500',
    name: 'Half-K Hero',
    description: 'Reached R500 in savings',
    icon: 'Star',
    category: 'milestone',
    isEarned: false,
    requirement: 500,
    progress: 0,
    reward: '+15 Motivation Points'
  },
  {
    id: 'saver-1000',
    name: 'Thousand Club',
    description: 'Joined the R1,000 savings club',
    icon: 'Crown',
    category: 'milestone',
    isEarned: false,
    requirement: 1000,
    progress: 0,
    reward: '+25 Motivation Points'
  },
  {
    id: 'saver-5000',
    name: 'Big Dreamer',
    description: 'Saved an impressive R5,000',
    icon: 'Trophy',
    category: 'milestone',
    isEarned: false,
    requirement: 5000,
    progress: 0,
    reward: '+50 Motivation Points'
  },

  // Streak Badges
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintained a 7-day saving streak',
    icon: 'Flame',
    category: 'streak',
    isEarned: false,
    requirement: 7,
    progress: 0,
    reward: 'Streak Protector Shield'
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Incredible 30-day saving streak',
    icon: 'Calendar',
    category: 'streak',
    isEarned: false,
    requirement: 30,
    progress: 0,
    reward: 'Consistency Crown'
  },
  {
    id: 'streak-100',
    name: 'Streak Legend',
    description: 'Legendary 100-day saving streak',
    icon: 'Zap',
    category: 'streak',
    isEarned: false,
    requirement: 100,
    progress: 0,
    reward: 'Golden Streak Badge'
  },

  // Goal Badges
  {
    id: 'first-goal',
    name: 'Goal Getter',
    description: 'Completed your first savings goal',
    icon: 'Target',
    category: 'goal',
    isEarned: false,
    requirement: 1,
    progress: 0,
    reward: 'Goal Master Title'
  },
  {
    id: 'goal-crusher',
    name: 'Goal Crusher',
    description: 'Completed 3 different savings goals',
    icon: 'Award',
    category: 'goal',
    isEarned: false,
    requirement: 3,
    progress: 0,
    reward: 'VIP Saver Status'
  },
  {
    id: 'speed-saver',
    name: 'Speed Saver',
    description: 'Reached your goal 30% faster than planned',
    icon: 'TrendingUp',
    category: 'goal',
    isEarned: false,
    requirement: 1,
    progress: 0,
    reward: 'Efficiency Badge'
  },

  // Special Badges
  {
    id: 'emergency-fund',
    name: 'Safety First',
    description: 'Built an emergency fund worth 3 months expenses',
    icon: 'Shield',
    category: 'special',
    isEarned: false,
    requirement: 15000, // Assuming R5000/month expenses
    progress: 0,
    reward: 'Peace of Mind Certificate'
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Made 10 deposits before 9 AM',
    icon: 'Star',
    category: 'special',
    isEarned: false,
    requirement: 10,
    progress: 0,
    reward: 'Morning Motivation Boost'
  },
  {
    id: 'weekend-warrior',
    name: 'Weekend Warrior',
    description: 'Made 5 weekend deposits',
    icon: 'Gift',
    category: 'special',
    isEarned: false,
    requirement: 5,
    progress: 0,
    reward: 'Weekend Bonus Multiplier'
  }
];

export const updateBadgeProgress = (
  badges: UserBadge[],
  user: {
    totalSaved: number;
    streak: number;
    goalsCompleted: number;
    totalDeposits: number;
    goal: { saved: number; amount: number; };
  }
): UserBadge[] => {
  return badges.map(badge => {
    let newProgress = badge.progress || 0;
    let isEarned = badge.isEarned;

    switch (badge.id) {
      // Milestone badges based on total saved
      case 'first-save':
        newProgress = user.totalDeposits;
        break;
      case 'saver-100':
      case 'saver-500':
      case 'saver-1000':
      case 'saver-5000':
      case 'emergency-fund':
        newProgress = user.totalSaved;
        break;
      
      // Streak badges
      case 'streak-7':
      case 'streak-30':
      case 'streak-100':
        newProgress = user.streak;
        break;
      
      // Goal badges
      case 'first-goal':
      case 'goal-crusher':
        newProgress = user.goalsCompleted;
        break;
      case 'speed-saver':
        // Check if goal is completed ahead of schedule
        if (user.goal.saved >= user.goal.amount) {
          newProgress = 1;
        }
        break;
      
      // Special badges (would need additional tracking in real app)
      case 'early-bird':
      case 'weekend-warrior':
        // These would need additional tracking data
        // For demo purposes, keeping current progress
        break;
    }

    // Check if badge should be earned
    if (!isEarned && newProgress >= badge.requirement) {
      isEarned = true;
    }

    return {
      ...badge,
      progress: newProgress,
      isEarned,
      earnedDate: isEarned && !badge.isEarned ? new Date() : badge.earnedDate
    };
  });
};

export const initializeUserBadges = (): UserBadge[] => {
  return DEFAULT_BADGES.map(badge => ({ ...badge }));
};

export const calculateStreakData = (
  currentStreak: number,
  lastSaveDate?: Date
): {
  daily: StreakData;
  weekly: StreakData;
  monthly: StreakData;
} => {
  // This is a simplified calculation - in a real app you'd track actual dates
  const dailyStreak = currentStreak;
  const weeklyStreak = Math.floor(currentStreak / 7);
  const monthlyStreak = Math.floor(currentStreak / 30);

  return {
    daily: {
      current: dailyStreak,
      longest: dailyStreak, // In real app, track separately
      type: 'daily',
      lastSaveDate
    },
    weekly: {
      current: weeklyStreak,
      longest: weeklyStreak,
      type: 'weekly',
      lastSaveDate
    },
    monthly: {
      current: monthlyStreak,
      longest: monthlyStreak,
      type: 'monthly',
      lastSaveDate
    }
  };
};
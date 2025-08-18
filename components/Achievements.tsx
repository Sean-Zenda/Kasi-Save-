import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Trophy, 
  Target, 
  Flame, 
  Calendar, 
  PiggyBank, 
  TrendingUp,
  Star,
  Award,
  Crown,
  Zap,
  Shield,
  Gift,
  Lock
} from 'lucide-react';

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'streak' | 'goal' | 'special';
  earnedDate?: Date;
  isEarned: boolean;
  progress?: number;
  requirement: number;
  reward?: string;
}

export interface StreakData {
  current: number;
  longest: number;
  type: 'daily' | 'weekly' | 'monthly';
  lastSaveDate?: Date;
}

interface AchievementsProps {
  user: {
    name?: string;
    totalSaved: number;
    goal: {
      name: string;
      amount: number;
      saved: number;
    };
    streak: number;
    badges: UserBadge[];
    streaks: {
      daily: StreakData;
      weekly: StreakData;
      monthly: StreakData;
    };
    goalsCompleted: number;
    totalDeposits: number;
  };
  onBack: () => void;
}

export function Achievements({ user, onBack }: AchievementsProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'milestone' | 'streak' | 'goal' | 'special'>('all');

  const badgeIcons = {
    Trophy,
    Target,
    Flame,
    Calendar,
    PiggyBank,
    TrendingUp,
    Star,
    Award,
    Crown,
    Zap,
    Shield,
    Gift
  };

  const getBadgeIcon = (iconName: string) => {
    return badgeIcons[iconName as keyof typeof badgeIcons] || Trophy;
  };

  const filterBadges = (badges: UserBadge[]) => {
    if (selectedCategory === 'all') return badges;
    return badges.filter(badge => badge.category === selectedCategory);
  };

  const earnedBadges = user.badges.filter(badge => badge.isEarned);
  const availableBadges = user.badges.filter(badge => !badge.isEarned);
  const filteredEarned = filterBadges(earnedBadges);
  const filteredAvailable = filterBadges(availableBadges);

  const getProgressPercentage = (badge: UserBadge) => {
    if (badge.isEarned) return 100;
    if (!badge.progress) return 0;
    return Math.min((badge.progress / badge.requirement) * 100, 100);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'milestone': return 'bg-blue-500/20 text-blue-400';
      case 'streak': return 'bg-orange-500/20 text-orange-400';
      case 'goal': return 'bg-green-500/20 text-green-400';
      case 'special': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const BadgeCard = ({ badge }: { badge: UserBadge }) => {
    const IconComponent = getBadgeIcon(badge.icon);
    const progressPercentage = getProgressPercentage(badge);

    return (
      <Card className={`p-4 border-border transition-all duration-200 ${
        badge.isEarned 
          ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30' 
          : 'bg-secondary border-border hover:border-border/60'
      }`}>
        <div className="flex items-start space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            badge.isEarned 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {badge.isEarned ? (
              <IconComponent className="w-6 h-6" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-1">
              <h3 className={`${badge.isEarned ? 'text-white' : 'text-muted-foreground'}`}>
                {badge.name}
              </h3>
              <Badge className={getCategoryColor(badge.category)}>
                {badge.category}
              </Badge>
            </div>
            <p className={`text-sm mb-2 ${
              badge.isEarned ? 'text-muted-foreground' : 'text-muted-foreground/70'
            }`}>
              {badge.description}
            </p>
            {badge.isEarned ? (
              <div className="flex items-center space-x-2">
                <Badge className="bg-primary/20 text-primary">
                  Earned {badge.earnedDate?.toLocaleDateString()}
                </Badge>
                {badge.reward && (
                  <Badge className="bg-green-500/20 text-green-400">
                    {badge.reward}
                  </Badge>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {badge.progress || 0} / {badge.requirement}
                  </span>
                  <span className="text-muted-foreground">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const StreakCard = ({ type, data }: { type: string; data: StreakData }) => {
    const getStreakIcon = () => {
      switch (type) {
        case 'daily': return Flame;
        case 'weekly': return Calendar;
        case 'monthly': return Crown;
        default: return Flame;
      }
    };

    const StreakIcon = getStreakIcon();

    return (
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <StreakIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-white capitalize">{type} Streak</h3>
            <p className="text-2xl text-primary">{data.current} days</p>
            <p className="text-sm text-muted-foreground">
              Best: {data.longest} days
            </p>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-secondary"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-white">Achievements</h1>
              <p className="text-muted-foreground text-sm">
                {earnedBadges.length} of {user.badges.length} badges earned
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-primary" />
            <span className="text-primary">{earnedBadges.length}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Streak Overview */}
        <div className="space-y-4">
          <h2 className="text-white">Current Streaks</h2>
          <div className="grid grid-cols-1 gap-4">
            <StreakCard type="daily" data={user.streaks.daily} />
            <StreakCard type="weekly" data={user.streaks.weekly} />
            <StreakCard type="monthly" data={user.streaks.monthly} />
          </div>
        </div>

        {/* Achievement Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white">Achievement Progress</h2>
            <Badge className="bg-primary/20 text-primary">
              {Math.round((earnedBadges.length / user.badges.length) * 100)}% Complete
            </Badge>
          </div>
          <Progress 
            value={(earnedBadges.length / user.badges.length) * 100} 
            className="h-3"
          />
        </div>

        {/* Badges */}
        <Tabs defaultValue="earned" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger value="earned" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Earned ({earnedBadges.length})
            </TabsTrigger>
            <TabsTrigger value="available" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Available ({availableBadges.length})
            </TabsTrigger>
          </TabsList>

          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {['all', 'milestone', 'streak', 'goal', 'special'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category as any)}
                className={`capitalize whitespace-nowrap ${
                  selectedCategory === category 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-border text-white hover:bg-secondary'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          <TabsContent value="earned" className="space-y-4">
            {filteredEarned.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredEarned.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center bg-secondary border-border">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-white mb-2">No earned badges yet</h3>
                <p className="text-muted-foreground">
                  Start saving to earn your first achievement!
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            {filteredAvailable.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredAvailable.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center bg-secondary border-border">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-white mb-2">All badges earned!</h3>
                <p className="text-muted-foreground">
                  Congratulations! You've earned all available badges.
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
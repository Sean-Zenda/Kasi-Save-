import { ArrowLeft, Trophy, Star, Target, Award, Flame, Crown, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Achievement, Challenge, GamificationSystem } from '../components/GamificationSystem';
import { useLanguage } from '../components/LanguageContext';

interface AchievementsScreenProps {
  achievements: Achievement[];
  challenges: Challenge[];
  onBack: () => void;
}

export const Achievements: React.FC<AchievementsScreenProps> = ({
  achievements,
  challenges,
  onBack
}) => {
  const { t } = useLanguage();

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);
  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  const groupedAchievements = achievements.reduce((groups, achievement) => {
    if (!groups[achievement.type]) {
      groups[achievement.type] = [];
    }
    groups[achievement.type].push(achievement);
    return groups;
  }, {} as Record<string, Achievement[]>);

  const formatTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Target className="w-5 h-5" />;
      case 'streak': return <Flame className="w-5 h-5" />;
      case 'goal': return <Trophy className="w-5 h-5" />;
      case 'social': return <Star className="w-5 h-5" />;
      case 'challenge': return <Award className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  const getTypeTitle = (type: string): string => {
    switch (type) {
      case 'milestone': return 'Milestones';
      case 'streak': return 'Streak Master';
      case 'goal': return 'Goal Achiever';
      case 'social': return 'Social Saver';
      case 'challenge': return 'Challenger';
      default: return 'Achievements';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Achievements</h1>
            <p className="text-sm text-muted-foreground">
              {unlockedAchievements.length} of {achievements.length} unlocked
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">{unlockedAchievements.length}</div>
            <div className="text-xs text-muted-foreground">Unlocked</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="achievements" className="space-y-6">
            {/* Achievement Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{unlockedAchievements.length}</div>
                    <div className="text-muted-foreground">Achievements Unlocked</div>
                  </div>
                  <Progress 
                    value={(unlockedAchievements.length / achievements.length) * 100} 
                    className="h-3"
                  />
                  <div className="text-sm text-muted-foreground">
                    {((unlockedAchievements.length / achievements.length) * 100).toFixed(1)}% Complete
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Unlocked Achievements */}
            {unlockedAchievements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Unlocked Achievements
                </h3>
                <div className="grid gap-4">
                  {unlockedAchievements.map((achievement) => (
                    <Card key={achievement.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${GamificationSystem.getTierBackground(achievement.tier)}`}>
                            <div className={GamificationSystem.getTierColor(achievement.tier)}>
                              {achievement.icon}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold truncate">{achievement.name}</h4>
                              <Badge 
                                variant="outline" 
                                className={`${GamificationSystem.getTierColor(achievement.tier)} border-current`}
                              >
                                {achievement.tier}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {achievement.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>+{achievement.reward.xp} XP</span>
                              <span>+{achievement.reward.coins} Coins</span>
                              {achievement.unlockedAt && (
                                <span>Unlocked {achievement.unlockedAt.toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Locked Achievements by Category */}
            {Object.entries(groupedAchievements).map(([type, typeAchievements]) => {
              const lockedInType = typeAchievements.filter(a => !a.unlockedAt);
              if (lockedInType.length === 0) return null;

              return (
                <div key={type}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {getTypeIcon(type)}
                    {getTypeTitle(type)}
                  </h3>
                  <div className="grid gap-4">
                    {lockedInType.map((achievement) => (
                      <Card key={achievement.id} className="opacity-75">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                              <Lock className="w-5 h-5 text-muted-foreground" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold truncate text-muted-foreground">
                                  {achievement.name}
                                </h4>
                                <Badge variant="outline" className="text-muted-foreground">
                                  {achievement.tier}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {achievement.description}
                              </p>
                              
                              {achievement.progress > 0 && (
                                <div className="mb-2">
                                  <Progress value={achievement.progress * 100} className="h-2" />
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {(achievement.progress * 100).toFixed(1)}% complete
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>+{achievement.reward.xp} XP</span>
                                <span>+{achievement.reward.coins} Coins</span>
                                {achievement.reward.title && (
                                  <span>Title: "{achievement.reward.title}"</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>
          
          <TabsContent value="challenges" className="space-y-6">
            {/* Active Challenges */}
            {activeChallenges.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Active Challenges
                </h3>
                <div className="grid gap-4">
                  {activeChallenges.map((challenge) => (
                    <Card key={challenge.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{challenge.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {challenge.description}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            {formatTimeRemaining(challenge.expiresAt)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <Progress value={(challenge.progress / challenge.requirement) * 100} />
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {challenge.progress} / {challenge.requirement}
                            </span>
                            <span className="text-primary">
                              +{challenge.reward.xp} XP, +{challenge.reward.coins} coins
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Challenges */}
            {completedChallenges.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-500" />
                  Completed Challenges
                </h3>
                <div className="grid gap-4">
                  {completedChallenges.map((challenge) => (
                    <Card key={challenge.id} className="opacity-75">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <Award className="w-5 h-5 text-green-600" />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-semibold">{challenge.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {challenge.description}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              Completed • +{challenge.reward.xp} XP, +{challenge.reward.coins} coins earned
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {activeChallenges.length === 0 && completedChallenges.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Challenges Available</h3>
                  <p className="text-muted-foreground">
                    Check back tomorrow for new daily challenges!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
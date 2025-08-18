import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Settings, 
  MessageCircle, 
  Users,
  Target,
  Trophy,
  Plus,
  Eye,
  ChevronRight,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { User, Stokvel } from '../navigation/AppNavigator';
import { GamificationStats } from '../components/GamificationSystem';
import { useLanguage } from '../components/LanguageContext';

interface DashboardProps {
  user: User;
  userStokvels: Stokvel[];
  onDeposit: () => void;
  onWithdraw: () => void;
  onSettings: () => void;
  onAIChat: () => void;
  onStokvels: () => void;
  onGoalsManagement: () => void;
  onAchievements: () => void;
  onBillScanner?: () => void;
  onBudgetAlerts?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  userStokvels,
  onDeposit,
  onWithdraw,
  onSettings,
  onAIChat,
  onStokvels,
  onGoalsManagement,
  onAchievements,
  onBillScanner,
  onBudgetAlerts
}) => {
  const { t } = useLanguage();
  const [showAllGoals, setShowAllGoals] = useState(false);

  const activeGoals = user.goals.filter(goal => goal.isActive);
  const recentTransactions = user.transactions.slice(0, 3);
  const primaryGoal = user.goals.find(g => g.id === user.primaryGoalId) || user.goals[0];
  
  const formatCurrency = (amount: number) => `R${amount.toLocaleString()}`;
  
  const calculateProgress = (goal: any) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.good_morning') || 'Good morning';
    if (hour < 17) return t('dashboard.good_afternoon') || 'Good afternoon';
    return t('dashboard.good_evening') || 'Good evening';
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'emergency': return '🚨';
      case 'vacation': return '✈️';
      case 'car': return '🚗';
      case 'house': return '🏠';
      case 'education': return '📚';
      default: return '🎯';
    }
  };

  const unlockedAchievementsCount = user.gamificationStats.achievements.filter(a => a.unlockedAt).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {/* KS Logo */}
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">KS</span>
            </div>
            <div>
              <h1 className="font-medium">{getGreeting()}, {user.name}!</h1>
              <p className="text-sm text-muted-foreground">
                {user.gamificationStats.title ? user.gamificationStats.title : 'Savings Champion'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onAIChat}>
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onSettings}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Gamification Stats */}
        <GamificationStats stats={user.gamificationStats} compact />

        {/* Total Balance Card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-white/80 text-sm">Total Saved</p>
              <h2 className="text-3xl font-bold">{formatCurrency(user.totalSaved)}</h2>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={onDeposit}
                  className="bg-white/20 text-white border-white/20 hover:bg-white/30 gap-2"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  {t('dashboard.deposit') || 'Deposit'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onWithdraw}
                  className="bg-transparent text-white border-white/40 hover:bg-white/10 gap-2"
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  {t('dashboard.withdraw') || 'Withdraw'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Updated to include Stokvels */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onGoalsManagement}>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium">Goals</h3>
              <p className="text-sm text-muted-foreground">{activeGoals.length} active</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onAchievements}>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-medium">Achievements</h3>
              <p className="text-sm text-muted-foreground">{unlockedAchievementsCount} unlocked</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Quick Actions Row - Including Stokvels */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onStokvels}>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium">{t('dashboard.stokvels') || 'Stokvels'}</h3>
              <p className="text-sm text-muted-foreground">
                {userStokvels.length > 0 ? `${userStokvels.length} joined` : 'Join groups'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onAIChat}>
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-medium">AI Coach</h3>
              <p className="text-sm text-muted-foreground">Get advice</p>
            </CardContent>
          </Card>
        </div>

        {/* Third Quick Actions Row - Bill Scanner and Budget Alerts */}
        <div className="grid grid-cols-2 gap-4">
          {onBillScanner && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onBillScanner}>
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-medium">Bill Scanner</h3>
                <p className="text-sm text-muted-foreground">
                  {user.bills && user.bills.length > 0 ? `${user.bills.length} bills tracked` : 'Track your expenses'}
                </p>
              </CardContent>
            </Card>
          )}
          
          {onBudgetAlerts && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onBudgetAlerts}>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-medium">Budget Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  {user.budgetAlerts && user.budgetAlerts.length > 0 ? `${user.budgetAlerts.filter(a => !a.isRead).length} new alerts` : 'Manage spending'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Goals Overview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Your Goals</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onGoalsManagement}>
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onGoalsManagement}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeGoals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Goals Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first savings goal to get started!
                </p>
                <Button onClick={onGoalsManagement} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Goal
                </Button>
              </div>
            ) : (
              <>
                {(showAllGoals ? activeGoals : activeGoals.slice(0, 2)).map((goal, index) => {
                  const progress = calculateProgress(goal);
                  const isCompleted = progress >= 100;
                  
                  return (
                    <div key={goal.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-lg">{getCategoryEmoji(goal.category)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{goal.name}</h4>
                              {isCompleted && (
                                <Badge variant="default" className="bg-green-500 text-xs">
                                  Complete!
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{progress.toFixed(1)}%</div>
                          <Badge variant="outline" className="text-xs">
                            {goal.priority}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })}
                
                {activeGoals.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllGoals(!showAllGoals)}
                    className="w-full justify-center text-muted-foreground"
                  >
                    {showAllGoals ? 'Show Less' : `Show ${activeGoals.length - 2} More Goals`}
                    <ChevronRight className={`w-4 h-4 ml-2 transition-transform ${showAllGoals ? 'rotate-90' : ''}`} />
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Stokvel Section - Always show, with different content based on whether user has Stokvels */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t('dashboard.stokvels') || 'Stokvels'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onStokvels}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {userStokvels.length > 0 ? (
              <div className="space-y-3">
                {userStokvels.slice(0, 2).map((stokvel, index) => (
                  <div key={stokvel.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{stokvel.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {stokvel.members.length} members • {formatCurrency(stokvel.currentAmount)}
                      </p>
                    </div>
                    <Progress 
                      value={(stokvel.currentAmount / stokvel.goalAmount) * 100} 
                      className="w-20 h-2"
                    />
                  </div>
                ))}
                <Button variant="outline" onClick={onStokvels} className="w-full">
                  {t('dashboard.view_all_stokvels') || 'View All Stokvels'}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Stokvels Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('stokvel.groups') || 'Save together with family and friends'}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={onStokvels} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Stokvel
                  </Button>
                  <Button onClick={onStokvels} size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Join Stokvel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('dashboard.recent_activity') || 'Recent Activity'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        {transaction.type === 'deposit' 
                          ? <ArrowUpRight className="w-4 h-4 text-green-600" />
                          : <ArrowDownLeft className="w-4 h-4 text-red-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`font-medium ${
                      transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Coach Suggestion */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">KS</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">AI Coach Tip</h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Great job on your {user.gamificationStats.streak}-day streak! Keep it up to unlock more rewards.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={onAIChat} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
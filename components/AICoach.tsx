import { ArrowLeft, Bot, TrendingUp, Target, Calendar, Lightbulb, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface User {
  name?: string;
  totalSaved: number;
  goal: {
    name: string;
    amount: number;
    saved: number;
  };
  streak: number;
}

interface AICoachProps {
  user: User;
  onBack: () => void;
}

export const AICoach = ({ user, onBack }: AICoachProps) => {
  const progressPercentage = user.goal.amount > 0 ? (user.goal.saved / user.goal.amount) * 100 : 0;
  const remainingAmount = Math.max(0, user.goal.amount - user.goal.saved);
  const monthlyTarget = remainingAmount > 0 ? Math.ceil(remainingAmount / 6) : 0; // Assume 6 months to goal

  const getTips = () => {
    const tips = [];
    
    if (progressPercentage < 25) {
      tips.push({
        icon: Target,
        title: "Start Strong!",
        description: `You're ${progressPercentage.toFixed(1)}% towards your ${user.goal.name}. Consider setting up weekly deposits to build momentum.`,
        actionable: true
      });
    } else if (progressPercentage < 50) {
      tips.push({
        icon: TrendingUp,
        title: "Great Progress!",
        description: `You're doing well! Try to save R${monthlyTarget} per month to reach your goal faster.`,
        actionable: true
      });
    } else if (progressPercentage < 75) {
      tips.push({
        icon: Star,
        title: "You're on Fire!",
        description: `Amazing progress! You're more than halfway there. Keep up the consistency.`,
        actionable: false
      });
    } else {
      tips.push({
        icon: Star,
        title: "Almost There!",
        description: `Incredible! You're so close to reaching your ${user.goal.name}. Just R${remainingAmount} to go!`,
        actionable: false
      });
    }

    // Add streak-based tip
    if (user.streak >= 7) {
      tips.push({
        icon: Calendar,
        title: "Streak Master!",
        description: `${user.streak} days of consistent saving! This habit will help you reach all your financial goals.`,
        actionable: false
      });
    } else {
      tips.push({
        icon: Calendar,
        title: "Build Your Streak",
        description: "Try to save something every day, even if it's just R10. Small amounts add up quickly!",
        actionable: true
      });
    }

    // Add general savings tip
    tips.push({
      icon: Lightbulb,
      title: "Smart Saving Tip",
      description: "Round up your purchases and save the change. If you buy something for R47, save R3 to make it R50.",
      actionable: true
    });

    return tips;
  };

  const tips = getTips();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-medium">AI Savings Coach</h1>
              <p className="text-sm text-muted-foreground">Personalized advice just for you</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Welcome Message */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">
                Hi {user.name || 'there'}! 👋
              </h3>
              <p className="text-sm text-muted-foreground">
                I've analyzed your savings pattern and have some personalized tips to help you reach your goals faster.
              </p>
            </div>
          </div>
        </Card>

        {/* Goal Progress Overview */}
        <Card className="p-6 mb-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Your Goal Progress
          </h3>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">{user.goal.name}</span>
              <span className="text-sm font-medium">{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="mb-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">R {user.goal.saved.toLocaleString()}</span>
              <span className="text-muted-foreground">R {user.goal.amount.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <strong>Recommended monthly saving:</strong> R {monthlyTarget.toLocaleString()}
          </div>
        </Card>

        {/* AI Tips */}
        <div className="space-y-4">
          <h3 className="font-medium">Personalized Tips</h3>
          
          {tips.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tip.actionable ? 'bg-primary/20' : 'bg-secondary/50'
                  }`}>
                    <IconComponent className={`w-5 h-5 ${
                      tip.actionable ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Motivation Quote */}
        <Card className="p-6 mt-6 bg-muted/20">
          <div className="text-center">
            <p className="text-sm font-medium mb-2">💡 Daily Motivation</p>
            <p className="text-sm text-muted-foreground italic">
              "Every small amount you save today is an investment in your future freedom."
            </p>
          </div>
        </Card>

        {/* Action Button */}
        <div className="mt-6">
          <Button
            onClick={onBack}
            className="w-full h-12"
          >
            Start Saving Now
          </Button>
        </div>
      </div>
    </div>
  );
};
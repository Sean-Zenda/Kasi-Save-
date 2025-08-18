import { ArrowUpRight, ArrowDownLeft, Settings, Target, TrendingUp, MessageCircle, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface User {
  name?: string;
  phoneNumber: string;
  totalSaved: number;
  goal: {
    name: string;
    amount: number;
    saved: number;
  };
}

interface DashboardProps {
  user: User;
  onDeposit: () => void;
  onWithdraw: () => void;
  onSettings: () => void;
  onAIChat: () => void;
}

export const Dashboard = ({ user, onDeposit, onWithdraw, onSettings, onAIChat }: DashboardProps) => {
  const progressPercentage = user.goal.amount > 0 ? (user.goal.saved / user.goal.amount) * 100 : 0;
  const remainingAmount = Math.max(0, user.goal.amount - user.goal.saved);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-foreground">
              Hello, {user.name || 'Saver'}!
            </h1>
            <p className="text-muted-foreground">Ready to save today?</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettings}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </div>

        {/* Total Savings Card */}
        <Card className="bg-primary text-primary-foreground p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6" />
            <span className="text-sm opacity-90">Total Savings</span>
          </div>
          <div className="text-3xl font-medium">
            R {user.totalSaved.toLocaleString()}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 -mt-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={onDeposit}
            className="h-16 bg-secondary hover:bg-secondary/80 text-secondary-foreground flex flex-col gap-1"
          >
            <ArrowUpRight className="w-6 h-6" />
            <span>Deposit</span>
          </Button>
          <Button
            onClick={onWithdraw}
            variant="outline"
            className="h-16 flex flex-col gap-1"
          >
            <ArrowDownLeft className="w-6 h-6" />
            <span>Withdraw</span>
          </Button>
        </div>
      </div>

      {/* AI Chat Banner */}
      <div className="px-6 mb-6">
        <Card 
          className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 cursor-pointer hover:bg-primary/15 transition-colors"
          onClick={onAIChat}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Chat with AI Coach</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions about savings, get tips, or just chat!
              </p>
            </div>
            <Zap className="w-5 h-5 text-primary" />
          </div>
        </Card>
      </div>

      {/* Savings Goal */}
      {user.goal.name && (
        <div className="px-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-medium">{user.goal.name}</h3>
                <p className="text-sm text-muted-foreground">
                  R {user.goal.saved.toLocaleString()} of R {user.goal.amount.toLocaleString()}
                </p>
              </div>
            </div>
            
            <Progress value={progressPercentage} className="mb-4" />
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {progressPercentage.toFixed(1)}% complete
              </span>
              <span className="text-foreground font-medium">
                R {remainingAmount.toLocaleString()} remaining
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <div className="px-6">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <Card className="p-4">
          <div className="text-center text-muted-foreground py-8">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Your transactions will appear here</p>
            <p className="text-sm">Start by making your first deposit!</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
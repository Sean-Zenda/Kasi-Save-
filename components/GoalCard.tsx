import { Target } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface Goal {
  name: string;
  amount: number;
  saved: number;
}

interface GoalCardProps {
  goal: Goal;
  onClick?: () => void;
  className?: string;
}

export const GoalCard = ({ goal, onClick, className = '' }: GoalCardProps) => {
  const progressPercentage = goal.amount > 0 ? (goal.saved / goal.amount) * 100 : 0;
  const remainingAmount = Math.max(0, goal.amount - goal.saved);

  if (!goal.name) {
    return null;
  }

  return (
    <Card 
      className={`p-6 ${onClick ? 'cursor-pointer hover:bg-muted/20 transition-colors' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        <Target className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-lg font-medium">{goal.name}</h3>
          <p className="text-sm text-muted-foreground">
            R {goal.saved.toLocaleString()} of R {goal.amount.toLocaleString()}
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
  );
};
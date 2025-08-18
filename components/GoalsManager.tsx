import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Target, Calendar, DollarSign, Edit, Trash2, CheckCircle } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: 'emergency' | 'vacation' | 'car' | 'house' | 'education' | 'other';
  priority: 'high' | 'medium' | 'low';
  targetDate?: Date;
  createdAt: Date;
  completedAt?: Date;
  isActive: boolean;
  color: string;
}

const GOAL_CATEGORIES = [
  { value: 'emergency', label: 'Emergency Fund', icon: '🚨', color: 'bg-red-500' },
  { value: 'vacation', label: 'Vacation', icon: '✈️', color: 'bg-blue-500' },
  { value: 'car', label: 'Car', icon: '🚗', color: 'bg-green-500' },
  { value: 'house', label: 'House', icon: '🏠', color: 'bg-purple-500' },
  { value: 'education', label: 'Education', icon: '📚', color: 'bg-yellow-500' },
  { value: 'other', label: 'Other', icon: '🎯', color: 'bg-gray-500' }
];

const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
};

interface GoalsManagerProps {
  goals: SavingGoal[];
  onCreateGoal: (goal: Omit<SavingGoal, 'id' | 'createdAt' | 'currentAmount'>) => void;
  onUpdateGoal: (goalId: string, updates: Partial<SavingGoal>) => void;
  onDeleteGoal: (goalId: string) => void;
  onAllocateFunds: (goalId: string, amount: number) => void;
  totalAvailableFunds: number;
}

export const GoalsManager: React.FC<GoalsManagerProps> = ({
  goals,
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal,
  onAllocateFunds,
  totalAvailableFunds
}) => {
  const { t } = useLanguage();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingGoal | null>(null);
  const [allocationAmount, setAllocationAmount] = useState<string>('');
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    category: 'other' as SavingGoal['category'],
    priority: 'medium' as SavingGoal['priority'],
    targetDate: ''
  });

  const activeGoals = goals.filter(goal => goal.isActive);
  const completedGoals = goals.filter(goal => !goal.isActive && goal.completedAt);

  const handleCreateGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) return;

    const category = GOAL_CATEGORIES.find(cat => cat.value === newGoal.category);
    
    onCreateGoal({
      name: newGoal.name,
      targetAmount: parseInt(newGoal.targetAmount),
      category: newGoal.category,
      priority: newGoal.priority,
      targetDate: newGoal.targetDate ? new Date(newGoal.targetDate) : undefined,
      isActive: true,
      color: category?.color || 'bg-gray-500'
    });

    setNewGoal({
      name: '',
      targetAmount: '',
      category: 'other',
      priority: 'medium',
      targetDate: ''
    });
    setIsCreateDialogOpen(false);
  };

  const handleAllocateFunds = () => {
    if (!selectedGoal || !allocationAmount) return;

    const amount = parseInt(allocationAmount);
    if (amount > 0 && amount <= totalAvailableFunds) {
      onAllocateFunds(selectedGoal.id, amount);
      setAllocationAmount('');
      setSelectedGoal(null);
    }
  };

  const calculateProgress = (goal: SavingGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getCategoryInfo = (category: SavingGoal['category']) => {
    return GOAL_CATEGORIES.find(cat => cat.value === category) || GOAL_CATEGORIES[5];
  };

  const formatCurrency = (amount: number) => {
    return `R${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Savings Goals</h2>
          <p className="text-muted-foreground">
            {activeGoals.length} active goals • {formatCurrency(totalAvailableFunds)} available
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set up a new savings goal to help you reach your financial targets.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              
              <div>
                <Label htmlFor="target-amount">Target Amount (R)</Label>
                <Input
                  id="target-amount"
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  placeholder="5000"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newGoal.category}
                  onValueChange={(value) => setNewGoal({ ...newGoal, category: value as SavingGoal['category'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newGoal.priority}
                  onValueChange={(value) => setNewGoal({ ...newGoal, priority: value as SavingGoal['priority'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="target-date">Target Date (Optional)</Label>
                <Input
                  id="target-date"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateGoal} className="flex-1">
                  Create Goal
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Active Goals</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {activeGoals.map((goal) => {
              const progress = calculateProgress(goal);
              const categoryInfo = getCategoryInfo(goal.category);
              const isCompleted = progress >= 100;
              
              return (
                <Card key={goal.id} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${goal.color}`} />
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{categoryInfo.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{goal.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={PRIORITY_COLORS[goal.priority]}>
                              {goal.priority} priority
                            </Badge>
                            {isCompleted && (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed!
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDeleteGoal(goal.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-medium">
                          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div className="text-right text-xs text-muted-foreground mt-1">
                        {progress.toFixed(1)}% complete
                      </div>
                    </div>
                    
                    {goal.targetDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Target: {goal.targetDate.toLocaleDateString()}
                      </div>
                    )}
                    
                    {!isCompleted && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedGoal(goal)}
                        disabled={totalAvailableFunds <= 0}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Allocate Funds
                      </Button>
                    )}
                    
                    {isCompleted && (
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full bg-green-500 hover:bg-green-600"
                        onClick={() => onUpdateGoal(goal.id, { isActive: false, completedAt: new Date() })}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Complete
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Completed Goals</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {completedGoals.map((goal) => {
              const categoryInfo = getCategoryInfo(goal.category);
              
              return (
                <Card key={goal.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{goal.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(goal.targetAmount)}
                        </div>
                        {goal.completedAt && (
                          <div className="text-xs text-muted-foreground">
                            Completed {goal.completedAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <span className="text-lg">{categoryInfo.icon}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Fund Allocation Dialog */}
      <Dialog open={!!selectedGoal} onOpenChange={() => setSelectedGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allocate Funds to {selectedGoal?.name}</DialogTitle>
            <DialogDescription>
              Move money from your available funds to this specific goal.
            </DialogDescription>
          </DialogHeader>
          {selectedGoal && (
            <div className="space-y-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Current Progress</span>
                  <span className="font-medium">
                    {formatCurrency(selectedGoal.currentAmount)} / {formatCurrency(selectedGoal.targetAmount)}
                  </span>
                </div>
                <Progress value={calculateProgress(selectedGoal)} />
              </div>
              
              <div>
                <Label htmlFor="allocation-amount">Amount to Allocate (R)</Label>
                <Input
                  id="allocation-amount"
                  type="number"
                  value={allocationAmount}
                  onChange={(e) => setAllocationAmount(e.target.value)}
                  placeholder="0"
                  max={totalAvailableFunds}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Available: {formatCurrency(totalAvailableFunds)}
                </p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAllocateFunds} className="flex-1">
                  Allocate Funds
                </Button>
                <Button variant="outline" onClick={() => setSelectedGoal(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {activeGoals.length === 0 && completedGoals.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Goals Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first savings goal to start your journey!
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
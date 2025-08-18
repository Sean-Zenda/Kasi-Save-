import { useState } from 'react';
import { ArrowLeft, Plus, Target } from 'lucide-react';
import { Button } from '../components/ui/button';
import { GoalsManager, SavingGoal } from '../components/GoalsManager';
import { useLanguage } from '../components/LanguageContext';

interface GoalsManagementProps {
  goals: SavingGoal[];
  totalAvailableFunds: number;
  onBack: () => void;
  onCreateGoal: (goal: Omit<SavingGoal, 'id' | 'createdAt' | 'currentAmount'>) => void;
  onUpdateGoal: (goalId: string, updates: Partial<SavingGoal>) => void;
  onDeleteGoal: (goalId: string) => void;
  onAllocateFunds: (goalId: string, amount: number) => void;
}

export const GoalsManagement: React.FC<GoalsManagementProps> = ({
  goals,
  totalAvailableFunds,
  onBack,
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal,
  onAllocateFunds
}) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Manage Goals</h1>
            <p className="text-sm text-muted-foreground">
              Create and track multiple savings goals
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{goals.filter(g => g.isActive).length} Active</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <GoalsManager
          goals={goals}
          totalAvailableFunds={totalAvailableFunds}
          onCreateGoal={onCreateGoal}
          onUpdateGoal={onUpdateGoal}
          onDeleteGoal={onDeleteGoal}
          onAllocateFunds={onAllocateFunds}
        />
      </div>
    </div>
  );
};
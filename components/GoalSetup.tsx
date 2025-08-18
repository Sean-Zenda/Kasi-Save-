import { useState } from 'react';
import { ArrowLeft, Target, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { toast } from 'sonner';

interface GoalSetupProps {
  onComplete: (goalData: { name: string; amount: number; frequency: string }) => void;
  onBack: () => void;
}

export const GoalSetup = ({ onComplete, onBack }: GoalSetupProps) => {
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);

  const presetGoals = [
    { name: 'Emergency Fund', amount: 5000 },
    { name: 'New Phone', amount: 8000 },
    { name: 'Holiday Trip', amount: 12000 },
    { name: 'Car Deposit', amount: 25000 }
  ];

  const frequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const handlePresetSelect = (preset: { name: string; amount: number }) => {
    setGoalName(preset.name);
    setGoalAmount(preset.amount.toString());
  };

  const handleSubmit = async () => {
    if (!goalName.trim()) {
      toast.error('Please enter a goal name');
      return;
    }

    const amount = parseFloat(goalAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid goal amount');
      return;
    }

    if (amount < 100) {
      toast.error('Goal amount should be at least R100');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Savings goal created successfully!');
    onComplete({
      name: goalName,
      amount: amount,
      frequency: frequency
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-medium">Set Your Goal</h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-md mx-auto">
          {/* Goal Introduction */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-medium mb-2">What are you saving for?</h2>
            <p className="text-sm text-muted-foreground">
              Setting a goal helps you stay motivated and track your progress
            </p>
          </div>

          {/* Preset Goals */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Popular goals</h3>
            <div className="grid grid-cols-2 gap-3">
              {presetGoals.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  onClick={() => handlePresetSelect(preset)}
                  className="h-auto p-4 flex flex-col items-start text-left"
                >
                  <span className="font-medium text-sm">{preset.name}</span>
                  <span className="text-xs text-muted-foreground">
                    R {preset.amount.toLocaleString()}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Goal Form */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Goal Name
                </label>
                <Input
                  placeholder="What are you saving for?"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="h-12"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Amount (R)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  className="h-12"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Saving Frequency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {frequencies.map((freq) => (
                    <Button
                      key={freq.value}
                      variant={frequency === freq.value ? "default" : "outline"}
                      onClick={() => setFrequency(freq.value)}
                      className="h-10"
                      disabled={isLoading}
                    >
                      {freq.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              onClick={handleSubmit}
              disabled={!goalName.trim() || !goalAmount || isLoading}
              className="w-full h-12"
            >
              {isLoading ? 'Creating goal...' : 'Create Goal'}
            </Button>
          </div>

          {/* Skip Option */}
          <div className="text-center mt-4">
            <Button
              variant="ghost"
              onClick={() => onComplete({ name: 'General Savings', amount: 1000, frequency: 'monthly' })}
              className="text-muted-foreground"
              disabled={isLoading}
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
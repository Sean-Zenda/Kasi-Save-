import { useState } from 'react';
import { ArrowLeft, Target, ArrowRight, Calendar, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { InputField } from '../components/InputField';
import { toast } from 'sonner';

interface GoalSetupProps {
  onComplete: (goalData: { name: string; amount: number; frequency: string }) => void;
  onBack: () => void;
}

export const GoalSetup = ({ onComplete, onBack }: GoalSetupProps) => {
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [frequency, setFrequency] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const goalSuggestions = [
    { name: 'Emergency Fund', amount: '5000' },
    { name: 'New Phone', amount: '8000' },
    { name: 'Holiday Trip', amount: '15000' },
    { name: 'Car Deposit', amount: '25000' }
  ];

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

    if (!frequency) {
      toast.error('Please select how often you want to save');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(`Goal "${goalName}" created successfully!`);
    onComplete({
      name: goalName,
      amount,
      frequency
    });
  };

  const handleSuggestionClick = (suggestion: { name: string; amount: string }) => {
    setGoalName(suggestion.name);
    setGoalAmount(suggestion.amount);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-medium">Set your savings goal</h1>
          </div>
        </div>

        {/* Goal Setup Form */}
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-medium mb-2">What are you saving for?</h2>
            <p className="text-sm text-muted-foreground">
              Set a goal to stay motivated and track your progress
            </p>
          </div>

          <div className="space-y-4">
            <InputField
              label="Goal Name"
              placeholder="e.g., Emergency Fund, New Phone"
              value={goalName}
              onChange={setGoalName}
              disabled={isLoading}
              maxLength={50}
            />

            <div className="relative">
              <InputField
                label="Target Amount"
                type="number"
                placeholder="0"
                value={goalAmount}
                onChange={setGoalAmount}
                disabled={isLoading}
                className="pl-8"
              />
              <DollarSign className="absolute left-3 top-9 w-4 h-4 text-muted-foreground" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                How often will you save?
              </label>
              <Select value={frequency} onValueChange={setFrequency} disabled={isLoading}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="flexible">Flexible (as I can)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading || !goalName.trim() || !goalAmount || !frequency}
              className="w-full h-12"
            >
              {isLoading ? (
                'Creating your goal...'
              ) : (
                <>
                  Create Goal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Goal Suggestions */}
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-3 text-center">Popular goals:</p>
          <div className="grid grid-cols-2 gap-2">
            {goalSuggestions.map((suggestion) => (
              <Button
                key={suggestion.name}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className="text-xs h-auto p-3 flex flex-col items-start"
              >
                <span className="font-medium">{suggestion.name}</span>
                <span className="text-muted-foreground">R {suggestion.amount}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
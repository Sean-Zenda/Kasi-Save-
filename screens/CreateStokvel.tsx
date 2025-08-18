import { useState } from 'react';
import { ArrowLeft, Target, Share2, ArrowRight, Copy, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { InputField } from '../components/InputField';
import { toast } from 'sonner';

interface CreateStokveLProps {
  onBack: () => void;
  onComplete: (name: string, goalAmount: number) => string;
  onViewStokvel: () => void;
}

export const CreateStokvel = ({ onBack, onComplete, onViewStokvel }: CreateStokveLProps) => {
  const [stokveLName, setStokveLName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!stokveLName.trim()) {
      toast.error('Please enter a Stokvel name');
      return;
    }

    const amount = parseFloat(goalAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid goal amount');
      return;
    }

    if (amount < 1000) {
      toast.error('Minimum goal amount is R1,000');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const code = onComplete(stokveLName, amount);
    setInviteCode(code);
    setShowSuccess(true);
    setIsLoading(false);
    
    toast.success('Stokvel created successfully!');
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      toast.success('Invite code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy invite code');
    }
  };

  const handleShare = async () => {
    const shareText = `Join my Stokvel "${stokveLName}" on KasiSave! We're saving towards R${parseFloat(goalAmount).toLocaleString()}. Use invite code: ${inviteCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${stokveLName} Stokvel`,
          text: shareText
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success('Share text copied to clipboard!');
      } catch (err) {
        toast.error('Could not share invite');
      }
    }
  };

  const goalSuggestions = [
    { name: 'Family Holiday', amount: '25000' },
    { name: 'Emergency Fund', amount: '50000' },
    { name: 'School Fees', amount: '15000' },
    { name: 'Business Startup', amount: '75000' }
  ];

  const handleSuggestionClick = (suggestion: { name: string; amount: string }) => {
    setStokveLName(suggestion.name);
    setGoalAmount(suggestion.amount);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-medium">Stokvel Created!</h1>
          </div>
        </div>

        <div className="p-6">
          {/* Success Message */}
          <Card className="p-6 mb-6 bg-primary/10 border-primary/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-medium text-foreground mb-2">
                {stokveLName} Created Successfully!
              </h2>
              <p className="text-sm text-muted-foreground">
                Your Stokvel is ready. Share the invite code to get members to join.
              </p>
            </div>
          </Card>

          {/* Invite Code */}
          <Card className="p-6 mb-6">
            <h3 className="font-medium mb-4">Invite Code</h3>
            <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg mb-4">
              <div className="flex-1 font-mono text-2xl text-center tracking-widest">
                {inviteCode}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Share this code with family and friends so they can join your Stokvel.
            </p>

            <Button
              onClick={handleShare}
              className="w-full"
              variant="outline"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Invite
            </Button>
          </Card>

          {/* Group Details */}
          <Card className="p-6 mb-6">
            <h3 className="font-medium mb-4">Group Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Group Name:</span>
                <span className="font-medium">{stokveLName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target Amount:</span>
                <span className="font-medium">R {parseFloat(goalAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Members:</span>
                <span className="font-medium">1 (You)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Saved:</span>
                <span className="font-medium">R 0</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={onViewStokvel}
              className="w-full"
            >
              View Stokvel Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full"
            >
              Back to Stokvels
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-medium">Create Stokvel</h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Form */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Group Information</h3>
          
          <div className="space-y-4">
            <InputField
              label="Stokvel Name"
              placeholder="e.g., Family Holiday Fund"
              value={stokveLName}
              onChange={setStokveLName}
              disabled={isLoading}
              maxLength={50}
              helperText="Choose a name that reflects your savings goal"
            />

            <InputField
              label="Target Amount (R)"
              type="number"
              placeholder="25000"
              value={goalAmount}
              onChange={setGoalAmount}
              disabled={isLoading}
              helperText="How much does the group want to save in total?"
            />
          </div>
        </Card>

        {/* Goal Suggestions */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Popular Stokvel Ideas</h4>
          <div className="grid grid-cols-2 gap-2">
            {goalSuggestions.map((suggestion) => (
              <Button
                key={suggestion.name}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className="h-auto p-3 flex flex-col items-start text-left"
              >
                <span className="font-medium text-sm">{suggestion.name}</span>
                <span className="text-xs text-muted-foreground">
                  R {parseFloat(suggestion.amount).toLocaleString()}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <Card className="p-4 mb-6 bg-muted/20">
          <h4 className="font-medium mb-2">How it works:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>1. Create your Stokvel with a name and target amount</p>
            <p>2. Share the invite code with family and friends</p>
            <p>3. Members can contribute any amount, anytime</p>
            <p>4. Track everyone's progress together</p>
            <p>5. Celebrate when you reach your goal!</p>
          </div>
        </Card>

        {/* Create Button */}
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !stokveLName.trim() || !goalAmount}
          className="w-full h-12"
        >
          {isLoading ? (
            'Creating Stokvel...'
          ) : (
            <>
              Create Stokvel
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
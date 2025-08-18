import { useState } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { InputField } from '../components/InputField';
import { toast } from 'sonner';

interface ProposeWithdrawalProps {
  stokvelId: string;
  stokvelName: string;
  currentAmount: number;
  onBack: () => void;
  onPropose: (amount: number, reason: string) => string;
  onViewVoting: () => void;
}

export const ProposeWithdrawal = ({
  stokvelId,
  stokvelName,
  currentAmount,
  onBack,
  onPropose,
  onViewVoting
}: ProposeWithdrawalProps) => {
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const withdrawalAmount = parseFloat(amount);
    
    if (!withdrawalAmount || withdrawalAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (withdrawalAmount > currentAmount) {
      toast.error('Withdrawal amount cannot exceed available funds');
      return;
    }

    if (!reason.trim()) {
      toast.error('Please provide a reason for the withdrawal');
      return;
    }

    if (reason.trim().length < 10) {
      toast.error('Please provide a more detailed reason (at least 10 characters)');
      return;
    }

    setIsSubmitting(true);
    try {
      const proposalId = onPropose(withdrawalAmount, reason.trim());
      toast.success('Withdrawal proposal submitted! Other members will now vote.');
      onViewVoting();
    } catch (error) {
      toast.error('Failed to submit proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const amountValue = parseFloat(amount) || 0;
  const percentageOfTotal = currentAmount > 0 ? (amountValue / currentAmount) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-medium">Propose Withdrawal</h1>
            <p className="text-sm text-muted-foreground">{stokvelName}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Available Funds */}
        <Card className="p-4 bg-primary/10 border-primary/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Available Funds</p>
            <p className="text-2xl font-medium text-primary">
              R {currentAmount.toLocaleString()}
            </p>
          </div>
        </Card>

        {/* Important Notice */}
        <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                Voting Required
              </p>
              <p className="text-amber-700 dark:text-amber-300">
                All withdrawal proposals require a majority vote from group members. 
                The voting period lasts 7 days from submission.
              </p>
            </div>
          </div>
        </Card>

        {/* Withdrawal Amount */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Withdrawal Amount (R)
            </label>
            <InputField
              type="number"
              value={amount}
              onChange={setAmount}
              placeholder="0"
              min="0"
              max={currentAmount.toString()}
              step="1"
            />
            {amountValue > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {percentageOfTotal.toFixed(1)}% of total funds
              </p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Reason for Withdrawal
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a detailed explanation for why this withdrawal is needed..."
              className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">
                Minimum 10 characters required
              </p>
              <p className="text-xs text-muted-foreground">
                {reason.length}/500
              </p>
            </div>
          </div>
        </div>

        {/* Validation Warnings */}
        {amountValue > currentAmount && (
          <Card className="p-3 bg-destructive/10 border-destructive/20">
            <p className="text-sm text-destructive">
              ⚠️ Amount exceeds available funds
            </p>
          </Card>
        )}

        {reason.length > 0 && reason.length < 10 && (
          <Card className="p-3 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              ⚠️ Please provide more details about the withdrawal reason
            </p>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={
            !amount || 
            !reason.trim() || 
            reason.trim().length < 10 || 
            amountValue <= 0 || 
            amountValue > currentAmount ||
            isSubmitting
          }
          className="w-full h-12"
        >
          {isSubmitting ? 'Submitting Proposal...' : 'Submit Proposal for Voting'}
        </Button>

        {/* Help Text */}
        <Card className="p-4 bg-muted/20">
          <h3 className="font-medium mb-2">How Voting Works</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• All group members will be notified of your proposal</p>
            <p>• Members have 7 days to vote approve or reject</p>
            <p>• A majority (&gt;50%) approval is required</p>
            <p>• You cannot vote on your own proposal (auto-approved)</p>
            <p>• If approved, funds will be available for withdrawal</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
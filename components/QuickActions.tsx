import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Wallet, Smartphone, CreditCard, Banknote } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { toast } from 'sonner';

interface QuickActionsProps {
  action: 'deposit' | 'withdraw';
  selectedMethod?: string;
  onBack: () => void;
  onComplete: (amount: number) => void;
}

export const QuickActions = ({ action, selectedMethod, onBack, onComplete }: QuickActionsProps) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const presetAmounts = [50, 100, 200, 500];

  const getMethodInfo = (method?: string) => {
    switch (method) {
      case 'ewallet':
        return { name: 'eWallet', icon: Wallet, description: 'FNB eWallet transfer' };
      case 'mtn-money':
        return { name: 'MTN Money', icon: Smartphone, description: 'MTN Money transfer' };
      case 'bank-transfer':
        return { name: 'Bank Transfer', icon: CreditCard, description: 'Bank account transfer' };
      case 'cash-send':
        return { name: 'Cash Send', icon: Banknote, description: 'FNB Cash Send' };
      default:
        return { name: 'Bank Account', icon: CreditCard, description: 'Bank account transfer' };
    }
  };

  const methodInfo = getMethodInfo(selectedMethod);
  const MethodIcon = methodInfo.icon;

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
  };

  const handleSubmit = async () => {
    const numAmount = parseFloat(amount);
    
    if (!numAmount || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (action === 'withdraw' && numAmount > 1000) {
      toast.error('Withdrawal limit is R1000 per transaction');
      return;
    }

    if (action === 'deposit' && numAmount < 10) {
      toast.error('Minimum deposit amount is R10');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing with different times for different methods
    const processingTime = selectedMethod === 'ewallet' || selectedMethod === 'mtn-money' ? 2000 : 3000;
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    const methodName = selectedMethod === 'ewallet' ? 'eWallet' : 
                      selectedMethod === 'mtn-money' ? 'MTN Money' : 
                      methodInfo.name;
    
    onComplete(numAmount);
    toast.success(
      `${action === 'deposit' ? 'Deposit' : 'Withdrawal'} successful via ${methodName}!`
    );
  };

  const getProcessingMessage = () => {
    if (action === 'withdraw') return 'Processing withdrawal...';
    
    switch (selectedMethod) {
      case 'ewallet':
        return 'Processing eWallet transfer...';
      case 'mtn-money':
        return 'Processing MTN Money transfer...';
      default:
        return 'Processing deposit...';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            {action === 'deposit' ? (
              <ArrowUpRight className="w-6 h-6 text-primary" />
            ) : (
              <ArrowDownLeft className="w-6 h-6 text-primary" />
            )}
            <h1 className="text-xl font-medium">
              {action === 'deposit' ? 'Deposit Money' : 'Withdraw Money'}
            </h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Payment Method Display */}
        {action === 'deposit' && selectedMethod && (
          <Card className="p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MethodIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{methodInfo.name}</p>
                <p className="text-sm text-muted-foreground">{methodInfo.description}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Amount Input */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Enter Amount</h3>
          
          <div className="mb-4">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl h-14 text-center"
            />
          </div>

          {/* Preset Amounts */}
          <div className="grid grid-cols-2 gap-2">
            {presetAmounts.map((presetAmount) => (
              <Button
                key={presetAmount}
                variant="outline"
                onClick={() => handleAmountSelect(presetAmount)}
                className="h-12"
              >
                R {presetAmount}
              </Button>
            ))}
          </div>
        </Card>

        {/* Method-specific Instructions */}
        {action === 'deposit' && selectedMethod && (
          <Card className="p-4 mb-6 bg-muted/20">
            <h4 className="font-medium mb-2">How it works:</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              {selectedMethod === 'ewallet' && (
                <>
                  <p>1. You'll receive an eWallet PIN via SMS</p>
                  <p>2. Withdraw the money at any ATM</p>
                  <p>3. Money is added to your KasiSave account instantly</p>
                </>
              )}
              {selectedMethod === 'mtn-money' && (
                <>
                  <p>1. Send money using MTN Money</p>
                  <p>2. Use reference number: KS{Math.random().toString().substr(2, 6)}</p>
                  <p>3. Money reflects in your account within minutes</p>
                </>
              )}
              {selectedMethod === 'bank-transfer' && (
                <>
                  <p>1. Transfer from your bank account</p>
                  <p>2. Use your phone number as reference</p>
                  <p>3. May take 1-2 business days to reflect</p>
                </>
              )}
              {selectedMethod === 'cash-send' && (
                <>
                  <p>1. Collect cash using FNB Cash Send</p>
                  <p>2. You'll receive a secret code via SMS</p>
                  <p>3. Withdraw at any FNB ATM</p>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Action Button */}
        <Button
          onClick={handleSubmit}
          disabled={!amount || isProcessing}
          className="w-full h-14 text-lg"
        >
          {isProcessing ? (
            getProcessingMessage()
          ) : (
            `${action === 'deposit' ? 'Deposit' : 'Withdraw'} R ${amount || '0'}`
          )}
        </Button>

        {/* Limits Info */}
        <div className="text-center text-sm text-muted-foreground mt-4">
          {action === 'withdraw' && (
            <p>Daily withdrawal limit: R1000</p>
          )}
          {action === 'deposit' && (
            <p>Minimum deposit: R10 • Maximum deposit: R5000</p>
          )}
        </div>
      </div>
    </div>
  );
};
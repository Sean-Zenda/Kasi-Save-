import { useState } from 'react';
import { ArrowLeft, Building, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { InputField } from '../components/InputField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

interface BankWithdrawalProps {
  amount: number;
  onBack: () => void;
  onComplete: () => void;
}

export const BankWithdrawal = ({ amount, onBack, onComplete }: BankWithdrawalProps) => {
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const banks = [
    'Standard Bank',
    'FNB',
    'ABSA',
    'Nedbank',
    'Capitec Bank',
    'African Bank',
    'Discovery Bank',
    'TymeBank',
    'Bidvest Bank',
    'Investec'
  ];

  const accountTypes = [
    'Savings',
    'Cheque',
    'Current'
  ];

  const handleSubmit = async () => {
    if (!selectedBank || !accountNumber || !accountType || !accountHolder) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (accountNumber.length < 8 || accountNumber.length > 11) {
      toast.error('Please enter a valid account number');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast.success('Withdrawal request submitted successfully!');
    onComplete();
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
            <Building className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-medium">Bank Account Withdrawal</h1>
              <p className="text-sm text-muted-foreground">Withdraw R{amount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Amount Summary */}
        <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Withdrawal Amount</p>
              <p className="text-2xl font-medium text-primary">R{amount.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Processing Time</p>
              <p className="font-medium">1-2 Business Days</p>
            </div>
          </div>
        </Card>

        {/* Bank Details Form */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Bank Account Details</h3>
          
          <div className="space-y-4">
            {/* Bank Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Bank</label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account Number */}
            <InputField
              label="Account Number"
              type="number"
              placeholder="Enter your account number"
              value={accountNumber}
              onChange={setAccountNumber}
            />

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Account Type</label>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account Holder Name */}
            <InputField
              label="Account Holder Name"
              type="text"
              placeholder="Enter account holder's name"
              value={accountHolder}
              onChange={setAccountHolder}
            />
          </div>
        </Card>

        {/* Processing Info */}
        <Card className="p-4 mb-6 bg-muted/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium mb-2">Processing Information</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Bank transfers are processed within 1-2 business days</p>
                <p>• No fees charged for bank account withdrawals</p>
                <p>• You'll receive an SMS confirmation once processed</p>
                <p>• Funds will reflect in your account during banking hours</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Notice */}
        <Card className="p-4 mb-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/30">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">Secure Transfer</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your bank details are encrypted and processed securely through our banking partners.
              </p>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!selectedBank || !accountNumber || !accountType || !accountHolder || isProcessing}
          className="w-full h-14 text-lg"
        >
          {isProcessing ? (
            'Processing Withdrawal...'
          ) : (
            `Withdraw R${amount.toFixed(2)} to Bank Account`
          )}
        </Button>

        {/* Terms */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          By proceeding, you agree to our withdrawal terms and confirm that the bank account belongs to you.
        </p>
      </div>
    </div>
  );
};
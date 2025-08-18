import { useState } from 'react';
import { ArrowLeft, Wallet, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { InputField } from '../components/InputField';
import { toast } from 'sonner';

interface EWalletDepositProps {
  amount: number;
  onBack: () => void;
  onComplete: () => void;
}

export const EWalletDeposit = ({ amount, onBack, onComplete }: EWalletDepositProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [eWalletPin, setEWalletPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleSubmit = async () => {
    if (!phoneNumber) {
      toast.error('Please enter the phone number that received the eWallet');
      return;
    }

    if (!eWalletPin) {
      toast.error('Please enter your eWallet PIN');
      return;
    }

    if (eWalletPin.length < 4) {
      toast.error('eWallet PIN must be at least 4 digits');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onComplete();
    toast.success('eWallet deposit successful!');
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as +27 XX XXX XXXX
    if (cleaned.length >= 10) {
      if (cleaned.startsWith('27')) {
        return `+27 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 11)}`;
      } else if (cleaned.startsWith('0')) {
        return `+27 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
      }
    }
    return cleaned;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
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
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-medium">eWallet Deposit</h1>
              <p className="text-sm text-muted-foreground">R {amount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Amount Summary */}
        <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Deposit Amount</p>
            <p className="text-2xl font-medium text-primary">R {amount.toLocaleString()}</p>
          </div>
        </Card>

        {/* Form */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">eWallet Details</h3>
          
          <div className="space-y-4">
            <div>
              <InputField
                label="Phone number that received the eWallet"
                type="tel"
                placeholder="+27 XX XXX XXXX"
                value={phoneNumber}
                onChange={handlePhoneChange}
                maxLength={17}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the phone number where you received the eWallet SMS
              </p>
            </div>

            <div className="relative">
              <InputField
                label="eWallet PIN"
                type={showPin ? "text" : "password"}
                placeholder="Enter your eWallet PIN"
                value={eWalletPin}
                onChange={setEWalletPin}
                maxLength={8}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-8 h-8 w-8 p-0"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                The PIN you received in the eWallet SMS
              </p>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-4 mb-6 bg-muted/20">
          <h4 className="font-medium mb-2">How it works:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>1. Enter the phone number that received the eWallet</p>
            <p>2. Enter the PIN from the eWallet SMS</p>
            <p>3. We'll process the deposit instantly</p>
            <p>4. Money is added to your KasiSave account</p>
          </div>
        </Card>

        {/* Process Button */}
        <Button
          onClick={handleSubmit}
          disabled={!phoneNumber || !eWalletPin || isProcessing}
          className="w-full h-14 text-lg"
        >
          {isProcessing ? (
            'Processing eWallet deposit...'
          ) : (
            `Deposit R ${amount.toLocaleString()}`
          )}
        </Button>

        {/* Security Info */}
        <div className="text-center text-xs text-muted-foreground mt-4">
          <p>🔒 Your eWallet details are encrypted and secure</p>
        </div>
      </div>
    </div>
  );
};
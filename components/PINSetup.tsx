import { useState } from 'react';
import { ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';

interface PINSetupProps {
  onComplete: (pin: string) => void;
  onBack: () => void;
}

export const PINSetup = ({ onComplete, onBack }: PINSetupProps) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePinInput = (digit: string) => {
    if (step === 'create') {
      if (pin.length < 4) {
        setPin(pin + digit);
      }
    } else {
      if (confirmPin.length < 4) {
        setConfirmPin(confirmPin + digit);
      }
    }
  };

  const handleDelete = () => {
    if (step === 'create') {
      setPin(pin.slice(0, -1));
    } else {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const handleContinue = () => {
    if (step === 'create') {
      if (pin.length !== 4) {
        toast.error('PIN must be 4 digits');
        return;
      }
      setStep('confirm');
    } else {
      if (confirmPin.length !== 4) {
        toast.error('Please confirm your PIN');
        return;
      }
      if (pin !== confirmPin) {
        toast.error('PINs do not match. Please try again.');
        setConfirmPin('');
        return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('PIN created successfully!');
    onComplete(pin);
  };

  const renderPinDisplay = (pinValue: string) => {
    return (
      <div className="flex justify-center gap-4 mb-8">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className="w-12 h-12 rounded-lg border-2 border-border flex items-center justify-center bg-input"
          >
            {pinValue[index] ? (
              showPin ? (
                <span className="text-xl font-medium">{pinValue[index]}</span>
              ) : (
                <div className="w-3 h-3 bg-foreground rounded-full" />
              )
            ) : null}
          </div>
        ))}
      </div>
    );
  };

  const renderNumberPad = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    
    return (
      <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            size="lg"
            onClick={() => handlePinInput(num.toString())}
            className="h-14 text-lg font-medium"
            disabled={isLoading}
          >
            {num}
          </Button>
        ))}
        
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setShowPin(!showPin)}
          className="h-14"
          disabled={isLoading}
        >
          {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => handlePinInput('0')}
          className="h-14 text-lg font-medium"
          disabled={isLoading}
        >
          0
        </Button>
        
        <Button
          variant="ghost"
          size="lg"
          onClick={handleDelete}
          className="h-14"
          disabled={isLoading}
        >
          ⌫
        </Button>
      </div>
    );
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
            <h1 className="text-xl font-medium">
              {step === 'create' ? 'Create PIN' : 'Confirm PIN'}
            </h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card className="p-6 max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-medium mb-2">
              {step === 'create' ? 'Create your 4-digit PIN' : 'Confirm your PIN'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {step === 'create' 
                ? 'This PIN will be used to secure your account'
                : 'Enter your PIN again to confirm'
              }
            </p>
          </div>

          {renderPinDisplay(step === 'create' ? pin : confirmPin)}
          {renderNumberPad()}

          <div className="mt-8">
            <Button
              onClick={handleContinue}
              disabled={
                isLoading || 
                (step === 'create' ? pin.length !== 4 : confirmPin.length !== 4)
              }
              className="w-full h-12"
            >
              {isLoading ? 'Creating PIN...' : 
               step === 'create' ? 'Continue' : 'Create PIN'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
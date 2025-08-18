import { useState } from 'react';
import { ArrowLeft, Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';

interface PINSetupProps {
  onComplete: (pin: string) => void;
  onBack: () => void;
}

export const PINSetup = ({ onComplete, onBack }: PINSetupProps) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePin = () => {
    if (pin.length !== 4) {
      toast.error('PIN must be 4 digits');
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      toast.error('PIN must contain only numbers');
      return;
    }

    setStep('confirm');
  };

  const handleConfirmPin = async () => {
    if (confirmPin !== pin) {
      toast.error('PINs do not match. Please try again.');
      setConfirmPin('');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('PIN created successfully!');
    onComplete(pin);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 'create') {
        handleCreatePin();
      } else {
        handleConfirmPin();
      }
    }
  };

  const handleBack = () => {
    if (step === 'confirm') {
      setStep('create');
      setConfirmPin('');
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-medium">
              {step === 'create' ? 'Create your PIN' : 'Confirm your PIN'}
            </h1>
          </div>
        </div>

        {/* PIN Setup Form */}
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-medium mb-2">
              {step === 'create' ? 'Secure your account' : 'Confirm your PIN'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {step === 'create' 
                ? 'Create a 4-digit PIN to protect your savings'
                : 'Enter your PIN again to confirm'
              }
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium mb-2">
                {step === 'create' ? 'Enter 4-digit PIN' : 'Confirm PIN'}
              </label>
              <Input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="••••"
                value={step === 'create' ? pin : confirmPin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  if (step === 'create') {
                    setPin(value);
                  } else {
                    setConfirmPin(value);
                  }
                }}
                onKeyPress={handleKeyPress}
                className="h-12 text-center text-2xl tracking-widest"
                disabled={isLoading}
                maxLength={4}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-8"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>

            <Button
              onClick={step === 'create' ? handleCreatePin : handleConfirmPin}
              disabled={
                isLoading || 
                (step === 'create' ? pin.length !== 4 : confirmPin.length !== 4)
              }
              className="w-full h-12"
            >
              {isLoading ? (
                'Setting up PIN...'
              ) : (
                <>
                  {step === 'create' ? 'Continue' : 'Complete Setup'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* PIN Requirements */}
          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <p className="text-sm font-medium mb-2">PIN Requirements:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Must be exactly 4 digits</li>
              <li>• Numbers only (0-9)</li>
              <li>• Avoid obvious patterns (1234, 1111)</li>
              <li>• Don't use your birth year or phone number</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};
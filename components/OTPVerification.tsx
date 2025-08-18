import { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Card } from './ui/card';
import { toast } from 'sonner';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerify: () => void;
  onBack: () => void;
}

export const OTPVerification = ({ phoneNumber, onVerify, onBack }: OTPVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    
    // Simulate API verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, accept any 6-digit code
    toast.success('Phone number verified successfully!');
    onVerify();
  };

  const handleResend = async () => {
    setCanResend(false);
    setCountdown(60);
    setOtp('');
    
    // Simulate resend API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('New verification code sent!');
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
            <h1 className="text-xl font-medium">Verify Phone Number</h1>
          </div>
        </div>

        {/* Verification Form */}
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-medium mb-2">Enter verification code</h2>
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit code to<br />
              <span className="font-medium text-foreground">{phoneNumber}</span>
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleVerify}
              disabled={otp.length !== 6 || isLoading}
              className="w-full h-12"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <div className="text-center">
              {canResend ? (
                <Button
                  variant="ghost"
                  onClick={handleResend}
                  className="text-primary"
                >
                  Resend code
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Resend code in {countdown}s
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Demo Helper */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Demo: Enter any 6-digit code to continue
          </p>
        </div>
      </div>
    </div>
  );
};
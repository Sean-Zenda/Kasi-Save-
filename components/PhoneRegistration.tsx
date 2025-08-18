import { useState } from 'react';
import { ArrowRight, Smartphone, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface PhoneRegistrationProps {
  onNext: (phoneNumber: string, isReturning?: boolean) => void;
  onReturningUser: (phoneNumber: string) => void;
}

export const PhoneRegistration = ({ onNext, onReturningUser }: PhoneRegistrationProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('new');

  const validatePhoneNumber = (phone: string) => {
    // Simple South African phone number validation
    const cleanPhone = phone.replace(/\s+/g, '');
    return /^(\+27|0)[0-9]{9}$/.test(cleanPhone);
  };

  const formatPhoneNumber = (phone: string) => {
    // Format to +27 format
    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.startsWith('0')) {
      return '+27' + cleanPhone.substring(1);
    }
    if (cleanPhone.startsWith('+27')) {
      return cleanPhone;
    }
    if (cleanPhone.length === 9) {
      return '+27' + cleanPhone;
    }
    return phone;
  };

  const handleSubmit = async (isReturning: boolean = false) => {
    if (!phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid South African phone number');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    if (isReturning) {
      onReturningUser(formattedPhone);
    } else {
      onNext(formattedPhone, isReturning);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(activeTab === 'returning');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-medium text-foreground mb-2">
            Welcome to KasiSave
          </h1>
          <p className="text-muted-foreground">
            Start your savings journey today
          </p>
        </div>

        {/* Registration Form */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="new" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                New User
              </TabsTrigger>
              <TabsTrigger value="returning" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Returning
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="new" className="space-y-4">
              <div className="mb-4">
                <h2 className="text-lg font-medium mb-2">Create your account</h2>
                <p className="text-sm text-muted-foreground">
                  We'll send you a verification code to get started
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="081 234 5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format: 081 234 5678 or +27 81 234 5678
                </p>
              </div>

              <Button
                onClick={() => handleSubmit(false)}
                disabled={isLoading || !phoneNumber.trim()}
                className="w-full h-12"
              >
                {isLoading ? (
                  'Creating account...'
                ) : (
                  <>
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="returning" className="space-y-4">
              <div className="mb-4">
                <h2 className="text-lg font-medium mb-2">Welcome back!</h2>
                <p className="text-sm text-muted-foreground">
                  Enter your phone number to continue saving
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="081 234 5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll verify it's really you
                </p>
              </div>

              <Button
                onClick={() => handleSubmit(true)}
                disabled={isLoading || !phoneNumber.trim()}
                className="w-full h-12"
              >
                {isLoading ? (
                  'Signing in...'
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};
import { useState } from 'react';
import { ArrowLeft, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { InputField } from '../components/InputField';
import { toast } from 'sonner';

interface NameEntryProps {
  onComplete: (name: string) => void;
  onBack: () => void;
}

export const NameEntry = ({ onComplete, onBack }: NameEntryProps) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      toast.error('Please enter your name');
      return;
    }

    if (trimmedName.length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    if (trimmedName.length > 50) {
      toast.error('Name must be less than 50 characters');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Welcome, ${trimmedName}!`);
    onComplete(trimmedName);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
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
            <h1 className="text-xl font-medium">What's your name?</h1>
          </div>
        </div>

        {/* Name Entry Form */}
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-medium mb-2">Tell us your name</h2>
            <p className="text-sm text-muted-foreground">
              We'll use this to personalize your savings experience
            </p>
          </div>

          <div className="space-y-4">
            <InputField
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChange={setName}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              maxLength={50}
              helperText="This will appear on your dashboard and in the app"
            />

            <Button
              onClick={handleSubmit}
              disabled={!name.trim() || isLoading}
              className="w-full h-12"
            >
              {isLoading ? (
                'Setting up your profile...'
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Name suggestions for demo */}
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-3 text-center">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Sipho Mthembu', 'Nomsa Dlamini', 'Thabo Molefe', 'Zanele Nkomo'].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setName(suggestion)}
                disabled={isLoading}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
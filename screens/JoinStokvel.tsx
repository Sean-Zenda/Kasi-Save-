import { useState } from 'react';
import { ArrowLeft, UserPlus, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

interface JoinStokveLProps {
  onBack: () => void;
  onJoin: (inviteCode: string) => boolean;
  onSuccess: () => void;
}

export const JoinStokvel = ({ onBack, onJoin, onSuccess }: JoinStokveLProps) => {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!inviteCode.trim()) {
      toast.error('Please enter an invite code');
      return;
    }

    if (inviteCode.length < 6) {
      toast.error('Invite code must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = onJoin(inviteCode.trim());
    
    if (success) {
      toast.success('Successfully joined Stokvel!');
      onSuccess();
    } else {
      if (inviteCode.toUpperCase() === 'HOLIDAY2024' || inviteCode.toUpperCase() === 'EMERGENCY123') {
        toast.error('You are already a member of this Stokvel');
      } else {
        toast.error('Invalid invite code. Please check and try again.');
      }
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const demoInviteCodes = [
    { code: 'HOLIDAY2024', name: 'Family Holiday Fund' },
    { code: 'EMERGENCY123', name: 'Emergency Fund Group' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-medium">Join Stokvel</h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Instructions */}
        <Card className="p-6 mb-6 bg-primary/10 border-primary/20">
          <h3 className="font-medium text-foreground mb-2">Join an Existing Group</h3>
          <p className="text-sm text-muted-foreground">
            Enter the invite code shared by the group creator to join their Stokvel. 
            You'll be able to contribute to their savings goal and track progress together.
          </p>
        </Card>

        {/* Form */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label className="block font-medium mb-2">
                Invite Code
              </Label>
              <Input
                type="text"
                placeholder="Enter invite code (e.g., HOLIDAY2024)"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="h-12 text-center text-lg tracking-wider"
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Ask the group creator to share their invite code with you
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading || !inviteCode.trim()}
              className="w-full h-12"
            >
              {isLoading ? (
                'Joining Stokvel...'
              ) : (
                <>
                  Join Stokvel
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Demo Codes */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Demo Invite Codes</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Try these demo codes to see how Stokvels work:
          </p>
          <div className="space-y-2">
            {demoInviteCodes.map((demo) => (
              <Button
                key={demo.code}
                variant="outline"
                size="sm"
                onClick={() => setInviteCode(demo.code)}
                disabled={isLoading}
                className="w-full justify-between h-auto p-3"
              >
                <div className="text-left">
                  <div className="font-mono font-medium">{demo.code}</div>
                  <div className="text-xs text-muted-foreground">{demo.name}</div>
                </div>
                <div className="text-xs text-muted-foreground">Tap to use</div>
              </Button>
            ))}
          </div>
        </div>

        {/* How to get invite codes */}
        <Card className="p-4 bg-muted/20">
          <h4 className="font-medium mb-2">How to get an invite code:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Ask family or friends who created a Stokvel</p>
            <p>• Check WhatsApp or SMS messages for shared codes</p>
            <p>• Codes are usually 6-12 characters long</p>
            <p>• Each Stokvel has a unique invite code</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
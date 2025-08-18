import { ArrowLeft, Users, Plus, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

interface StokveLandingProps {
  onBack: () => void;
  onCreateStokvel: () => void;
  onJoinStokvel: () => void;
  existingStokvels: any[];
  onViewStokvel: (stokvel: any) => void;
}

export const StokveLanding = ({ 
  onBack, 
  onCreateStokvel, 
  onJoinStokvel, 
  existingStokvels,
  onViewStokvel 
}: StokveLandingProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-medium">Stokvel Groups</h1>
              <p className="text-sm text-muted-foreground">Save together, achieve more</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* What is a Stokvel Info */}
        <Card className="p-6 mb-6 bg-primary/10 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">What is a Stokvel?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                A Stokvel is a group savings scheme where members contribute money regularly 
                towards a common goal. It's a traditional South African way to save together 
                and support each other financially.
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Pool money with family and friends</p>
                <p>• Track everyone's contributions</p>
                <p>• Achieve bigger goals together</p>
                <p>• Build a savings culture</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Your Stokvels */}
        {existingStokvels.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Your Stokvel Groups</h3>
            <div className="space-y-3">
              {existingStokvels.map((stokvel) => {
                // Use correct property names and add safety checks
                const totalSaved = stokvel.currentAmount || 0;
                const goalAmount = stokvel.goalAmount || 0;
                const membersCount = stokvel.members?.length || 0;
                
                const progressPercentage = goalAmount > 0 
                  ? (totalSaved / goalAmount) * 100 
                  : 0;

                return (
                  <Card 
                    key={stokvel.id}
                    className="p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                    onClick={() => onViewStokvel(stokvel)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">{stokvel.name || 'Unnamed Stokvel'}</h4>
                        <p className="text-sm text-muted-foreground">
                          {membersCount} members • R {totalSaved.toLocaleString()} saved
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {progressPercentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          R {goalAmount.toLocaleString()} goal
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Get Started</h3>
          
          <Card 
            className="p-6 cursor-pointer hover:bg-muted/20 transition-colors border-primary/20"
            onClick={onCreateStokvel}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Create a Stokvel</h4>
                <p className="text-sm text-muted-foreground">
                  Start a new savings group and invite others to join
                </p>
              </div>
              <div className="w-6 h-6 border border-border rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full opacity-0" />
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:bg-muted/20 transition-colors"
            onClick={onJoinStokvel}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Join a Stokvel</h4>
                <p className="text-sm text-muted-foreground">
                  Enter an invite code to join an existing group
                </p>
              </div>
              <div className="w-6 h-6 border border-border rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full opacity-0" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tips */}
        <Card className="p-4 mt-8 bg-muted/20">
          <h4 className="font-medium mb-2">💡 Tips for Success</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Start with people you trust - family and close friends</p>
            <p>• Set realistic monthly contribution amounts</p>
            <p>• Choose clear, achievable goals</p>
            <p>• Regular communication keeps everyone motivated</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
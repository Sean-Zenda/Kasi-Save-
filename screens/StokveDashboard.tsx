import { ArrowLeft, Users, Target, TrendingUp, Plus, Share2, Copy, Vote, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { toast } from 'sonner';

interface StokveMember {
  id: string;
  name: string;
  phoneNumber: string;
  contribution: number;
  joinedDate: Date;
}

interface WithdrawalProposal {
  id: string;
  amount: number;
  reason: string;
  proposedBy: string;
  proposedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  votes: {
    memberPhone: string;
    vote: 'approve' | 'reject';
    votedAt: Date;
  }[];
  expiresAt: Date;
}

interface Stokvel {
  id: string;
  name: string;
  goalAmount: number;
  inviteCode: string;
  members: StokveMember[];
  totalSaved: number;
  createdBy: string;
  createdDate: Date;
  withdrawalProposals?: WithdrawalProposal[];
}

interface StokveDashboardProps {
  stokvel: Stokvel;
  currentUserPhone: string;
  onBack: () => void;
  onContribute: () => void;
  onInviteMembers: () => void;
  onViewVoting?: () => void;
}

export const StokveDashboard = ({ 
  stokvel, 
  currentUserPhone, 
  onBack, 
  onContribute,
  onInviteMembers,
  onViewVoting
}: StokveDashboardProps) => {
  const progressPercentage = stokvel.goalAmount > 0 ? (stokvel.totalSaved / stokvel.goalAmount) * 100 : 0;
  const remainingAmount = Math.max(0, stokvel.goalAmount - stokvel.totalSaved);
  const isCreator = stokvel.createdBy === currentUserPhone;
  const currentUserMember = stokvel.members.find(member => member.phoneNumber === currentUserPhone);
  
  // Get active proposals and pending votes
  const activeProposals = stokvel.withdrawalProposals?.filter(p => 
    p.status === 'pending' && p.expiresAt > new Date()
  ) || [];
  
  const pendingVotes = activeProposals.filter(p => 
    !p.votes.some(v => v.memberPhone === currentUserPhone) && 
    p.proposedBy !== currentUserPhone
  ).length;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCopyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(stokvel.inviteCode);
      toast.success('Invite code copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy invite code');
    }
  };

  const handleShareStokvel = async () => {
    const shareText = `Join my Stokvel "${stokvel.name}" on KasiSave! We're saving towards R${stokvel.goalAmount.toLocaleString()}. Use invite code: ${stokvel.inviteCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${stokvel.name} Stokvel`,
          text: shareText
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success('Share text copied to clipboard!');
      } catch (err) {
        toast.error('Could not share invite');
      }
    }
  };

  // Sort members by contribution (highest first), but put current user first if they're the creator
  const sortedMembers = [...stokvel.members].sort((a, b) => {
    if (isCreator && a.phoneNumber === currentUserPhone) return -1;
    if (isCreator && b.phoneNumber === currentUserPhone) return 1;
    return b.contribution - a.contribution;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-medium">{stokvel.name}</h1>
            <p className="text-sm text-muted-foreground">
              Created {stokvel.createdDate.toLocaleDateString()}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onInviteMembers}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Progress Overview */}
        <Card className="p-6 mb-6 bg-primary/10 border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-lg font-medium text-foreground">Group Progress</h3>
              <p className="text-sm text-muted-foreground">
                R {stokvel.totalSaved.toLocaleString()} of R {stokvel.goalAmount.toLocaleString()}
              </p>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="mb-4 h-3" />
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{stokvel.members.length} members</span>
            </div>
            <div className="text-right">
              <span className="font-medium text-foreground">
                {progressPercentage.toFixed(1)}% complete
              </span>
              <p className="text-xs text-muted-foreground">
                R {remainingAmount.toLocaleString()} remaining
              </p>
            </div>
          </div>
        </Card>

        {/* Pending Votes Alert */}
        {pendingVotes > 0 && (
          <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div className="flex-1">
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Pending Votes Required
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {pendingVotes} withdrawal proposal{pendingVotes > 1 ? 's' : ''} need{pendingVotes === 1 ? 's' : ''} your vote
                </p>
              </div>
              {onViewVoting && (
                <Button 
                  size="sm" 
                  onClick={onViewVoting}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  View Voting
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Button
            onClick={onContribute}
            className="h-16 flex flex-col gap-1"
          >
            <Plus className="w-5 h-5" />
            <span>Contribute</span>
          </Button>
          <Button
            onClick={handleShareStokvel}
            variant="outline"
            className="h-16 flex flex-col gap-1"
          >
            <Share2 className="w-5 h-5" />
            <span>Invite</span>
          </Button>
          {onViewVoting && (
            <Button
              onClick={onViewVoting}
              variant="outline"
              className="h-16 flex flex-col gap-1 relative"
            >
              <Vote className="w-5 h-5" />
              <span>Voting</span>
              {pendingVotes > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white rounded-full text-xs flex items-center justify-center">
                  {pendingVotes}
                </div>
              )}
            </Button>
          )}
        </div>

        {/* Your Contribution */}
        {currentUserMember && (
          <Card className="p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Your Contribution</h4>
                <p className="text-sm text-muted-foreground">
                  Joined {currentUserMember.joinedDate.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-medium text-primary">
                  R {currentUserMember.contribution.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stokvel.totalSaved > 0 
                    ? `${((currentUserMember.contribution / stokvel.totalSaved) * 100).toFixed(1)}% of total`
                    : '0% of total'
                  }
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Members List */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Members ({stokvel.members.length})</h3>
            <Button variant="ghost" size="sm" onClick={handleCopyInviteCode}>
              <Copy className="w-4 h-4 mr-2" />
              {stokvel.inviteCode}
            </Button>
          </div>
          
          <div className="space-y-3">
            {sortedMembers.map((member, index) => {
              const isCurrentUser = member.phoneNumber === currentUserPhone;
              const contributionPercentage = stokvel.totalSaved > 0 
                ? (member.contribution / stokvel.totalSaved) * 100 
                : 0;

              return (
                <div key={`${member.id}-${index}`} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/20 text-primary font-medium">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    {index === 0 && stokvel.totalSaved > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">
                        {member.name}
                        {isCurrentUser && ' (You)'}
                      </p>
                      {member.phoneNumber === stokvel.createdBy && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          Creator
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Joined {member.joinedDate.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">
                      R {member.contribution.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {contributionPercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Group Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 text-center">
            <p className="text-2xl font-medium text-primary">
              R {Math.round(stokvel.totalSaved / stokvel.members.length).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Average per member</p>
          </Card>
          
          <Card className="p-4 text-center">
            <p className="text-2xl font-medium text-primary">
              {Math.ceil((stokvel.goalAmount - stokvel.totalSaved) / stokvel.members.length).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Each needs to save</p>
          </Card>
        </div>

        {/* Motivation Message */}
        {progressPercentage < 100 && (
          <Card className="p-4 bg-muted/20">
            <p className="text-sm text-center text-muted-foreground">
              {progressPercentage < 25 
                ? "🌱 Every journey starts with a single step. Keep contributing!"
                : progressPercentage < 50
                ? "🚀 Great progress! You're building momentum together."
                : progressPercentage < 75
                ? "💪 More than halfway there! The finish line is in sight."
                : "🎯 Almost there! Just a little more to reach your goal!"
              }
            </p>
          </Card>
        )}

        {progressPercentage >= 100 && (
          <Card className="p-6 bg-primary/10 border-primary/20">
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">
                🎉 Goal Achieved!
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Congratulations! Your Stokvel has reached its savings goal. 
                Time to celebrate your collective achievement!
              </p>
              {onViewVoting && (
                <Button onClick={onViewVoting} size="sm">
                  Propose Withdrawal
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Recent Voting Activity */}
        {(stokvel.withdrawalProposals?.length || 0) > 0 && (
          <Card className="p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Recent Voting Activity</h3>
              {onViewVoting && (
                <Button variant="ghost" size="sm" onClick={onViewVoting}>
                  View All
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {stokvel.withdrawalProposals?.slice(0, 2).map((proposal) => {
                const memberName = stokvel.members.find(m => m.phoneNumber === proposal.proposedBy)?.name || 'Unknown';
                const approveVotes = proposal.votes.filter(v => v.vote === 'approve').length;
                const totalVotes = proposal.votes.length;
                
                return (
                  <div key={proposal.id} className="flex items-center justify-between p-2 rounded bg-muted/20">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        R {proposal.amount.toLocaleString()} withdrawal
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {memberName} • {approveVotes}/{stokvel.members.length} approved
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {proposal.status === 'pending' ? (
                        <span className="text-amber-600">Voting</span>
                      ) : proposal.status === 'approved' ? (
                        <span className="text-green-600">✓ Approved</span>
                      ) : (
                        <span className="text-red-600">✗ Rejected</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
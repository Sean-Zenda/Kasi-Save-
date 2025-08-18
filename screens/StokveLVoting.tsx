import { useState, useMemo } from 'react';
import { ArrowLeft, Clock, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { WithdrawalProposal } from '../navigation/AppNavigator';

interface Member {
  phone: string;
  name: string;
}

interface StokveLVotingProps {
  stokvelId: string;
  stokvelName: string;
  members: Member[];
  proposals: WithdrawalProposal[];
  currentUserPhone: string;
  onBack: () => void;
  onVote: (proposalId: string, vote: 'approve' | 'reject') => boolean;
  onProposeWithdrawal: () => void;
}

export const StokveLVoting = ({
  stokvelId,
  stokvelName,
  members,
  proposals,
  currentUserPhone,
  onBack,
  onVote,
  onProposeWithdrawal
}: StokveLVotingProps) => {
  const [votingProposal, setVotingProposal] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getMemberName = (phone: string) => {
    const member = members.find(m => m.phone === phone);
    return member ? member.name : phone;
  };

  const handleVote = async (proposalId: string, vote: 'approve' | 'reject') => {
    setVotingProposal(proposalId);
    
    try {
      const success = onVote(proposalId, vote);
      if (success) {
        toast.success(`Vote ${vote === 'approve' ? 'approved' : 'rejected'} successfully!`);
      } else {
        toast.error('Failed to submit vote. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to submit vote. Please try again.');
    } finally {
      setVotingProposal(null);
    }
  };

  const getProposalStats = (proposal: WithdrawalProposal) => {
    const totalMembers = members.length;
    const votedMembers = proposal.votes.length;
    const approveVotes = proposal.votes.filter(v => v.vote === 'approve').length;
    const rejectVotes = proposal.votes.filter(v => v.vote === 'reject').length;
    const pendingVotes = totalMembers - votedMembers;
    
    const requiredApprovals = Math.floor(totalMembers / 2) + 1;
    const requiredRejections = Math.floor(totalMembers / 2) + 1;

    return {
      totalMembers,
      votedMembers,
      approveVotes,
      rejectVotes,
      pendingVotes,
      requiredApprovals,
      requiredRejections,
      approvalPercentage: totalMembers > 0 ? (approveVotes / totalMembers) * 100 : 0,
      rejectionPercentage: totalMembers > 0 ? (rejectVotes / totalMembers) * 100 : 0
    };
  };

  const hasUserVoted = (proposal: WithdrawalProposal) => {
    return proposal.votes.some(v => v.memberPhone === currentUserPhone);
  };

  const getUserVote = (proposal: WithdrawalProposal) => {
    const vote = proposal.votes.find(v => v.memberPhone === currentUserPhone);
    return vote?.vote;
  };

  const isProposalExpired = (proposal: WithdrawalProposal) => {
    return new Date() > proposal.expiresAt;
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} left`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} left`;
    }
  };

  const activeProposals = proposals.filter(p => p.status === 'pending' && !isProposalExpired(p));
  const completedProposals = proposals.filter(p => p.status !== 'pending' || isProposalExpired(p));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-medium">Withdrawal Voting</h1>
            <p className="text-sm text-muted-foreground">{stokvelName}</p>
          </div>
          <Button onClick={onProposeWithdrawal}>
            Propose Withdrawal
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Active Proposals */}
        {activeProposals.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-4">Active Proposals</h2>
            <div className="space-y-4">
              {activeProposals.map((proposal) => {
                const stats = getProposalStats(proposal);
                const hasVoted = hasUserVoted(proposal);
                const userVote = getUserVote(proposal);
                const isOwnProposal = proposal.proposedBy === currentUserPhone;

                return (
                  <Card key={proposal.id} className="p-6">
                    {/* Proposal Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">
                            R {proposal.amount.toLocaleString()} Withdrawal
                          </h3>
                          <Badge variant="secondary">
                            {getTimeRemaining(proposal.expiresAt)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Proposed by {getMemberName(proposal.proposedBy)}
                        </p>
                      </div>
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    </div>

                    {/* Reason */}
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">Reason:</p>
                      <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
                        {proposal.reason}
                      </p>
                    </div>

                    {/* Voting Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Voting Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {stats.votedMembers}/{stats.totalMembers} voted
                        </span>
                      </div>
                      
                      {/* Progress bars */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${stats.approvalPercentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground min-w-12">
                            {stats.approveVotes} approve
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${stats.rejectionPercentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground min-w-12">
                            {stats.rejectVotes} reject
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        Need {stats.requiredApprovals} approvals to pass • {stats.pendingVotes} pending votes
                      </p>
                    </div>

                    {/* Voting Actions */}
                    {!isOwnProposal && !hasVoted && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
                          onClick={() => handleVote(proposal.id, 'approve')}
                          disabled={votingProposal === proposal.id}
                        >
                          {votingProposal === proposal.id ? (
                            'Voting...'
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                          onClick={() => handleVote(proposal.id, 'reject')}
                          disabled={votingProposal === proposal.id}
                        >
                          {votingProposal === proposal.id ? (
                            'Voting...'
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Your Vote Status */}
                    {hasVoted && (
                      <div className={`flex items-center gap-2 p-3 rounded-lg ${
                        userVote === 'approve' 
                          ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400' 
                          : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400'
                      }`}>
                        {userVote === 'approve' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          You voted to {userVote}
                        </span>
                      </div>
                    )}

                    {/* Own Proposal Notice */}
                    {isOwnProposal && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          This is your proposal (automatically approved)
                        </span>
                      </div>
                    )}

                    {/* Voters List */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm font-medium mb-2">Votes Cast</p>
                      <div className="flex flex-wrap gap-2">
                        {proposal.votes.map((vote) => (
                          <div
                            key={vote.memberPhone}
                            className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
                              vote.vote === 'approve'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                          >
                            <Avatar className="w-4 h-4">
                              <AvatarFallback className="text-xs bg-transparent">
                                {getInitials(getMemberName(vote.memberPhone))}
                              </AvatarFallback>
                            </Avatar>
                            <span>{getMemberName(vote.memberPhone)}</span>
                            {vote.vote === 'approve' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Proposals */}
        {completedProposals.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-4">Recent Decisions</h2>
            <div className="space-y-3">
              {completedProposals.slice(0, 3).map((proposal) => {
                const stats = getProposalStats(proposal);
                const expired = isProposalExpired(proposal);

                return (
                  <Card key={proposal.id} className="p-4 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            R {proposal.amount.toLocaleString()}
                          </span>
                          <Badge 
                            variant={
                              proposal.status === 'approved' 
                                ? 'default' 
                                : proposal.status === 'rejected' 
                                ? 'destructive' 
                                : 'secondary'
                            }
                          >
                            {proposal.status === 'approved' && 'Approved'}
                            {proposal.status === 'rejected' && 'Rejected'}
                            {expired && proposal.status === 'pending' && 'Expired'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getMemberName(proposal.proposedBy)} • {stats.approveVotes} approve, {stats.rejectVotes} reject
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {proposal.proposedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {proposals.length === 0 && (
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No Withdrawal Proposals</h3>
            <p className="text-sm text-muted-foreground mb-4">
              When members propose withdrawals, they will appear here for voting.
            </p>
            <Button onClick={onProposeWithdrawal}>
              Create First Proposal
            </Button>
          </Card>
        )}

        {/* Voting Info */}
        <Card className="p-4 bg-muted/20">
          <h3 className="font-medium mb-2">Voting Rules</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>• Proposals require majority approval (&gt;{Math.floor(members.length / 2)} votes)</p>
            <p>• Voting period: 7 days from proposal submission</p>
            <p>• Members cannot vote on their own proposals</p>
            <p>• Approved withdrawals are processed immediately</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
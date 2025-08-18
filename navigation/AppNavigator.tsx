import { useState, useEffect } from 'react';
import { GamificationSystem, UserStats, Achievement } from '../components/GamificationSystem';
import { SavingGoal } from '../components/GoalsManager';
import { BillData } from '../screens/BillScanner';
import { BudgetAlert, BudgetAlertSettings } from '../components/BudgetMonitor';

export type Screen = 
  | 'registration'
  | 'otp'
  | 'name-entry'
  | 'pin-setup'
  | 'goal-setup'
  | 'dashboard'
  | 'goals-management'
  | 'achievements'
  | 'deposit-options'
  | 'deposit'
  | 'ewallet-deposit'
  | 'voucher-generation'
  | 'withdraw-options'
  | 'withdraw-amount'
  | 'withdraw-voucher'
  | 'bank-withdrawal'
  | 'card-withdrawal'
  | 'withdraw'
  | 'ai-chat'
  | 'settings'
  | 'stokvel-landing'
  | 'create-stokvel'
  | 'join-stokvel'
  | 'stokvel-dashboard'
  | 'stokvel-voting'
  | 'propose-withdrawal'
  | 'bill-scanner'
  | 'budget-alerts'
  | 'account-recovery'
  | 'recovery-setup';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  method: string;
  description: string;
  date: Date;
  goalId?: string; // Optional goal allocation
}

export interface User {
  phoneNumber: string;
  name: string;
  pin: string;
  totalSaved: number;
  goals: SavingGoal[]; // Changed from single goal to multiple goals
  primaryGoalId?: string; // ID of the main/primary goal
  biometricEnabled: boolean;
  isNewUser: boolean;
  gamificationStats: UserStats;
  transactions: Transaction[];
  depositCount: number; // Track for achievements
  lastActiveDate?: Date; // For streak tracking
  bills: BillData[]; // Track scanned bills for spending insights
  monthlyBudget?: number; // User's monthly budget for spending tracking
  recoveryData?: any; // Recovery setup data
  budgetAlerts: BudgetAlert[]; // Store budget alerts
  budgetAlertSettings: BudgetAlertSettings; // Alert preferences
}

export interface WithdrawalProposal {
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

export interface Stokvel {
  id: string;
  name: string;
  goalAmount: number;
  currentAmount: number;
  members: {
    phone: string;
    name: string;
    contribution: number;
    joinedAt: Date;
  }[];
  createdAt: Date;
  inviteCode: string;
  createdBy: string;
  withdrawalProposals: WithdrawalProposal[];
}

const INITIAL_USER: User = {
  phoneNumber: '',
  name: '',
  pin: '',
  totalSaved: 0,
  goals: [],
  biometricEnabled: false,
  isNewUser: true,
  gamificationStats: GamificationSystem.initializeStats(),
  transactions: [],
  depositCount: 0,
  bills: [],
  monthlyBudget: 5000,
  budgetAlerts: [
    {
      id: 'alert_1',
      type: 'warning' as const,
      category: 'monthly',
      message: "You're approaching your monthly budget limit. Spent R4,200 of R5,000 (84%)",
      threshold: 80,
      currentSpending: 4200,
      budgetLimit: 5000,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false
    },
    {
      id: 'alert_2',
      type: 'info' as const,
      category: 'achievement',
      message: "Great job! You're under budget by R800 this month!",
      threshold: 80,
      currentSpending: 1100,
      budgetLimit: 1500,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true
    }
  ],
  budgetAlertSettings: {
    enableAlerts: true,
    warningThreshold: 80,
    dangerThreshold: 100,
    dailyAlerts: false,
    weeklyAlerts: true,
    monthlyAlerts: true,
    categoryAlerts: true,
    smartPatternAlerts: true
  }
};

export const useAppNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('registration');
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [selectedDepositMethod, setSelectedDepositMethod] = useState<string>('');
  const [userStokvels, setUserStokvels] = useState<Stokvel[]>([]);
  const [currentStokvel, setCurrentStokvel] = useState<Stokvel | null>(null);

  // Update gamification stats whenever relevant data changes
  useEffect(() => {
    if (user.phoneNumber) {
      const activeGoalsCount = user.goals.filter(g => g.isActive).length;
      const completedGoalsCount = user.goals.filter(g => !g.isActive && g.completedAt).length;
      
      const { updatedStats, newAchievements } = GamificationSystem.checkAchievements(
        user.gamificationStats,
        {
          totalSaved: user.totalSaved,
          streak: user.gamificationStats.streak,
          goalsCompleted: completedGoalsCount,
          activeGoalsCount,
          depositCount: user.depositCount
        }
      );

      if (newAchievements.length > 0 || updatedStats !== user.gamificationStats) {
        setUser(prev => ({
          ...prev,
          gamificationStats: {
            ...updatedStats,
            totalSaved: user.totalSaved,
            goalsCompleted: completedGoalsCount
          }
        }));

        // Show achievement notifications for new achievements
        // This could trigger a toast or modal celebration
      }
    }
  }, [user.totalSaved, user.goals, user.depositCount]);

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({
      ...prev,
      ...updates,
      // Ensure budgetAlerts is always an array
      budgetAlerts: updates.budgetAlerts || prev.budgetAlerts || [],
      // Ensure budgetAlertSettings is always defined
      budgetAlertSettings: updates.budgetAlertSettings || prev.budgetAlertSettings || {
        enableAlerts: true,
        warningThreshold: 80,
        dangerThreshold: 100,
        dailyAlerts: false,
        weeklyAlerts: true,
        monthlyAlerts: true,
        categoryAlerts: true,
        smartPatternAlerts: true
      }
    }));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date()
    };

    setUser(prev => {
      const updatedUser = {
        ...prev,
        transactions: [newTransaction, ...prev.transactions]
      };

      // Update deposit count for achievements
      if (transaction.type === 'deposit') {
        updatedUser.depositCount = prev.depositCount + 1;
        
        // Award XP for deposits
        updatedUser.gamificationStats = GamificationSystem.awardReward(
          prev.gamificationStats,
          transaction.amount >= 100 ? 50 : 25, // More XP for larger deposits
          transaction.amount >= 100 ? 25 : 10   // More coins for larger deposits
        );

        // Update streak logic
        const today = new Date();
        const lastActive = prev.lastActiveDate;
        
        if (!lastActive || isConsecutiveDay(lastActive, today)) {
          updatedUser.gamificationStats.streak = lastActive && isSameDay(lastActive, today) 
            ? prev.gamificationStats.streak 
            : prev.gamificationStats.streak + 1;
          
          updatedUser.gamificationStats.longestStreak = Math.max(
            updatedUser.gamificationStats.streak,
            prev.gamificationStats.longestStreak
          );
        } else {
          updatedUser.gamificationStats.streak = 1; // Reset streak
        }
        
        updatedUser.lastActiveDate = today;
      }

      return updatedUser;
    });
  };

  // Goal management functions
  const createGoal = (goalData: Omit<SavingGoal, 'id' | 'createdAt' | 'currentAmount'>): string => {
    const goalId = `goal_${Date.now()}`;
    const newGoal: SavingGoal = {
      ...goalData,
      id: goalId,
      createdAt: new Date(),
      currentAmount: 0
    };

    setUser(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal],
      primaryGoalId: prev.goals.length === 0 ? goalId : prev.primaryGoalId
    }));

    return goalId;
  };

  const updateGoal = (goalId: string, updates: Partial<SavingGoal>) => {
    setUser(prev => ({
      ...prev,
      goals: prev.goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, ...updates }
          : goal
      )
    }));
  };

  const deleteGoal = (goalId: string) => {
    setUser(prev => {
      const updatedGoals = prev.goals.filter(goal => goal.id !== goalId);
      return {
        ...prev,
        goals: updatedGoals,
        primaryGoalId: prev.primaryGoalId === goalId 
          ? (updatedGoals.length > 0 ? updatedGoals[0].id : undefined)
          : prev.primaryGoalId
      };
    });
  };

  const allocateFundsToGoal = (goalId: string, amount: number) => {
    if (amount > user.totalSaved) return false;

    // Deduct from total saved and add to specific goal
    setUser(prev => ({
      ...prev,
      totalSaved: prev.totalSaved - amount,
      goals: prev.goals.map(goal =>
        goal.id === goalId
          ? { ...goal, currentAmount: goal.currentAmount + amount }
          : goal
      )
    }));

    // Add transaction record
    addTransaction({
      type: 'deposit',
      amount,
      method: 'goal-allocation',
      description: `Allocated to ${user.goals.find(g => g.id === goalId)?.name || 'goal'}`,
      goalId
    });

    return true;
  };

  const getPrimaryGoal = () => {
    if (!user.primaryGoalId) return user.goals[0];
    return user.goals.find(goal => goal.id === user.primaryGoalId) || user.goals[0];
  };

  const getAvailableFunds = (): number => {
    const allocatedFunds = user.goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    return user.totalSaved - allocatedFunds;
  };

  // Bill management functions
  const addBill = (billData: BillData) => {
    setUser(prev => ({
      ...prev,
      bills: [billData, ...prev.bills]
    }));
  };

  const updateBill = (billId: string, updates: Partial<BillData>) => {
    setUser(prev => ({
      ...prev,
      bills: prev.bills.map(bill => 
        bill.id === billId 
          ? { ...bill, ...updates }
          : bill
      )
    }));
  };

  const deleteBill = (billId: string) => {
    setUser(prev => ({
      ...prev,
      bills: prev.bills.filter(bill => bill.id !== billId)
    }));
  };

  const getSpendingInsights = () => {
    const totalSpending = user.bills.reduce((sum, bill) => sum + bill.amount, 0);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlySpending = user.bills.filter(bill => 
      bill.uploadDate.getMonth() === currentMonth && 
      bill.uploadDate.getFullYear() === currentYear
    ).reduce((sum, bill) => sum + bill.amount, 0);

    const categoryBreakdown = user.bills.reduce((acc, bill) => {
      acc[bill.category] = (acc[bill.category] || 0) + bill.amount;
      return acc;
    }, {} as Record<string, number>);

    const unpaidBills = user.bills.filter(bill => !bill.isPaid);
    const highPriorityBills = user.bills.filter(bill => bill.priority === 'high');

    return {
      totalSpending,
      monthlySpending,
      categoryBreakdown,
      unpaidBills,
      highPriorityBills,
      billCount: user.bills.length
    };
  };

  // Budget alert management functions
  const addBudgetAlert = (alert: BudgetAlert) => {
    setUser(prev => ({
      ...prev,
      budgetAlerts: [alert, ...(prev.budgetAlerts || [])]
    }));
  };

  const markAlertAsRead = (alertId: string) => {
    setUser(prev => ({
      ...prev,
      budgetAlerts: (prev.budgetAlerts || []).map(alert => 
        alert.id === alertId 
          ? { ...alert, isRead: true }
          : alert
      )
    }));
  };

  const deleteAlert = (alertId: string) => {
    setUser(prev => ({
      ...prev,
      budgetAlerts: (prev.budgetAlerts || []).filter(alert => alert.id !== alertId)
    }));
  };

  const clearAllAlerts = () => {
    setUser(prev => ({
      ...prev,
      budgetAlerts: []
    }));
  };

  const updateBudgetAlertSettings = (settings: BudgetAlertSettings) => {
    setUser(prev => ({
      ...prev,
      budgetAlertSettings: settings
    }));
  };

  const getCurrentSpending = (): number => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return user.bills.filter(bill => 
      bill.uploadDate.getMonth() === currentMonth && 
      bill.uploadDate.getFullYear() === currentYear
    ).reduce((sum, bill) => sum + bill.amount, 0);
  };

  // Stokvel functions (unchanged)
  const createStokvel = (name: string, goalAmount: number): string => {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newStokvel: Stokvel = {
      id: Date.now().toString(),
      name,
      goalAmount,
      currentAmount: 0,
      members: [{
        phone: user.phoneNumber,
        name: user.name,
        contribution: 0,
        joinedAt: new Date()
      }],
      createdAt: new Date(),
      inviteCode,
      createdBy: user.phoneNumber,
      withdrawalProposals: []
    };

    setUserStokvels(prev => [...prev, newStokvel]);
    setCurrentStokvel(newStokvel);
    return inviteCode;
  };

  const joinStokvel = (inviteCode: string): boolean => {
    // Simulate finding a stokvel (in real app, this would be an API call)
    const mockStokvel: Stokvel = {
      id: Date.now().toString(),
      name: 'Family Emergency Fund',
      goalAmount: 10000,
      currentAmount: 3500,
      members: [
        {
          phone: '+27123456789',
          name: 'Sarah Mthembu',
          contribution: 2000,
          joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          phone: '+27987654321',
          name: 'John Dlamini',
          contribution: 1500,
          joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
        },
        {
          phone: user.phoneNumber,
          name: user.name,
          contribution: 0,
          joinedAt: new Date()
        }
      ],
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      inviteCode,
      createdBy: '+27123456789',
      withdrawalProposals: [
        {
          id: 'prop_1',
          amount: 1500,
          reason: 'Emergency medical expenses for Sarah\'s family',
          proposedBy: '+27123456789',
          proposedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'pending' as const,
          votes: [
            {
              memberPhone: '+27123456789',
              vote: 'approve' as const,
              votedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            }
          ],
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        }
      ]
    };

    setUserStokvels(prev => [...prev, mockStokvel]);
    setCurrentStokvel(mockStokvel);
    return true;
  };

  const selectStokvel = (stokvel: Stokvel) => {
    setCurrentStokvel(stokvel);
  };

  const addContribution = (stokvelId: string, amount: number) => {
    setUserStokvels(prev => prev.map(stokvel => {
      if (stokvel.id === stokvelId) {
        const updatedMembers = stokvel.members.map(member => 
          member.phone === user.phoneNumber 
            ? { ...member, contribution: member.contribution + amount }
            : member
        );
        
        return {
          ...stokvel,
          currentAmount: stokvel.currentAmount + amount,
          members: updatedMembers
        };
      }
      return stokvel;
    }));

    setCurrentStokvel(prev => 
      prev?.id === stokvelId 
        ? { 
            ...prev, 
            currentAmount: prev.currentAmount + amount,
            members: prev.members.map(member => 
              member.phone === user.phoneNumber 
                ? { ...member, contribution: member.contribution + amount }
                : member
            )
          }
        : prev
    );
  };

  // Voting system functions
  const proposeWithdrawal = (stokvelId: string, amount: number, reason: string): string => {
    const proposalId = `prop_${Date.now()}`;
    const proposal: WithdrawalProposal = {
      id: proposalId,
      amount,
      reason,
      proposedBy: user.phoneNumber,
      proposedAt: new Date(),
      status: 'pending',
      votes: [{
        memberPhone: user.phoneNumber,
        vote: 'approve',
        votedAt: new Date()
      }],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days to vote
    };

    setUserStokvels(prev => prev.map(stokvel => {
      if (stokvel.id === stokvelId) {
        return {
          ...stokvel,
          withdrawalProposals: [...stokvel.withdrawalProposals, proposal]
        };
      }
      return stokvel;
    }));

    setCurrentStokvel(prev => 
      prev?.id === stokvelId 
        ? { ...prev, withdrawalProposals: [...prev.withdrawalProposals, proposal] }
        : prev
    );

    return proposalId;
  };

  const voteOnProposal = (stokvelId: string, proposalId: string, vote: 'approve' | 'reject'): boolean => {
    let proposalUpdated = false;

    setUserStokvels(prev => prev.map(stokvel => {
      if (stokvel.id === stokvelId) {
        const updatedProposals = stokvel.withdrawalProposals.map(proposal => {
          if (proposal.id === proposalId) {
            // Check if user already voted
            const existingVoteIndex = proposal.votes.findIndex(v => v.memberPhone === user.phoneNumber);
            
            let updatedVotes;
            if (existingVoteIndex >= 0) {
              // Update existing vote
              updatedVotes = proposal.votes.map((v, index) => 
                index === existingVoteIndex 
                  ? { ...v, vote, votedAt: new Date() }
                  : v
              );
            } else {
              // Add new vote
              updatedVotes = [...proposal.votes, {
                memberPhone: user.phoneNumber,
                vote,
                votedAt: new Date()
              }];
            }

            // Check if proposal should be approved/rejected
            const totalMembers = stokvel.members.length;
            const approveVotes = updatedVotes.filter(v => v.vote === 'approve').length;
            const rejectVotes = updatedVotes.filter(v => v.vote === 'reject').length;
            
            let newStatus = proposal.status;
            if (approveVotes > totalMembers / 2) {
              newStatus = 'approved';
            } else if (rejectVotes >= totalMembers / 2) {
              newStatus = 'rejected';
            }

            proposalUpdated = true;
            return {
              ...proposal,
              votes: updatedVotes,
              status: newStatus
            };
          }
          return proposal;
        });

        return { ...stokvel, withdrawalProposals: updatedProposals };
      }
      return stokvel;
    }));

    // Update current stokvel if it matches
    setCurrentStokvel(prev => {
      if (prev?.id === stokvelId) {
        const updatedProposals = prev.withdrawalProposals.map(proposal => {
          if (proposal.id === proposalId) {
            const existingVoteIndex = proposal.votes.findIndex(v => v.memberPhone === user.phoneNumber);
            
            let updatedVotes;
            if (existingVoteIndex >= 0) {
              updatedVotes = proposal.votes.map((v, index) => 
                index === existingVoteIndex 
                  ? { ...v, vote, votedAt: new Date() }
                  : v
              );
            } else {
              updatedVotes = [...proposal.votes, {
                memberPhone: user.phoneNumber,
                vote,
                votedAt: new Date()
              }];
            }

            const totalMembers = prev.members.length;
            const approveVotes = updatedVotes.filter(v => v.vote === 'approve').length;
            const rejectVotes = updatedVotes.filter(v => v.vote === 'reject').length;
            
            let newStatus = proposal.status;
            if (approveVotes > totalMembers / 2) {
              newStatus = 'approved';
            } else if (rejectVotes >= totalMembers / 2) {
              newStatus = 'rejected';
            }

            return {
              ...proposal,
              votes: updatedVotes,
              status: newStatus
            };
          }
          return proposal;
        });

        return { ...prev, withdrawalProposals: updatedProposals };
      }
      return prev;
    });

    return proposalUpdated;
  };

  const getActiveProposals = (stokvelId: string): WithdrawalProposal[] => {
    const stokvel = userStokvels.find(s => s.id === stokvelId);
    if (!stokvel) return [];
    
    return stokvel.withdrawalProposals.filter(proposal => 
      proposal.status === 'pending' && proposal.expiresAt > new Date()
    );
  };

  const resetApp = () => {
    setCurrentScreen('registration');
    setUser(INITIAL_USER);
    setSelectedDepositMethod('');
    setUserStokvels([]);
    setCurrentStokvel(null);
  };

  const simulateReturningUser = () => {
    const returningUser: User = {
      phoneNumber: '+27123456789',
      name: 'Dylan Kazembe',
      pin: '1234',
      totalSaved: 2500,
      goals: [
        {
          id: 'goal_1',
          name: 'Emergency Fund',
          targetAmount: 5000,
          currentAmount: 1250,
          category: 'emergency',
          priority: 'high',
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          isActive: true,
          color: 'bg-red-500'
        },
        {
          id: 'goal_2',
          name: 'Vacation Fund',
          targetAmount: 3000,
          currentAmount: 800,
          category: 'vacation',
          priority: 'medium',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          isActive: true,
          color: 'bg-blue-500'
        }
      ],
      primaryGoalId: 'goal_1',
      biometricEnabled: true,
      isNewUser: false,
      gamificationStats: {
        ...GamificationSystem.initializeStats(),
        level: 3,
        xp: 450,
        xpToNextLevel: 450,
        totalXp: 900,
        coins: 250,
        streak: 12,
        longestStreak: 15,
        totalSaved: 2500,
        goalsCompleted: 1
      },
      transactions: [
        {
          id: '1',
          type: 'deposit',
          amount: 500,
          method: 'ewallet',
          description: 'Deposit via eWallet',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          goalId: 'goal_1'
        },
        {
          id: '2',
          type: 'deposit',
          amount: 300,
          method: 'mtn-money',
          description: 'Deposit via MTN Money',
          date: new Date(Date.now() - 48 * 60 * 60 * 1000),
          goalId: 'goal_2'
        }
      ],
      depositCount: 8,
      lastActiveDate: new Date(),
      bills: [
        {
          id: 'bill_1',
          fileName: 'electricity_bill.jpg',
          uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          amount: 650,
          category: 'electricity',
          merchant: 'Eskom',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          isPaid: false,
          analysisStatus: 'completed',
          aiInsights: [
            'Your electricity usage is 15% higher than last month',
            'Peak usage hours: 18:00-22:00 daily'
          ],
          recommendations: [
            'Set aside R50 weekly for electricity bills',
            'Use appliances during off-peak hours'
          ],
          priority: 'high',
          recurringPattern: 'monthly'
        },
        {
          id: 'bill_2',
          fileName: 'groceries_receipt.jpg',
          uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          amount: 450,
          category: 'groceries',
          merchant: 'Shoprite',
          isPaid: true,
          analysisStatus: 'completed',
          aiInsights: [
            'Grocery spending is within budget',
            'Good variety of nutritious foods'
          ],
          recommendations: [
            'Consider bulk buying for better savings',
            'Look for weekly specials'
          ],
          priority: 'medium',
          recurringPattern: 'none'
        }
      ],
      monthlyBudget: 5000,
      budgetAlerts: [
        {
          id: 'alert_3',
          type: 'warning' as const,
          category: 'monthly',
          message: "You're approaching your monthly budget limit. Spent R4,200 of R5,000 (84%)",
          threshold: 80,
          currentSpending: 4200,
          budgetLimit: 5000,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          isRead: false
        }
      ],
      budgetAlertSettings: {
        enableAlerts: true,
        warningThreshold: 80,
        dangerThreshold: 100,
        dailyAlerts: false,
        weeklyAlerts: true,
        monthlyAlerts: true,
        categoryAlerts: true,
        smartPatternAlerts: true
      }
    };

    setUser(returningUser);
    setCurrentScreen('dashboard');
  };

  // Helper functions for streak calculation
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString();
  };

  const isConsecutiveDay = (lastDate: Date, currentDate: Date): boolean => {
    const diffTime = currentDate.getTime() - lastDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  };

  return {
    currentScreen,
    user,
    selectedDepositMethod,
    currentStokvel,
    userStokvels,
    navigateToScreen,
    updateUser,
    addTransaction,
    setDepositMethod: setSelectedDepositMethod,
    resetApp,
    simulateReturningUser,
    createStokvel,
    joinStokvel,
    selectStokvel,
    addContribution,
    createGoal,
    updateGoal,
    deleteGoal,
    allocateFundsToGoal,
    getPrimaryGoal,
    getAvailableFunds,
    proposeWithdrawal,
    voteOnProposal,
    getActiveProposals,
    addBill,
    updateBill,
    deleteBill,
    getSpendingInsights,
    addBudgetAlert,
    markAlertAsRead,
    deleteAlert,
    clearAllAlerts,
    updateBudgetAlertSettings,
    getCurrentSpending
  };
};

// Helper function to check if dates are consecutive days
const isConsecutiveDay = (lastDate: Date, currentDate: Date): boolean => {
  const diffTime = currentDate.getTime() - lastDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 1000));
  return diffDays <= 1;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};
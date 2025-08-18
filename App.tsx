import { PhoneRegistration } from './screens/PhoneRegistration';
import { OTPVerification } from './screens/OTPVerification';
import { NameEntry } from './screens/NameEntry';
import { PINSetup } from './screens/PINSetup';
import { GoalSetup } from './screens/GoalSetup';
import { Dashboard } from './screens/Dashboard';
import { QuickActions } from './screens/QuickActions';
import { EWalletDeposit } from './screens/EWalletDeposit';
import { VoucherGeneration } from './screens/VoucherGeneration';
import { DepositOptions } from './screens/DepositOptions';
import { WithdrawOptions } from './screens/WithdrawOptions';
import { BankWithdrawal } from './screens/BankWithdrawal';
import { CardWithdrawal } from './screens/CardWithdrawal';
import { WithdrawVoucher } from './screens/WithdrawVoucher';
import { AICoach } from './screens/AICoach';
import { Settings } from './screens/Settings';
import { StokveLanding } from './screens/StokveLanding';
import { CreateStokvel } from './screens/CreateStokvel';
import { JoinStokvel } from './screens/JoinStokvel';
import { StokveDashboard } from './screens/StokveDashboard';
import { ProposeWithdrawal } from './screens/ProposeWithdrawal';
import { StokveLVoting } from './screens/StokveLVoting';
import { GoalsManagement } from './screens/GoalsManagement';
import { Achievements } from './screens/Achievements';
import { AccountRecovery } from './screens/AccountRecovery';
import { RecoverySetup } from './screens/RecoverySetup';
import { useAppNavigator } from './navigation/AppNavigator';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/ThemeProvider';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { CSSReset } from './components/CSSReset';
import { BadgeCelebration } from './components/BadgeCelebration';
import { useState, useEffect } from 'react';
import { Achievement } from './components/GamificationSystem';
import { toast } from 'sonner';
import { BillScanner } from './screens/BillScanner';
import BudgetMonitor from './components/BudgetMonitor';
import BudgetAlerts from './screens/BudgetAlerts';
import type { SavingGoal } from './components/GoalsManager';
import type { Stokvel } from './navigation/AppNavigator';

// Type definitions to fix 'any' type warnings
interface GoalData {
  name: string;
  amount: number;
  frequency: string;
}

// Unified RecoveryData type for the whole app
export interface RecoveryData {
  [key: string]: unknown;
}

// Default budget alert settings
const defaultBudgetAlertSettings = {
  enableAlerts: true,
  thresholds: {
    warning: 75,
    critical: 90
  },
  frequency: 'daily' as const,
  categories: [] as string[]
};

function AppContent() {
  const {
    currentScreen,
    user,
    selectedDepositMethod,
    currentStokvel,
    userStokvels,
    navigateToScreen,
    updateUser,
    addTransaction,
    setDepositMethod,
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
    addBill,
    addBudgetAlert,
    markAlertAsRead,
    deleteAlert,
    clearAllAlerts,
    updateBudgetAlertSettings,
    getCurrentSpending
  } = useAppNavigator();

  const { t } = useLanguage();

  // State for handling deposit/withdraw amounts across screens
  const [pendingDepositAmount, setPendingDepositAmount] = useState<number>(0);
  const [pendingWithdrawAmount, setPendingWithdrawAmount] = useState<number>(0);
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState<string>('');
  const [celebratingAchievement, setCelebratingAchievement] = useState<Achievement | null>(null);
  const [showRecoverySetup, setShowRecoverySetup] = useState(false);

  // Monitor for new achievements and show celebrations
  useEffect(() => {
    const checkForNewAchievements = () => {
      if (!user.gamificationStats?.achievements) return;
      
      const recentAchievement = user.gamificationStats.achievements
        .filter(a => a.unlockedAt)
        .sort((a, b) => (b.unlockedAt!.getTime() - a.unlockedAt!.getTime()))
        .find(a => {
          const timeDiff = Date.now() - a.unlockedAt!.getTime();
          return timeDiff < 5000; // Achievement unlocked in last 5 seconds
        });

      if (recentAchievement && !celebratingAchievement) {
        setCelebratingAchievement(recentAchievement);
        
        toast.success(`🏆 Achievement Unlocked: ${recentAchievement.name}!`, {
          description: `+${recentAchievement.reward.xp} XP, +${recentAchievement.reward.coins} coins earned`,
          duration: 5000
        });
      }
    };

    if (user.phoneNumber) {
      checkForNewAchievements();
    }
  }, [user.gamificationStats?.achievements, celebratingAchievement, user.phoneNumber]);

  const handlePhoneSubmit = (phoneNumber: string, isReturning: boolean = false) => {
    updateUser({ 
      phoneNumber,
      isNewUser: !isReturning 
    });
    navigateToScreen('otp');
  };

  const handleOTPVerification = () => {
    if (user.isNewUser) {
      navigateToScreen('name-entry');
    } else {
      // This will be handled by simulateReturningUser in a real scenario
      navigateToScreen('dashboard');
    }
  };

  const handleNameEntry = (name: string) => {
    updateUser({ name });
    navigateToScreen('pin-setup');
  };

  const handlePINSetup = (pin: string) => {
    updateUser({ pin });
    
    // For new users, show recovery setup option before goal setup
    if (user.isNewUser) {
      setShowRecoverySetup(true);
    } else {
      navigateToScreen('goal-setup');
    }
  };

  const handleRecoverySetupComplete = (recoveryData: RecoveryData) => {
    // In a real app, this would be saved securely
    updateUser({ recoveryData });
    setShowRecoverySetup(false);
    navigateToScreen('goal-setup');
    toast.success(t('recovery.setup.success') || 'Recovery methods saved successfully!');
  };

  const handleSkipRecoverySetup = () => {
    setShowRecoverySetup(false);
    navigateToScreen('goal-setup');
    toast.info(t('recovery.setup.skipped') || 'You can set up recovery methods later in Settings');
  };

  const handleGoalSetup = (goalData: GoalData) => {
    try {
      // Create the first goal
      createGoal({
        name: goalData.name,
        targetAmount: goalData.amount,
        category: 'other',
        priority: 'high',
        isActive: true,
        color: 'bg-primary'
      });

      updateUser({ isNewUser: false });
      navigateToScreen('dashboard');
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal. Please try again.');
    }
  };

  const handleAccountRecovery = () => {
    navigateToScreen('account-recovery');
  };

  const handleRecoverySuccess = (newPhoneNumber: string) => {
    // Update user with new phone number and navigate to dashboard
    updateUser({ phoneNumber: newPhoneNumber });
    navigateToScreen('dashboard');
    toast.success(t('recovery.success.complete') || 'Welcome back! Your account has been recovered.');
  };

  const handleContactSupport = () => {
    // In a real app, this would open a support chat or phone number
    toast.info(t('support.contact_info') || 'Contact Support: 0800 123 456 or help@kasave.co.za');
  };

  const handleTransactionComplete = (amount: number, type: 'deposit' | 'withdraw', goalId?: string) => {
    try {
      if (amount <= 0) {
        toast.error('Invalid amount. Please enter a valid amount.');
        return;
      }

      if (type === 'withdraw' && amount > user.totalSaved) {
        toast.error('Insufficient funds for withdrawal.');
        return;
      }

      const newTotalSaved = type === 'deposit' 
        ? user.totalSaved + amount 
        : Math.max(0, user.totalSaved - amount);
      
      updateUser({ totalSaved: newTotalSaved });

      // Handle goal allocation for deposits
      if (type === 'deposit') {
        if (goalId) {
          // Allocate to specific goal
          const targetGoal = user.goals.find(g => g.id === goalId);
          if (targetGoal) {
            updateGoal(goalId, {
              currentAmount: targetGoal.currentAmount + amount
            });
          }
        } else {
          // Auto-allocate to primary goal if no specific goal is selected
          const primaryGoal = getPrimaryGoal();
          if (primaryGoal && primaryGoal.isActive) {
            updateGoal(primaryGoal.id, {
              currentAmount: primaryGoal.currentAmount + amount
            });
          }
        }
      }

      // Add transaction record
      addTransaction({
        type,
        amount,
        method: type === 'deposit' ? selectedDepositMethod : selectedWithdrawMethod,
        description: type === 'deposit' 
          ? `${t('deposit.via') || 'Deposit via'} ${getMethodDisplayName(selectedDepositMethod)}`
          : `${t('withdraw.via') || 'Withdrawal via'} ${getWithdrawMethodDisplayName(selectedWithdrawMethod)}`,
        goalId
      });

      // Show success message
      const actionText = type === 'deposit' ? 'deposited' : 'withdrawn';
      toast.success(`R${amount.toLocaleString()} ${actionText} successfully!`);

      navigateToScreen('dashboard');
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error('Transaction failed. Please try again.');
    }
  };

  const getMethodDisplayName = (method?: string) => {
    switch (method) {
      case 'ewallet': return t('deposit.ewallet') || 'eWallet';
      case 'mtn-money': return t('deposit.mtn_money') || 'MTN Money';
      case 'generate-voucher': return t('deposit.payment_voucher') || 'Payment Voucher';
      case 'cash-send': return t('deposit.cash_send') || 'Cash Send';
      default: return t('deposit.payment_method') || 'Payment Method';
    }
  };

  const getWithdrawMethodDisplayName = (method?: string) => {
    switch (method) {
      case 'redeemable-voucher': return t('withdraw.voucher') || 'Redeemable Voucher';
      case 'bank-account': return t('withdraw.bank_account') || 'Bank Account';
      case 'link-card': return t('withdraw.linked_card') || 'Linked Card';
      case 'ewallet-withdraw': return t('withdraw.ewallet') || 'eWallet';
      case 'cash-send': return t('withdraw.cash_send') || 'Cash Send';
      case 'qr-code': return t('withdraw.qr_code') || 'QR Code';
      default: return t('withdraw.method') || 'Withdrawal Method';
    }
  };

  const handleDepositMethodSelect = (method: string) => {
    setDepositMethod(method);
    navigateToScreen('deposit');
  };

  const handleDepositAmountConfirm = (amount: number) => {
    if (amount <= 0) {
      toast.error('Please enter a valid amount greater than R0.');
      return;
    }

    setPendingDepositAmount(amount);
    
    if (selectedDepositMethod === 'ewallet') {
      navigateToScreen('ewallet-deposit');
    } else if (selectedDepositMethod === 'generate-voucher') {
      navigateToScreen('voucher-generation');
    } else {
      handleTransactionComplete(amount, 'deposit');
    }
  };

  const handleWithdrawMethodSelect = (method: string) => {
    setSelectedWithdrawMethod(method);
    navigateToScreen('withdraw-amount');
  };

  const handleWithdrawAmountConfirm = (amount: number) => {
    if (amount <= 0) {
      toast.error('Please enter a valid amount greater than R0.');
      return;
    }

    if (amount > user.totalSaved) {
      toast.error('Insufficient funds. Please enter a smaller amount.');
      return;
    }

    setPendingWithdrawAmount(amount);
    
    switch (selectedWithdrawMethod) {
      case 'redeemable-voucher':
        navigateToScreen('withdraw-voucher');
        break;
      case 'bank-account':
        navigateToScreen('bank-withdrawal');
        break;
      case 'link-card':
        navigateToScreen('card-withdrawal');
        break;
      default:
        handleTransactionComplete(amount, 'withdraw');
        break;
    }
  };

  const handleBiometricToggle = (enabled: boolean) => {
    updateUser({ biometricEnabled: enabled });
  };

  // Stokvel handlers
  const handleCreateStokvel = (name: string, goalAmount: number): string => {
    try {
      return createStokvel(name, goalAmount);
    } catch (error) {
      console.error('Error creating Stokvel:', error);
      toast.error('Failed to create Stokvel. Please try again.');
      return '';
    }
  };

  const handleJoinStokvel = (inviteCode: string): boolean => {
    try {
      const success = joinStokvel(inviteCode);
      if (success) {
        toast.success('Successfully joined Stokvel!');
      } else {
        toast.error('Invalid invite code. Please check and try again.');
      }
      return success;
    } catch (error) {
      console.error('Error joining Stokvel:', error);
      toast.error('Failed to join Stokvel. Please try again.');
      return false;
    }
  };

  const handleViewStokvel = (stokvel: unknown) => {
    // Ensure type safety
    selectStokvel(stokvel as Stokvel);
    navigateToScreen('stokvel-dashboard');
  };

  const handleStokveLContribution = (amount: number) => {
    try {
      if (currentStokvel && amount > 0) {
        addContribution(currentStokvel.id, amount);
        toast.success(`R${amount.toLocaleString()} contributed to ${currentStokvel.name}!`);
        navigateToScreen('stokvel-dashboard');
      }
    } catch (error) {
      console.error('Error contributing to Stokvel:', error);
      toast.error('Failed to contribute. Please try again.');
    }
  };

  // Goals management handlers
  const handleCreateGoal = (goalData: unknown) => {
    try {
      createGoal(goalData as Omit<SavingGoal, "id" | "createdAt" | "currentAmount">);
      toast.success(`Goal "${(goalData as { name: string }).name}" created successfully!`);
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal. Please try again.');
    }
  };

  const handleUpdateGoal = (goalId: string, updates: unknown) => {
    try {
      updateGoal(goalId, updates as Partial<SavingGoal>);
      
      // Show completion celebration if goal is being marked as complete
      if ((updates as { completedAt?: Date }).completedAt) {
        const goal = user.goals.find(g => g.id === goalId);
        if (goal) {
          toast.success(`🎉 Congratulations! You completed "${goal.name}"!`, {
            duration: 6000
          });
        }
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal. Please try again.');
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    try {
      const goal = user.goals.find(g => g.id === goalId);
      deleteGoal(goalId);
      toast.success(`Goal "${goal?.name || 'Goal'}" deleted successfully.`);
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal. Please try again.');
    }
  };

  const handleAllocateFunds = (goalId: string, amount: number) => {
    try {
      if (allocateFundsToGoal(goalId, amount)) {
        const goal = user.goals.find(g => g.id === goalId);
        toast.success(`R${amount.toLocaleString()} allocated to "${goal?.name}" successfully!`);
      } else {
        toast.error('Insufficient funds for allocation');
      }
    } catch (error) {
      console.error('Error allocating funds:', error);
      toast.error('Failed to allocate funds. Please try again.');
    }
  };

  const renderContent = () => {
    try {
      // Show recovery setup if needed during onboarding
      if (showRecoverySetup) {
        return (
          <RecoverySetup
            onBack={handleSkipRecoverySetup}
            onComplete={handleRecoverySetupComplete}
            isOnboarding={true}
          />
        );
      }

      switch (currentScreen) {
        case 'registration':
          return (
            <PhoneRegistration 
              onNext={handlePhoneSubmit}
              onReturningUser={(phone) => handlePhoneSubmit(phone, true)}
              onDemoSkip={simulateReturningUser}
              onAccountRecovery={handleAccountRecovery}
            />
          );

        case 'account-recovery':
          return (
            <AccountRecovery
              onBack={() => navigateToScreen('registration')}
              onRecoverySuccess={handleRecoverySuccess}
              onContactSupport={handleContactSupport}
            />
          );

        case 'recovery-setup':
          return (
            <RecoverySetup
              onBack={() => navigateToScreen('settings')}
              onComplete={(recoveryData: RecoveryData) => {
                updateUser({ recoveryData });
                navigateToScreen('settings');
                toast.success('Recovery settings updated successfully!');
              }}
              isOnboarding={false}
            />
          );
          
        case 'otp':
          return (
            <OTPVerification
              phoneNumber={user.phoneNumber}
              onVerify={handleOTPVerification}
              onBack={() => navigateToScreen('registration')}
            />
          );

        case 'name-entry':
          return (
            <NameEntry
              onComplete={handleNameEntry}
              onBack={() => navigateToScreen('otp')}
            />
          );
      
        case 'pin-setup':
          return (
            <PINSetup
              onComplete={handlePINSetup}
              onBack={() => navigateToScreen('name-entry')}
            />
          );
      
        case 'goal-setup':
          return (
            <GoalSetup
              onComplete={handleGoalSetup}
              onBack={() => navigateToScreen('pin-setup')}
            />
          );
      
        case 'dashboard':
          return (
            <Dashboard
              user={user}
              userStokvels={userStokvels}
              onDeposit={() => navigateToScreen('deposit-options')}
              onWithdraw={() => navigateToScreen('withdraw-options')}
              onSettings={() => navigateToScreen('settings')}
              onAIChat={() => navigateToScreen('ai-chat')}
              onStokvels={() => navigateToScreen('stokvel-landing')}
              onGoalsManagement={() => navigateToScreen('goals-management')}
              onAchievements={() => navigateToScreen('achievements')}
              onBillScanner={() => navigateToScreen('bill-scanner')}
              onBudgetAlerts={() => navigateToScreen('budget-alerts')}
            />
          );

        case 'goals-management':
          return (
            <GoalsManagement
              goals={user.goals}
              totalAvailableFunds={getAvailableFunds()}
              onBack={() => navigateToScreen('dashboard')}
              onCreateGoal={handleCreateGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
              onAllocateFunds={handleAllocateFunds}
            />
          );

        case 'achievements':
          return (
            <Achievements
              achievements={user.gamificationStats.achievements}
              challenges={user.gamificationStats.activeChallenges}
              onBack={() => navigateToScreen('dashboard')}
            />
          );

        case 'stokvel-landing':
          return (
            <StokveLanding
              onBack={() => navigateToScreen('dashboard')}
              onCreateStokvel={() => navigateToScreen('create-stokvel')}
              onJoinStokvel={() => navigateToScreen('join-stokvel')}
              existingStokvels={userStokvels}
              onViewStokvel={handleViewStokvel}
            />
          );

        case 'create-stokvel':
          return (
            <CreateStokvel
              onBack={() => navigateToScreen('stokvel-landing')}
              onComplete={handleCreateStokvel}
              onViewStokvel={() => navigateToScreen('stokvel-dashboard')}
            />
          );

        case 'join-stokvel':
          return (
            <JoinStokvel
              onBack={() => navigateToScreen('stokvel-landing')}
              onJoin={handleJoinStokvel}
              onSuccess={() => navigateToScreen('stokvel-dashboard')}
            />
          );

        case 'stokvel-dashboard':
          return currentStokvel ? (
            <StokveDashboard
              stokvel={{
                ...currentStokvel,
                totalSaved: currentStokvel.currentAmount,
                createdDate: currentStokvel.createdAt,
                withdrawalProposals: currentStokvel.withdrawalProposals || [],
                members: currentStokvel.members.map(member => ({
                  id: member.phone,
                  name: member.name,
                  phoneNumber: member.phone,
                  contribution: member.contribution,
                  joinedDate: member.joinedAt
                }))
              }}
              currentUserPhone={user.phoneNumber}
              onBack={() => navigateToScreen('stokvel-landing')}
              onContribute={() => {
                handleStokveLContribution(500);
              }}
              onInviteMembers={() => {
                // Show share functionality - already handled in the component
              }}
              onViewVoting={() => navigateToScreen('stokvel-voting')}
            />
          ) : (
            <StokveLanding
              onBack={() => navigateToScreen('dashboard')}
              onCreateStokvel={() => navigateToScreen('create-stokvel')}
              onJoinStokvel={() => navigateToScreen('join-stokvel')}
              existingStokvels={userStokvels}
              onViewStokvel={handleViewStokvel}
            />
          );

        case 'stokvel-voting':
          return currentStokvel ? (
            <StokveLVoting
              stokvelId={currentStokvel.id}
              stokvelName={currentStokvel.name}
              members={currentStokvel.members}
              proposals={currentStokvel.withdrawalProposals || []}
              currentUserPhone={user.phoneNumber}
              onBack={() => navigateToScreen('stokvel-dashboard')}
              onVote={(proposalId, vote) => {
                const success = voteOnProposal(currentStokvel.id, proposalId, vote);
                return success;
              }}
              onProposeWithdrawal={() => navigateToScreen('propose-withdrawal')}
            />
          ) : null;

        case 'propose-withdrawal':
          return currentStokvel ? (
            <ProposeWithdrawal
              stokvelId={currentStokvel.id}
              stokvelName={currentStokvel.name}
              currentAmount={currentStokvel.currentAmount}
              onBack={() => navigateToScreen('stokvel-voting')}
              onPropose={(amount, reason) => {
                const proposalId = proposeWithdrawal(currentStokvel.id, amount, reason);
                return proposalId;
              }}
              onViewVoting={() => navigateToScreen('stokvel-voting')}
            />
          ) : null;

        case 'deposit-options':
          return (
            <DepositOptions
              onBack={() => navigateToScreen('dashboard')}
              onSelectMethod={handleDepositMethodSelect}
            />
          );

        case 'deposit':
          return (
            <QuickActions
              action="deposit"
              selectedMethod={selectedDepositMethod}
              onBack={() => navigateToScreen('deposit-options')}
              onComplete={handleDepositAmountConfirm}
            />
          );

        case 'ewallet-deposit':
          return (
            <EWalletDeposit
              amount={pendingDepositAmount}
              onBack={() => navigateToScreen('deposit')}
              onComplete={() => handleTransactionComplete(pendingDepositAmount, 'deposit')}
            />
          );

        case 'voucher-generation':
          return (
            <VoucherGeneration
              amount={pendingDepositAmount}
              onBack={() => navigateToScreen('deposit')}
              onComplete={() => handleTransactionComplete(pendingDepositAmount, 'deposit')}
            />
          );

        case 'withdraw-options':
          return (
            <WithdrawOptions
              onBack={() => navigateToScreen('dashboard')}
              onSelectMethod={handleWithdrawMethodSelect}
            />
          );

        case 'withdraw-amount':
          return (
            <QuickActions
              action="withdraw"
              selectedMethod={selectedWithdrawMethod}
              onBack={() => navigateToScreen('withdraw-options')}
              onComplete={handleWithdrawAmountConfirm}
            />
          );

        case 'withdraw-voucher':
          return (
            <WithdrawVoucher
              amount={pendingWithdrawAmount}
              onBack={() => navigateToScreen('withdraw-amount')}
              onComplete={() => handleTransactionComplete(pendingWithdrawAmount, 'withdraw')}
            />
          );

        case 'bank-withdrawal':
          return (
            <BankWithdrawal
              amount={pendingWithdrawAmount}
              onBack={() => navigateToScreen('withdraw-amount')}
              onComplete={() => handleTransactionComplete(pendingWithdrawAmount, 'withdraw')}
            />
          );

        case 'card-withdrawal':
          return (
            <CardWithdrawal
              amount={pendingWithdrawAmount}
              onBack={() => navigateToScreen('withdraw-amount')}
              onComplete={() => handleTransactionComplete(pendingWithdrawAmount, 'withdraw')}
            />
          );

        case 'ai-chat':
          const primaryGoal = getPrimaryGoal();
          return (
            <AICoach
              user={{
                name: user.name,
                totalSaved: user.totalSaved,
                goal: {
                  name: primaryGoal?.name || 'No Goal Set',
                  amount: primaryGoal?.targetAmount || 0,
                  saved: primaryGoal?.currentAmount || 0
                },
                streak: user.gamificationStats.streak,
                level: user.gamificationStats.level,
                goals: user.goals,
                bills: user.bills,
                monthlyBudget: user.monthlyBudget
              }}
              onBack={() => navigateToScreen('dashboard')}
            />
          );

        case 'bill-scanner':
          return (
            <BillScanner
              onBack={() => navigateToScreen('dashboard')}
              onBillScanned={addBill}
              existingBills={user.bills || []}
              monthlyBudget={user.monthlyBudget}
            />
          );

        case 'budget-alerts':
          return (
            <BudgetAlerts
              alerts={user.budgetAlerts || []}
              alertSettings={user.budgetAlertSettings || defaultBudgetAlertSettings}
              monthlyBudget={user.monthlyBudget || 5000}
              currentSpending={getCurrentSpending()}
              onBack={() => navigateToScreen('dashboard')}
              onUpdateSettings={updateBudgetAlertSettings}
              onMarkAsRead={markAlertAsRead}
              onDeleteAlert={deleteAlert}
              onClearAllAlerts={clearAllAlerts}
            />
          );
      
        case 'settings':
          return (
            <Settings
              user={{ 
                name: user.name,
                phoneNumber: user.phoneNumber,
                biometricEnabled: user.biometricEnabled
              }}
              onBack={() => navigateToScreen('dashboard')}
              onLogout={resetApp}
              onBiometricToggle={handleBiometricToggle}
              onRecoverySetup={() => navigateToScreen('recovery-setup')}
            />
          );
      
        default:
          return (
            <Dashboard
              user={user}
              userStokvels={userStokvels}
              onDeposit={() => navigateToScreen('deposit-options')}
              onWithdraw={() => navigateToScreen('withdraw-options')}
              onSettings={() => navigateToScreen('settings')}
              onAIChat={() => navigateToScreen('ai-chat')}
              onStokvels={() => navigateToScreen('stokvel-landing')}
              onGoalsManagement={() => navigateToScreen('goals-management')}
              onAchievements={() => navigateToScreen('achievements')}
              onBillScanner={() => navigateToScreen('bill-scanner')}
              onBudgetAlerts={() => navigateToScreen('budget-alerts')}
            />
          );
      }
    } catch (error) {
      console.error('Error rendering screen:', error);
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-6">
            <h1 className="text-xl font-medium mb-4 text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">Please try refreshing the page</p>
            <button 
              onClick={() => navigateToScreen('dashboard')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground font-normal transition-colors duration-300">
      <CSSReset />
      {renderContent()}
      
      {/* Budget Monitor - runs in background when user is logged in */}
      {user.phoneNumber && (user.budgetAlertSettings?.enableAlerts ?? defaultBudgetAlertSettings.enableAlerts) && (
        <BudgetMonitor
          userId={user.phoneNumber}
          monthlyBudget={user.monthlyBudget || 5000}
          bills={user.bills || []}
          onAlertGenerated={addBudgetAlert}
          alertSettings={user.budgetAlertSettings || defaultBudgetAlertSettings}
        />
      )}
      
      <Toaster 
        position="top-center"
        expand={false}
        richColors
        closeButton
      />
      
      {/* Achievement Celebration Modal */}
      {celebratingAchievement && (
        <BadgeCelebration
          achievement={celebratingAchievement}
          onClose={() => setCelebratingAchievement(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
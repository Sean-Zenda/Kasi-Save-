import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from './LanguageContext';
import { AlertTriangle, TrendingUp, Target, DollarSign } from 'lucide-react';

export interface BudgetAlert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  category: string;
  message: string;
  threshold: number;
  currentSpending: number;
  budgetLimit: number;
  timestamp: Date;
  isRead: boolean;
}

export interface BudgetAlertSettings {
  enableAlerts: boolean;
  warningThreshold: number; // Percentage (e.g., 80%)
  dangerThreshold: number; // Percentage (e.g., 100%)
  dailyAlerts: boolean;
  weeklyAlerts: boolean;
  monthlyAlerts: boolean;
  categoryAlerts: boolean;
  smartPatternAlerts: boolean;
}

interface BudgetMonitorProps {
  userId: string;
  monthlyBudget: number;
  bills: any[];
  onAlertGenerated: (alert: BudgetAlert) => void;
  alertSettings: BudgetAlertSettings;
}

export function BudgetMonitor({ 
  userId, 
  monthlyBudget, 
  bills, 
  onAlertGenerated,
  alertSettings 
}: BudgetMonitorProps) {
  const { t } = useLanguage();
  const [lastAlertCheck, setLastAlertCheck] = useState<Date>(new Date());
  const [generatedAlerts, setGeneratedAlerts] = useState<Set<string>>(new Set());

  // Calculate spending by category and period
  const calculateSpending = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const monthlySpending = bills
      .filter(bill => new Date(bill.date) >= startOfMonth)
      .reduce((sum, bill) => sum + bill.amount, 0);

    const weeklySpending = bills
      .filter(bill => new Date(bill.date) >= startOfWeek)
      .reduce((sum, bill) => sum + bill.amount, 0);

    const dailySpending = bills
      .filter(bill => new Date(bill.date) >= startOfDay)
      .reduce((sum, bill) => sum + bill.amount, 0);

    // Category spending (monthly)
    const categorySpending = bills
      .filter(bill => new Date(bill.date) >= startOfMonth)
      .reduce((acc, bill) => {
        acc[bill.category] = (acc[bill.category] || 0) + bill.amount;
        return acc;
      }, {} as Record<string, number>);

    return {
      monthly: monthlySpending,
      weekly: weeklySpending,
      daily: dailySpending,
      categories: categorySpending
    };
  };

  // Generate budget alerts based on spending patterns
  const generateBudgetAlerts = () => {
    if (!alertSettings.enableAlerts || monthlyBudget <= 0) return;

    const spending = calculateSpending();
    const newAlerts: BudgetAlert[] = [];

    // Monthly budget alerts
    if (alertSettings.monthlyAlerts) {
      const monthlyPercentage = (spending.monthly / monthlyBudget) * 100;
      const alertKey = `monthly-${Math.floor(monthlyPercentage / 10) * 10}`;

      if (monthlyPercentage >= alertSettings.dangerThreshold && !generatedAlerts.has(`${alertKey}-danger`)) {
        newAlerts.push({
          id: `monthly-danger-${Date.now()}`,
          type: 'danger',
          category: 'monthly',
          message: `You've exceeded your monthly budget! Spent R${spending.monthly.toLocaleString()} of R${monthlyBudget.toLocaleString()} (${monthlyPercentage.toFixed(1)}%)`,
          threshold: alertSettings.dangerThreshold,
          currentSpending: spending.monthly,
          budgetLimit: monthlyBudget,
          timestamp: new Date(),
          isRead: false
        });
        setGeneratedAlerts(prev => new Set([...prev, `${alertKey}-danger`]));
      } else if (monthlyPercentage >= alertSettings.warningThreshold && !generatedAlerts.has(`${alertKey}-warning`)) {
        newAlerts.push({
          id: `monthly-warning-${Date.now()}`,
          type: 'warning',
          category: 'monthly',
          message: `You're approaching your monthly budget limit. Spent R${spending.monthly.toLocaleString()} of R${monthlyBudget.toLocaleString()} (${monthlyPercentage.toFixed(1)}%)`,
          threshold: alertSettings.warningThreshold,
          currentSpending: spending.monthly,
          budgetLimit: monthlyBudget,
          timestamp: new Date(),
          isRead: false
        });
        setGeneratedAlerts(prev => new Set([...prev, `${alertKey}-warning`]));
      }
    }

    // Category budget alerts
    if (alertSettings.categoryAlerts) {
      const categoryBudgets = {
        'Food & Dining': monthlyBudget * 0.3,
        'Transportation': monthlyBudget * 0.15,
        'Shopping': monthlyBudget * 0.2,
        'Utilities': monthlyBudget * 0.15,
        'Entertainment': monthlyBudget * 0.1,
        'Healthcare': monthlyBudget * 0.1
      };

      Object.entries(spending.categories).forEach(([category, spent]) => {
        const categoryBudget = categoryBudgets[category as keyof typeof categoryBudgets];
        if (!categoryBudget) return;

        const categoryPercentage = (spent / categoryBudget) * 100;
        const alertKey = `category-${category}-${Math.floor(categoryPercentage / 25) * 25}`;

        if (categoryPercentage >= 100 && !generatedAlerts.has(`${alertKey}-danger`)) {
          newAlerts.push({
            id: `category-danger-${category}-${Date.now()}`,
            type: 'danger',
            category,
            message: `You've exceeded your ${category} budget! Spent R${spent.toLocaleString()} of R${categoryBudget.toLocaleString()}`,
            threshold: 100,
            currentSpending: spent,
            budgetLimit: categoryBudget,
            timestamp: new Date(),
            isRead: false
          });
          setGeneratedAlerts(prev => new Set([...prev, `${alertKey}-danger`]));
        } else if (categoryPercentage >= 75 && !generatedAlerts.has(`${alertKey}-warning`)) {
          newAlerts.push({
            id: `category-warning-${category}-${Date.now()}`,
            type: 'warning',
            category,
            message: `High spending in ${category}: R${spent.toLocaleString()} of R${categoryBudget.toLocaleString()} (${categoryPercentage.toFixed(1)}%)`,
            threshold: 75,
            currentSpending: spent,
            budgetLimit: categoryBudget,
            timestamp: new Date(),
            isRead: false
          });
          setGeneratedAlerts(prev => new Set([...prev, `${alertKey}-warning`]));
        }
      });
    }

    // Smart pattern alerts
    if (alertSettings.smartPatternAlerts) {
      const dailyAverage = spending.monthly / new Date().getDate();
      const projectedMonthlySpending = dailyAverage * 30;

      if (projectedMonthlySpending > monthlyBudget * 1.2 && !generatedAlerts.has('projection-warning')) {
        newAlerts.push({
          id: `projection-warning-${Date.now()}`,
          type: 'warning',
          category: 'projection',
          message: `At your current spending pace, you'll exceed your monthly budget by R${(projectedMonthlySpending - monthlyBudget).toLocaleString()}`,
          threshold: 120,
          currentSpending: projectedMonthlySpending,
          budgetLimit: monthlyBudget,
          timestamp: new Date(),
          isRead: false
        });
        setGeneratedAlerts(prev => new Set([...prev, 'projection-warning']));
      }

      // Unusual spending pattern
      const recentDaysSpending = bills
        .filter(bill => {
          const billDate = new Date(bill.date);
          const daysDiff = (new Date().getTime() - billDate.getTime()) / (1000 * 3600 * 24);
          return daysDiff <= 3;
        })
        .reduce((sum, bill) => sum + bill.amount, 0);

      if (recentDaysSpending > dailyAverage * 5 && !generatedAlerts.has('unusual-spending')) {
        newAlerts.push({
          id: `unusual-spending-${Date.now()}`,
          type: 'info',
          category: 'pattern',
          message: `Unusual spending detected: R${recentDaysSpending.toLocaleString()} in the last 3 days (avg: R${dailyAverage.toFixed(0)}/day)`,
          threshold: 500,
          currentSpending: recentDaysSpending,
          budgetLimit: dailyAverage * 3,
          timestamp: new Date(),
          isRead: false
        });
        setGeneratedAlerts(prev => new Set([...prev, 'unusual-spending']));
      }
    }

    // Weekly milestone alerts
    if (alertSettings.weeklyAlerts) {
      const weeklyBudget = monthlyBudget * 0.25; // Assuming 4 weeks per month
      const weeklyPercentage = (spending.weekly / weeklyBudget) * 100;

      if (weeklyPercentage >= 100 && !generatedAlerts.has('weekly-exceeded')) {
        newAlerts.push({
          id: `weekly-exceeded-${Date.now()}`,
          type: 'warning',
          category: 'weekly',
          message: `Weekly spending limit reached: R${spending.weekly.toLocaleString()} of R${weeklyBudget.toLocaleString()}`,
          threshold: 100,
          currentSpending: spending.weekly,
          budgetLimit: weeklyBudget,
          timestamp: new Date(),
          isRead: false
        });
        setGeneratedAlerts(prev => new Set([...prev, 'weekly-exceeded']));
      }
    }

    // Generate success alerts for good spending behavior
    const monthlyPercentage = (spending.monthly / monthlyBudget) * 100;
    const daysInMonth = new Date().getDate();
    const expectedSpendingPercentage = (daysInMonth / 30) * 100;

    if (monthlyPercentage < expectedSpendingPercentage * 0.8 && daysInMonth >= 15 && !generatedAlerts.has('good-spending')) {
      newAlerts.push({
        id: `good-spending-${Date.now()}`,
        type: 'success',
        category: 'achievement',
        message: `Great job! You're under budget by R${(monthlyBudget * (expectedSpendingPercentage / 100) - spending.monthly).toLocaleString()} this month!`,
        threshold: 80,
        currentSpending: spending.monthly,
        budgetLimit: monthlyBudget,
        timestamp: new Date(),
        isRead: false
      });
      setGeneratedAlerts(prev => new Set([...prev, 'good-spending']));
    }

    // Send alerts
    newAlerts.forEach(alert => {
      onAlertGenerated(alert);
      
      // Show toast notifications
      const icon = alert.type === 'danger' ? '🚨' : 
                   alert.type === 'warning' ? '⚠️' : 
                   alert.type === 'success' ? '🎉' : 'ℹ️';

      if (alert.type === 'danger') {
        toast.error(`${icon} ${alert.message}`, {
          duration: 8000,
          action: {
            label: 'View Budget',
            onClick: () => {
              // This would navigate to budget management
            }
          }
        });
      } else if (alert.type === 'warning') {
        toast.warning(`${icon} ${alert.message}`, {
          duration: 6000
        });
      } else if (alert.type === 'success') {
        toast.success(`${icon} ${alert.message}`, {
          duration: 5000
        });
      } else {
        toast.info(`${icon} ${alert.message}`, {
          duration: 4000
        });
      }
    });
  };

  // Monitor budget on component mount and when bills change
  useEffect(() => {
    const checkBudget = () => {
      generateBudgetAlerts();
      setLastAlertCheck(new Date());
    };

    // Initial check
    checkBudget();

    // Set up periodic checks (every 5 minutes)
    const interval = setInterval(checkBudget, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [bills, monthlyBudget, alertSettings]);

  // Reset generated alerts at the start of each month
  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    if (lastAlertCheck < startOfMonth) {
      setGeneratedAlerts(new Set());
    }
  }, [lastAlertCheck]);

  return null; // This is a monitoring component, no UI
}

export default BudgetMonitor;
import { ArrowUpRight, ArrowDownLeft, Users, Calendar, CreditCard, Smartphone, Building2, Receipt } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageContext';
import { Transaction } from '../navigation/AppNavigator';

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

export const TransactionList = ({ transactions, limit }: TransactionListProps) => {
  const { t } = useLanguage();
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.type === 'deposit') {
      return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    } else if (transaction.type === 'withdraw') {
      return <ArrowDownLeft className="w-4 h-4 text-red-500" />;
    } else if (transaction.type === 'stokvel-contribution') {
      return <Users className="w-4 h-4 text-primary" />;
    }
    return <CreditCard className="w-4 h-4 text-muted-foreground" />;
  };

  const getMethodIcon = (method?: string) => {
    if (!method) return null;
    
    switch (method.toLowerCase()) {
      case 'ewallet':
        return <Smartphone className="w-3 h-3" />;
      case 'mtn money':
        return <Smartphone className="w-3 h-3" />;
      case 'payment voucher':
        return <Receipt className="w-3 h-3" />;
      case 'cash send':
        return <Building2 className="w-3 h-3" />;
      default:
        return <CreditCard className="w-3 h-3" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
      case 'withdraw':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      case 'stokvel-contribution':
        return 'text-primary bg-primary/10';
      default:
        return 'text-muted-foreground bg-muted/50';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return t('time.today');
    } else if (diffDays === 2) {
      return t('time.yesterday');
    } else if (diffDays <= 7) {
      return t('time.days_ago', { count: diffDays - 1 });
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return t('time.week_ago', { count: weeks, s: weeks > 1 ? 's' : '' });
    } else {
      return date.toLocaleDateString('en-ZA', { 
        day: 'numeric', 
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (!displayTransactions || displayTransactions.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground py-8">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium mb-1">{t('dashboard.no_transactions')}</p>
          <p className="text-sm">{t('dashboard.transaction_history')}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {displayTransactions.map((transaction) => (
        <Card key={transaction.id} className="p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-4">
            {/* Transaction Icon */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
              {getTransactionIcon(transaction)}
            </div>

            {/* Transaction Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {transaction.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.date)}
                    </p>
                    
                    {transaction.method && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          {getMethodIcon(transaction.method)}
                          <span>{transaction.method}</span>
                        </div>
                      </>
                    )}
                    
                    {transaction.stokveLName && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.stokveLName}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                  <p className={`font-medium ${
                    transaction.type === 'deposit' || transaction.type === 'stokvel-contribution'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'withdraw' ? '-' : '+'}R {transaction.amount.toLocaleString()}
                  </p>
                  
                  {transaction.status !== 'completed' && (
                    <Badge 
                      variant={transaction.status === 'pending' ? 'secondary' : 'destructive'}
                      className="text-xs mt-1"
                    >
                      {transaction.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
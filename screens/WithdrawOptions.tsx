import { ArrowLeft, Banknote, CreditCard, Receipt, Building, Smartphone, QrCode } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

interface WithdrawOptionsProps {
  onBack: () => void;
  onSelectMethod: (method: string) => void;
}

export const WithdrawOptions = ({ onBack, onSelectMethod }: WithdrawOptionsProps) => {
  const withdrawMethods = [
    {
      id: 'redeemable-voucher',
      name: 'Generate Voucher',
      description: 'Get cash at Shoprite, Spar, Pick n Pay',
      icon: Receipt,
      popular: true,
      instant: true,
      fee: 'R5'
    },
    {
      id: 'bank-account',
      name: 'Bank Account',
      description: 'Transfer to your bank account',
      icon: Building,
      popular: true,
      instant: false,
      fee: 'Free'
    },
    {
      id: 'ewallet-withdraw',
      name: 'eWallet',
      description: 'Withdraw to FNB eWallet',
      icon: Smartphone,
      popular: true,
      instant: true,
      fee: 'R2'
    },
    {
      id: 'link-card',
      name: 'Linked Card',
      description: 'Withdraw to your linked debit card',
      icon: CreditCard,
      popular: false,
      instant: true,
      fee: 'R3'
    },
    {
      id: 'cash-send',
      name: 'Cash Send',
      description: 'FNB Cash Send - collect at ATM',
      icon: Banknote,
      popular: false,
      instant: true,
      fee: 'R8'
    },
    {
      id: 'qr-code',
      name: 'QR Code',
      description: 'Generate QR for merchant payments',
      icon: QrCode,
      popular: false,
      instant: true,
      fee: 'Free'
    }
  ];

  const popularMethods = withdrawMethods.filter(method => method.popular);
  const otherMethods = withdrawMethods.filter(method => !method.popular);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-medium">Choose Withdrawal Method</h1>
            <p className="text-sm text-muted-foreground">How would you like to access your money?</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Popular Methods */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Popular Methods</h3>
          <div className="space-y-3">
            {popularMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <Card 
                  key={method.id}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onSelectMethod(method.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{method.name}</h4>
                        {method.instant && (
                          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                            Instant
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                      <p className="text-xs text-muted-foreground">Fee: {method.fee}</p>
                    </div>
                    <div className="w-6 h-6 border border-border rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full opacity-0" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Other Methods */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Other Methods</h3>
          <div className="space-y-3">
            {otherMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <Card 
                  key={method.id}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onSelectMethod(method.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{method.name}</h4>
                        {method.instant && (
                          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                            Instant
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                      <p className="text-xs text-muted-foreground">Fee: {method.fee}</p>
                    </div>
                    <div className="w-6 h-6 border border-border rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full opacity-0" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Withdrawal Limits Info */}
        <div className="bg-muted/20 rounded-lg p-4 mb-4">
          <h4 className="font-medium mb-2 text-foreground">Withdrawal Limits</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Daily limit: R1,000 per method</p>
            <p>• Monthly limit: R10,000 total</p>
            <p>• Vouchers valid for 30 days</p>
            <p>• Bank transfers process within 1-2 business days</p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full"></div>
            </div>
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">Security Notice</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Keep your voucher codes private. Only share QR codes with trusted merchants. 
                Never share your PIN or OTP with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
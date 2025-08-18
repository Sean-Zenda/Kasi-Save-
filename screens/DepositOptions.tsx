import { ArrowLeft, Wallet, Smartphone, Receipt, Banknote } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

interface DepositOptionsProps {
  onBack: () => void;
  onSelectMethod: (method: string) => void;
}

export const DepositOptions = ({ onBack, onSelectMethod }: DepositOptionsProps) => {
  const depositMethods = [
    {
      id: 'ewallet',
      name: 'eWallet',
      description: 'FNB eWallet or similar',
      icon: Wallet,
      popular: true
    },
    {
      id: 'mtn-money',
      name: 'MTN Money',
      description: 'Send money via MTN',
      icon: Smartphone,
      popular: true
    },
    {
      id: 'generate-voucher',
      name: 'Generate Voucher',
      description: 'Pay at Shoprite, Spar, Pick n Pay',
      icon: Receipt,
      popular: true
    },
    {
      id: 'cash-send',
      name: 'Cash Send',
      description: 'FNB Cash Send',
      icon: Banknote,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-medium">Choose Deposit Method</h1>
            <p className="text-sm text-muted-foreground">How would you like to add money?</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Popular Methods */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Popular Methods</h3>
          <div className="space-y-3">
            {depositMethods
              .filter(method => method.popular)
              .map((method) => {
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
                        <h4 className="font-medium text-foreground">{method.name}</h4>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
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
        <div>
          <h3 className="text-lg font-medium mb-4">Other Methods</h3>
          <div className="space-y-3">
            {depositMethods
              .filter(method => !method.popular)
              .map((method) => {
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
                        <h4 className="font-medium text-foreground">{method.name}</h4>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
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

        {/* Info */}
        <div className="mt-8 p-4 bg-muted/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> eWallet and MTN Money are instant and available 24/7. 
            Payment vouchers can be used at over 2000 stores nationwide.
          </p>
        </div>
      </div>
    </div>
  );
};
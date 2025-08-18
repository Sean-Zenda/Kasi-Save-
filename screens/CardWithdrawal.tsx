import { useState } from 'react';
import { ArrowLeft, CreditCard, Plus, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { InputField } from '../components/InputField';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';

interface CardWithdrawalProps {
  amount: number;
  onBack: () => void;
  onComplete: () => void;
}

interface LinkedCard {
  id: string;
  last4: string;
  type: 'visa' | 'mastercard';
  bank: string;
  isDefault: boolean;
}

export const CardWithdrawal = ({ amount, onBack, onComplete }: CardWithdrawalProps) => {
  const [linkedCards, setLinkedCards] = useState<LinkedCard[]>([
    {
      id: '1',
      last4: '4567',
      type: 'visa',
      bank: 'FNB',
      isDefault: true
    }
  ]);
  
  const [selectedCard, setSelectedCard] = useState<string>(linkedCards[0]?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  
  // New card form state
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCVV, setNewCardCVV] = useState('');
  const [newCardName, setNewCardName] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const getCardType = (number: string): 'visa' | 'mastercard' => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'mastercard';
    return 'visa';
  };

  const handleAddCard = async () => {
    if (!newCardNumber || !newCardExpiry || !newCardCVV || !newCardName) {
      toast.error('Please fill in all card details');
      return;
    }

    const cleanedNumber = newCardNumber.replace(/\s/g, '');
    if (cleanedNumber.length !== 16) {
      toast.error('Please enter a valid 16-digit card number');
      return;
    }

    setIsAddingCard(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCard: LinkedCard = {
      id: Date.now().toString(),
      last4: cleanedNumber.slice(-4),
      type: getCardType(cleanedNumber),
      bank: 'Unknown Bank', // In real app, this would be detected
      isDefault: linkedCards.length === 0
    };

    setLinkedCards([...linkedCards, newCard]);
    setSelectedCard(newCard.id);
    
    // Reset form
    setNewCardNumber('');
    setNewCardExpiry('');
    setNewCardCVV('');
    setNewCardName('');
    setIsAddingCard(false);
    
    toast.success('Card added successfully!');
  };

  const handleRemoveCard = (cardId: string) => {
    setLinkedCards(linkedCards.filter(card => card.id !== cardId));
    if (selectedCard === cardId) {
      setSelectedCard(linkedCards.find(card => card.id !== cardId)?.id || '');
    }
    toast.success('Card removed successfully');
  };

  const handleWithdraw = async () => {
    if (!selectedCard) {
      toast.error('Please select a card');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast.success('Withdrawal processed successfully!');
    onComplete();
  };

  const selectedCardData = linkedCards.find(card => card.id === selectedCard);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-medium">Card Withdrawal</h1>
              <p className="text-sm text-muted-foreground">Withdraw R{amount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Amount Summary */}
        <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Withdrawal Amount</p>
              <p className="text-2xl font-medium text-primary">R{amount.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Processing Fee</p>
              <p className="font-medium">R3.00</p>
            </div>
          </div>
        </Card>

        {/* Linked Cards */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Linked Cards</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Card
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Card</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <InputField
                    label="Card Number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={newCardNumber}
                    onChange={(value) => setNewCardNumber(formatCardNumber(value))}
                    maxLength={19}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Expiry Date"
                      type="text"
                      placeholder="MM/YY"
                      value={newCardExpiry}
                      onChange={(value) => setNewCardExpiry(formatExpiry(value))}
                      maxLength={5}
                    />
                    <InputField
                      label="CVV"
                      type="password"
                      placeholder="123"
                      value={newCardCVV}
                      onChange={setNewCardCVV}
                      maxLength={4}
                    />
                  </div>
                  <InputField
                    label="Cardholder Name"
                    type="text"
                    placeholder="John Doe"
                    value={newCardName}
                    onChange={setNewCardName}
                  />
                  <Button 
                    onClick={handleAddCard} 
                    disabled={isAddingCard}
                    className="w-full"
                  >
                    {isAddingCard ? 'Adding Card...' : 'Add Card'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {linkedCards.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No cards linked yet</p>
              <p className="text-sm text-muted-foreground">Add a card to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {linkedCards.map((card) => (
                <div key={card.id} className="relative">
                  <Card 
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedCard === card.id 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedCard(card.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• {card.last4}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {card.type} • {card.bank}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedCard === card.id && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCard(card.id);
                          }}
                          className="w-8 h-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Processing Info */}
        <Card className="p-4 mb-6 bg-muted/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium mb-2">Card Withdrawal Info</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Instant withdrawal to your linked debit card</p>
                <p>• R3.00 processing fee applies</p>
                <p>• Available 24/7</p>
                <p>• Funds available immediately</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleWithdraw}
          disabled={!selectedCard || linkedCards.length === 0 || isProcessing}
          className="w-full h-14 text-lg"
        >
          {isProcessing ? (
            'Processing Withdrawal...'
          ) : selectedCardData ? (
            `Withdraw R${amount.toFixed(2)} to •••• ${selectedCardData.last4}`
          ) : (
            'Select a Card to Continue'
          )}
        </Button>

        {/* Security Notice */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Your card details are encrypted and processed securely. We never store your full card number.
        </p>
      </div>
    </div>
  );
};
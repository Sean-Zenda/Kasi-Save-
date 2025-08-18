import { useState } from 'react';
import { ArrowLeft, Receipt, Copy, Share2, MapPin, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { useLanguage } from '../components/LanguageContext';

interface VoucherGenerationProps {
  amount: number;
  onBack: () => void;
  onComplete: () => void;
}

export const VoucherGeneration = ({ amount, onBack, onComplete }: VoucherGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [voucherGenerated, setVoucherGenerated] = useState(false);
  const { t } = useLanguage();
  
  // Generate a realistic voucher code
  const voucherCode = `KS${Date.now().toString().slice(-8)}`;
  const referenceNumber = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now

  const retailers = [
    { name: 'Shoprite', logo: '🛒' },
    { name: 'Spar', logo: '🏪' },
    { name: 'Pick n Pay', logo: '🛍️' }
  ];

  const handleGenerateVoucher = async () => {
    setIsGenerating(true);
    
    // Simulate voucher generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setVoucherGenerated(true);
    setIsGenerating(false);
    toast.success(t('voucher.deposit.generated') || 'Payment voucher generated successfully!');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(voucherCode);
    toast.success(t('voucher.code_copied') || 'Voucher code copied to clipboard');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'KasiSave Payment Voucher',
        text: `Payment voucher code: ${voucherCode}\nAmount: R${amount}\nValid until: ${expiryDate.toLocaleDateString()}`
      });
    } else {
      handleCopyCode();
    }
  };

  const handleComplete = () => {
    onComplete();
    toast.success(t('voucher.deposit.keep_safe') || 'Keep your voucher safe until payment is made at the store!');
  };

  const handleCancelVoucher = () => {
    if (voucherGenerated) {
      // Show confirmation for generated voucher
      if (window.confirm(t('voucher.cancel.confirm_generated') || 'Are you sure you want to cancel this voucher? It will become invalid.')) {
        onBack();
        toast.info(t('voucher.cancelled') || 'Voucher cancelled');
      }
    } else {
      // Cancel before generation
      onBack();
      toast.info(t('voucher.deposit.cancelled') || 'Payment voucher cancelled');
    }
  };

  if (!voucherGenerated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Receipt className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-medium">
                  {t('voucher.deposit.title') || 'Generate Payment Voucher'}
                </h1>
                <p className="text-sm text-muted-foreground">R {amount.toLocaleString()}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleCancelVoucher}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Amount Summary */}
          <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                {t('voucher.amount') || 'Voucher Amount'}
              </p>
              <p className="text-2xl font-medium text-primary">R {amount.toLocaleString()}</p>
            </div>
          </Card>

          {/* Retailers */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">
              {t('voucher.deposit.pay_at_stores') || 'Pay at any of these stores:'}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {retailers.map((retailer) => (
                <div key={retailer.name} className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl mb-2">{retailer.logo}</div>
                  <p className="text-sm font-medium">{retailer.name}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* How it works */}
          <Card className="p-4 mb-6 bg-muted/20">
            <h4 className="font-medium mb-2">
              {t('voucher.deposit.how_it_works') || 'How payment vouchers work:'}
            </h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{t('voucher.deposit.step_1') || '1. Generate your payment voucher with a unique code'}</p>
              <p>{t('voucher.deposit.step_2') || '2. Visit any Shoprite, Spar, or Pick n Pay store'}</p>
              <p>{t('voucher.deposit.step_3') || '3. Give the cashier your voucher code and cash'}</p>
              <p>{t('voucher.deposit.step_4') || '4. Money is instantly added to your KasiSave account'}</p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGenerateVoucher}
              disabled={isGenerating}
              className="w-full h-14 text-lg"
            >
              {isGenerating ? (
                t('voucher.generating') || 'Generating voucher...'
              ) : (
                t('voucher.deposit.generate') || 'Generate Payment Voucher'
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleCancelVoucher}
              className="w-full text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              {t('cancel') || 'Cancel Voucher'}
            </Button>
          </div>

          {/* Info */}
          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>{t('voucher.expires_30_days') || 'Vouchers expire after 30 days'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Receipt className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-medium">
                {t('voucher.deposit.ready_title') || 'Payment Voucher'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('voucher.ready_to_use') || 'Ready to use'}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleCancelVoucher}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Success Message */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Receipt className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-medium mb-1">
            {t('voucher.deposit.success_title') || 'Voucher Generated!'}
          </h2>
          <p className="text-muted-foreground">
            {t('voucher.deposit.success_subtitle') || 'Take this voucher to any participating store'}
          </p>
        </div>

        {/* Voucher Card */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="text-center mb-6">
            <Badge variant="secondary" className="mb-3">KasiSave Payment Voucher</Badge>
            <p className="text-3xl font-bold text-primary mb-2">{voucherCode}</p>
            <p className="text-lg font-medium mb-1">R {amount.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">
              {t('voucher.expires') || 'Expires'}: {expiryDate.toLocaleDateString('en-ZA')}
            </p>
          </div>
          
          <div className="border-t border-primary/20 pt-4">
            <p className="text-xs text-muted-foreground text-center mb-2">
              {t('voucher.reference_number') || 'Reference Number'}
            </p>
            <p className="text-center font-mono text-sm">{referenceNumber}</p>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button variant="outline" onClick={handleCopyCode} className="flex items-center gap-2">
            <Copy className="w-4 h-4" />
            {t('voucher.copy_code') || 'Copy Code'}
          </Button>
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            {t('share') || 'Share'}
          </Button>
        </div>

        {/* Store Locations */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-primary" />
            <h4 className="font-medium">
              {t('voucher.where_to_pay') || 'Where to pay:'}
            </h4>
          </div>
          <div className="space-y-2">
            {retailers.map((retailer) => (
              <div key={retailer.name} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                <span className="text-lg">{retailer.logo}</span>
                <span className="font-medium">{retailer.name}</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {t('voucher.stores_count') || '2000+ stores'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-4 mb-6 bg-muted/20">
          <h4 className="font-medium mb-2">
            {t('voucher.deposit.at_store') || 'At the store:'}
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{t('voucher.deposit.store_step_1') || '1. Show this voucher code to the cashier'}</p>
            <p>{t('voucher.deposit.store_step_2', { amount: amount.toLocaleString() }) || `2. Pay the exact amount in cash (R${amount.toLocaleString()})`}</p>
            <p>{t('voucher.deposit.store_step_3') || '3. Keep your receipt until money reflects'}</p>
            <p>{t('voucher.deposit.store_step_4') || '4. Money appears in your account within 5 minutes'}</p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={handleComplete} className="w-full h-14 text-lg">
            {t('voucher.got_it') || 'Got it - Take me back'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleCancelVoucher}
            className="w-full text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            {t('voucher.cancel') || 'Cancel Voucher'}
          </Button>
        </div>

        {/* Important Note */}
        <div className="text-center text-xs text-muted-foreground mt-4">
          <p>⚠️ {t('voucher.keep_safe') || 'Keep this voucher safe until payment is complete'}</p>
        </div>
      </div>
    </div>
  );
};
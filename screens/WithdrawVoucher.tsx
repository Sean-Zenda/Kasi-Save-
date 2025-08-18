import { useState, useEffect } from 'react';
import { ArrowLeft, Receipt, Copy, Download, Share, QrCode, MapPin, Clock, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { useLanguage } from '../components/LanguageContext';

interface WithdrawVoucherProps {
  amount: number;
  onBack: () => void;
  onComplete: () => void;
}

export const WithdrawVoucher = ({ amount, onBack, onComplete }: WithdrawVoucherProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [voucher, setVoucher] = useState<{
    code: string;
    pin: string;
    reference: string;
    expiryDate: string;
    qrCode: string;
  } | null>(null);
  const { t } = useLanguage();

  const generateVoucher = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate voucher data
    const code = Math.random().toString(36).substr(2, 8).toUpperCase();
    const pin = Math.random().toString().substr(2, 6);
    const reference = `KS${Date.now().toString().substr(-6)}`;
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
    
    setVoucher({
      code,
      pin,
      reference,
      expiryDate,
      qrCode: `KS-${code}-${pin}` // Simplified QR data
    });
    
    setIsGenerating(false);
    toast.success(t('voucher.withdraw.generated') || 'Voucher generated successfully!');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('voucher.copied', { item: label }) || `${label} copied to clipboard`);
  };

  const shareVoucher = () => {
    if (!voucher) return;
    
    const shareText = `KasiSave Withdrawal Voucher
Amount: R${amount.toFixed(2)}
Code: ${voucher.code}
PIN: ${voucher.pin}
Reference: ${voucher.reference}
Valid until: ${voucher.expiryDate}

Present this at any participating store to withdraw cash.`;

    if (navigator.share) {
      navigator.share({
        title: 'KasiSave Withdrawal Voucher',
        text: shareText
      });
    } else {
      copyToClipboard(shareText, t('voucher.details') || 'Voucher details');
    }
  };

  const handleCancelVoucher = () => {
    if (voucher) {
      // Show confirmation for generated voucher
      if (window.confirm(t('voucher.cancel.confirm_generated') || 'Are you sure you want to cancel this voucher? It will become invalid and your money will be returned to your account.')) {
        onBack();
        toast.info(t('voucher.cancelled_refunded') || 'Voucher cancelled - money returned to your account');
      }
    } else {
      // Cancel during generation
      onBack();
      toast.info(t('voucher.withdraw.cancelled') || 'Withdrawal voucher cancelled');
    }
  };

  const stores = [
    { name: 'Shoprite', distance: '0.8 km' },
    { name: 'Pick n Pay', distance: '1.2 km' },
    { name: 'Spar', distance: '1.5 km' },
    { name: 'Checkers', distance: '2.1 km' }
  ];

  useEffect(() => {
    generateVoucher();
  }, []);

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header with cancel option */}
        <div className="bg-card p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
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
        
        <div className="flex items-center justify-center flex-1 p-6" style={{ minHeight: 'calc(100vh - 100px)' }}>
          <Card className="p-8 max-w-sm mx-4 text-center">
            <Receipt className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-medium mb-2">
              {t('voucher.withdraw.generating_title') || 'Generating Your Voucher'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('voucher.withdraw.generating_subtitle') || 'Please wait while we create your withdrawal voucher...'}
            </p>
            <Button 
              variant="outline" 
              onClick={handleCancelVoucher}
              className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              {t('cancel') || 'Cancel'}
            </Button>
          </Card>
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
            <Receipt className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-medium">
                {t('voucher.withdraw.title') || 'Withdrawal Voucher'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('voucher.withdraw.subtitle') || 'Present at participating stores'}
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
        {voucher && (
          <>
            {/* Voucher Card */}
            <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-medium text-primary mb-2">R{amount.toFixed(2)}</h2>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {t('voucher.valid_until') || 'Valid until'} {voucher.expiryDate}
                </Badge>
              </div>

              {/* Voucher Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('voucher.code') || 'Voucher Code'}
                    </p>
                    <p className="font-mono text-lg font-medium">{voucher.code}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(voucher.code, t('voucher.code') || 'Voucher code')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">PIN</p>
                    <p className="font-mono text-lg font-medium">{voucher.pin}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(voucher.pin, 'PIN')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('voucher.reference') || 'Reference'}
                    </p>
                    <p className="font-mono text-lg font-medium">{voucher.reference}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(voucher.reference, t('voucher.reference') || 'Reference')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="mt-6 text-center">
                <div className="w-32 h-32 bg-background border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-16 h-16 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('voucher.qr_code_instruction') || 'Show this QR code at the store for faster processing'}
                </p>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button variant="outline" onClick={shareVoucher}>
                <Share className="w-4 h-4 mr-2" />
                {t('share') || 'Share'}
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Download className="w-4 h-4 mr-2" />
                {t('print') || 'Print'}
              </Button>
            </div>

            {/* Instructions */}
            <Card className="p-4 mb-6">
              <h4 className="font-medium mb-3">
                {t('voucher.withdraw.instructions') || 'How to use your voucher:'}
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-medium mt-0.5">
                    1
                  </div>
                  <p>{t('voucher.withdraw.step_1') || 'Go to any participating store (Shoprite, Pick n Pay, Spar, Checkers)'}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-medium mt-0.5">
                    2
                  </div>
                  <p>{t('voucher.withdraw.step_2') || 'Show this voucher to the cashier or scan the QR code'}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-medium mt-0.5">
                    3
                  </div>
                  <p>{t('voucher.withdraw.step_3') || 'Provide your voucher code and PIN when requested'}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-medium mt-0.5">
                    4
                  </div>
                  <p>{t('voucher.withdraw.step_4', { amount: amount.toFixed(2) }) || `Collect your cash (R${amount.toFixed(2)}) from the cashier`}</p>
                </div>
              </div>
            </Card>

            {/* Nearby Stores */}
            <Card className="p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-primary" />
                <h4 className="font-medium">
                  {t('voucher.nearby_stores') || 'Nearby Participating Stores'}
                </h4>
              </div>
              <div className="space-y-2">
                {stores.map((store, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                    <span className="font-medium">{store.name}</span>
                    <span className="text-sm text-muted-foreground">{store.distance}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Important Notice */}
            <Card className="p-4 mb-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                    {t('important') || 'Important'}
                  </h4>
                  <div className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <p>• {t('voucher.keep_secure') || 'Keep your voucher code and PIN secure'}</p>
                    <p>• {t('voucher.expires_on', { date: voucher.expiryDate }) || `Voucher expires on ${voucher.expiryDate}`}</p>
                    <p>• {t('voucher.processing_fee') || 'R5.00 processing fee already deducted'}</p>
                    <p>• {t('voucher.single_use') || 'Cash can only be collected once'}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={onComplete} className="w-full h-14 text-lg">
                {t('done') || 'Done'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleCancelVoucher}
                className="w-full text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                {t('voucher.cancel') || 'Cancel Voucher'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
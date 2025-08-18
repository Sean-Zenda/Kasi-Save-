import { useState } from 'react';
import { ArrowLeft, Shield, Users, FileText, AlertTriangle, CheckCircle, Copy, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { InputField } from '../components/InputField';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Checkbox } from '../components/ui/checkbox';
import { QuickLanguageSwitch } from '../components/LanguageSelector';
import { ThemeToggle } from '../components/ThemeToggle';
import { useLanguage } from '../components/LanguageContext';
import { toast } from 'sonner';

interface RecoverySetupProps {
  onBack: () => void;
  onComplete: (recoveryData: RecoveryData) => void;
  isOnboarding?: boolean;
}

import type { RecoveryData } from '../App';

export const RecoverySetup = ({ onBack, onComplete, isOnboarding = false }: RecoverySetupProps) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<'intro' | 'emergency-code' | 'additional' | 'confirm'>('intro');
  const [emergencyCode] = useState(() => generateEmergencyCode());
  const [hasDownloadedCode, setHasDownloadedCode] = useState(false);
  const [hasCopiedCode, setHasCopiedCode] = useState(false);
  
  // Optional recovery methods
  const [enableIdVerification, setEnableIdVerification] = useState(false);
  const [enableTrustedContact, setEnableTrustedContact] = useState(false);
  const [enableSecurityQuestions, setEnableSecurityQuestions] = useState(false);
  
  // Form data
  const [idNumber, setIdNumber] = useState('');
  const [trustedContact, setTrustedContact] = useState({
    name: '',
    phone: '',
    relationship: 'family'
  });
  const [securityQuestions, setSecurityQuestions] = useState({
    birthPlace: '',
    motherMaidenName: '',
    firstPet: ''
  });

  function generateEmergencyCode(): string {
    // Generate a secure 8-character code
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(emergencyCode);
      setHasCopiedCode(true);
      toast.success(t('recovery.setup.code_copied') || 'Recovery code copied to clipboard!');
    } catch (error) {
      toast.error(t('recovery.setup.copy_failed') || 'Failed to copy code');
    }
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([
      `KasiSave Emergency Recovery Code\n\n` +
      `Code: ${emergencyCode}\n\n` +
      `Date Generated: ${new Date().toLocaleDateString()}\n\n` +
      `Instructions:\n` +
      `1. Keep this code safe and secure\n` +
      `2. Use this code if you lose access to your phone\n` +
      `3. Do not share this code with anyone\n` +
      `4. This code can only be used once\n\n` +
      `For account recovery, visit the KasiSave app and select "Lost Phone Number"`
    ], { type: 'text/plain' });
    
    element.href = URL.createObjectURL(file);
    element.download = `kasave-recovery-code-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setHasDownloadedCode(true);
    toast.success(t('recovery.setup.code_downloaded') || 'Recovery code downloaded!');
  };

  const validateForm = () => {
    if (enableIdVerification && !idNumber) return false;
    if (enableTrustedContact && (!trustedContact.name || !trustedContact.phone)) return false;
    if (enableSecurityQuestions && (!securityQuestions.birthPlace || !securityQuestions.motherMaidenName)) return false;
    return true;
  };

  const handleComplete = () => {
    const recoveryData: RecoveryData = {
      emergencyCode,
      ...(enableIdVerification && { idNumber }),
      ...(enableTrustedContact && { trustedContact }),
      ...(enableSecurityQuestions && { securityQuestions })
    };
    
    onComplete(recoveryData);
  };

  const renderIntro = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-medium mb-2">
          {t('recovery.setup.intro.title') || 'Secure Your Account'}
        </h2>
        <p className="text-muted-foreground">
          {t('recovery.setup.intro.subtitle') || 
           'Set up recovery methods to regain access if you lose your phone number'}
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {t('recovery.setup.intro.warning') || 
           'Recovery methods are important for account security. We recommend setting up at least one additional method.'}
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-medium mb-1">
                {t('recovery.setup.emergency_code.title') || 'Emergency Recovery Code'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('recovery.setup.emergency_code.description') || 
                 'A unique code that allows you to recover your account'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-muted-foreground mt-1" />
            <div>
              <h3 className="font-medium mb-1">
                {t('recovery.setup.additional.title') || 'Additional Methods (Optional)'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('recovery.setup.additional.description') || 
                 'ID verification, trusted contacts, and security questions'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Button onClick={() => setStep('emergency-code')} className="w-full">
        {t('recovery.setup.get_started') || 'Get Started'}
      </Button>
    </div>
  );

  const renderEmergencyCode = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-2">
          {t('recovery.setup.emergency_code.save_title') || 'Save Your Recovery Code'}
        </h2>
        <p className="text-muted-foreground">
          {t('recovery.setup.emergency_code.save_subtitle') || 
           'Write down or save this code in a safe place. You\'ll need it to recover your account.'}
        </p>
      </div>

      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {t('recovery.setup.emergency_code.label') || 'Your Emergency Recovery Code'}
          </p>
          <div className="text-3xl font-mono font-medium tracking-wider text-primary mb-4">
            {emergencyCode}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              {hasCopiedCode ? (t('recovery.setup.copied') || 'Copied!') : (t('recovery.setup.copy') || 'Copy')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCode}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              {hasDownloadedCode ? (t('recovery.setup.downloaded') || 'Downloaded!') : (t('recovery.setup.download') || 'Download')}
            </Button>
          </div>
        </div>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>{t('recovery.setup.emergency_code.important') || 'Important:'}</strong>
          <ul className="mt-1 ml-4 list-disc text-sm">
            <li>{t('recovery.setup.emergency_code.rule1') || 'Keep this code private and secure'}</li>
            <li>{t('recovery.setup.emergency_code.rule2') || 'This code can only be used once'}</li>
            <li>{t('recovery.setup.emergency_code.rule3') || 'Do not share it with anyone'}</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          {t('common.back') || 'Back'}
        </Button>
        <Button
          onClick={() => setStep('additional')}
          disabled={!hasCopiedCode && !hasDownloadedCode}
          className="flex-1"
        >
          {t('common.continue') || 'Continue'}
        </Button>
      </div>
    </div>
  );

  const renderAdditional = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-2">
          {t('recovery.setup.additional.setup_title') || 'Additional Recovery Methods'}
        </h2>
        <p className="text-muted-foreground">
          {t('recovery.setup.additional.setup_subtitle') || 
           'Set up additional ways to verify your identity (optional but recommended)'}
        </p>
      </div>

      <div className="space-y-4">
        {/* ID Verification */}
        <Card className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <Checkbox
              checked={enableIdVerification}
              onCheckedChange={setEnableIdVerification}
            />
            <div>
              <h3 className="font-medium">
                {t('recovery.setup.id_verification.title') || 'SA ID Number Verification'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('recovery.setup.id_verification.description') || 
                 'Use your South African ID number as backup verification'}
              </p>
            </div>
          </div>
          {enableIdVerification && (
            <InputField
              label={t('recovery.setup.id_verification.label') || 'SA ID Number'}
              placeholder="Enter your 13-digit SA ID number"
              value={idNumber}
              onChange={setIdNumber}
              maxLength={13}
            />
          )}
        </Card>

        {/* Trusted Contact */}
        <Card className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <Checkbox
              checked={enableTrustedContact}
              onCheckedChange={setEnableTrustedContact}
            />
            <div>
              <h3 className="font-medium">
                {t('recovery.setup.trusted_contact.title') || 'Trusted Contact'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('recovery.setup.trusted_contact.description') || 
                 'A family member or friend who can help verify your identity'}
              </p>
            </div>
          </div>
          {enableTrustedContact && (
            <div className="space-y-3">
              <InputField
                label={t('recovery.setup.trusted_contact.name') || 'Full Name'}
                value={trustedContact.name}
                onChange={(value) => setTrustedContact(prev => ({ ...prev, name: value }))}
              />
              <InputField
                label={t('recovery.setup.trusted_contact.phone') || 'Phone Number'}
                type="tel"
                value={trustedContact.phone}
                onChange={(value) => setTrustedContact(prev => ({ ...prev, phone: value }))}
              />
            </div>
          )}
        </Card>

        {/* Security Questions */}
        <Card className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <Checkbox
              checked={enableSecurityQuestions}
              onCheckedChange={setEnableSecurityQuestions}
            />
            <div>
              <h3 className="font-medium">
                {t('recovery.setup.security_questions.title') || 'Security Questions'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('recovery.setup.security_questions.description') || 
                 'Answer questions that only you would know'}
              </p>
            </div>
          </div>
          {enableSecurityQuestions && (
            <div className="space-y-3">
              <InputField
                label={t('recovery.setup.security_questions.birth_place') || 'Where were you born?'}
                value={securityQuestions.birthPlace}
                onChange={(value) => setSecurityQuestions(prev => ({ ...prev, birthPlace: value }))}
              />
              <InputField
                label={t('recovery.setup.security_questions.mother_maiden_name') || "What is your mother's maiden name?"}
                value={securityQuestions.motherMaidenName}
                onChange={(value) => setSecurityQuestions(prev => ({ ...prev, motherMaidenName: value }))}
              />
            </div>
          )}
        </Card>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep('emergency-code')} className="flex-1">
          {t('common.back') || 'Back'}
        </Button>
        <Button
          onClick={() => setStep('confirm')}
          disabled={!validateForm()}
          className="flex-1"
        >
          {t('common.continue') || 'Continue'}
        </Button>
      </div>
    </div>
  );

  const renderConfirm = () => {
    const enabledMethods = [
      enableIdVerification && 'SA ID Verification',
      enableTrustedContact && 'Trusted Contact',
      enableSecurityQuestions && 'Security Questions'
    ].filter(Boolean);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-medium mb-2">
            {t('recovery.setup.confirm.title') || 'Recovery Setup Complete'}
          </h2>
          <p className="text-muted-foreground">
            {t('recovery.setup.confirm.subtitle') || 'Your account recovery methods have been configured'}
          </p>
        </div>

        <Card className="p-4">
          <h3 className="font-medium mb-3">
            {t('recovery.setup.confirm.enabled_methods') || 'Enabled Recovery Methods:'}
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Emergency Recovery Code</span>
            </li>
            {enabledMethods.map((method, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">{method}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            {t('recovery.setup.confirm.reminder') || 
             'Remember to keep your recovery code safe. You can update these settings anytime in your account settings.'}
          </AlertDescription>
        </Alert>

        <Button onClick={handleComplete} className="w-full">
          {isOnboarding 
            ? (t('recovery.setup.complete_onboarding') || 'Complete Setup') 
            : (t('recovery.setup.save_settings') || 'Save Settings')
          }
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex items-center gap-2">
          <QuickLanguageSwitch />
          <ThemeToggle variant="minimal" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
          {step === 'intro' && renderIntro()}
          {step === 'emergency-code' && renderEmergencyCode()}
          {step === 'additional' && renderAdditional()}
          {step === 'confirm' && renderConfirm()}
        </Card>
      </div>
    </div>
  );
};
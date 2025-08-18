import { useState } from 'react';
import { ArrowLeft, Shield, Users, FileText, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { InputField } from '../components/InputField';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { QuickLanguageSwitch } from '../components/LanguageSelector';
import { ThemeToggle } from '../components/ThemeToggle';
import { useLanguage } from '../components/LanguageContext';
import { toast } from 'sonner';

interface AccountRecoveryProps {
  onBack: () => void;
  onRecoverySuccess: (phoneNumber: string) => void;
  onContactSupport: () => void;
}

interface RecoveryMethod {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  available: boolean;
}

export const AccountRecovery = ({ onBack, onRecoverySuccess, onContactSupport }: AccountRecoveryProps) => {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [step, setStep] = useState<'select' | 'verify' | 'success'>('select');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Recovery form states
  const [recoveryCode, setRecoveryCode] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [trustedContactPhone, setTrustedContactPhone] = useState('');
  const [securityAnswers, setSecurityAnswers] = useState({
    birthPlace: '',
    motherMaidenName: '',
    firstPet: ''
  });
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  const recoveryMethods: RecoveryMethod[] = [
    {
      id: 'recovery-code',
      icon: <Shield className="w-6 h-6" />,
      title: t('recovery.emergency_code.title') || 'Emergency Recovery Code',
      description: t('recovery.emergency_code.description') || 'Use your saved recovery code to regain access',
      available: true
    },
    {
      id: 'id-verification',
      icon: <FileText className="w-6 h-6" />,
      title: t('recovery.id_verification.title') || 'SA ID Verification',
      description: t('recovery.id_verification.description') || 'Verify your identity using your South African ID number',
      available: true
    },
    {
      id: 'trusted-contact',
      icon: <Users className="w-6 h-6" />,
      title: t('recovery.trusted_contact.title') || 'Trusted Contact',
      description: t('recovery.trusted_contact.description') || 'Get help from someone you trust to verify your identity',
      available: true
    },
    {
      id: 'security-questions',
      icon: <AlertCircle className="w-6 h-6" />,
      title: t('recovery.security_questions.title') || 'Security Questions',
      description: t('recovery.security_questions.description') || 'Answer your security questions to verify your identity',
      available: true
    }
  ];

  const validateSAID = (id: string) => {
    // Basic SA ID validation (13 digits)
    const cleanId = id.replace(/\s/g, '');
    return /^\d{13}$/.test(cleanId);
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setStep('verify');
  };

  const handleVerification = async () => {
    setIsVerifying(true);
    
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let isValid = false;
      
      switch (selectedMethod) {
        case 'recovery-code':
          // In real app, verify against stored recovery codes
          isValid = recoveryCode.length === 8;
          break;
        case 'id-verification':
          isValid = validateSAID(idNumber);
          break;
        case 'trusted-contact':
          isValid = trustedContactPhone.length > 0;
          break;
        case 'security-questions':
          isValid = securityAnswers.birthPlace.length > 0 && 
                   securityAnswers.motherMaidenName.length > 0;
          break;
      }
      
      if (isValid && newPhoneNumber) {
        setStep('success');
        toast.success(t('recovery.verification_success') || 'Identity verified successfully!');
        
        // After a short delay, complete the recovery
        setTimeout(() => {
          onRecoverySuccess(newPhoneNumber);
        }, 2000);
      } else {
        toast.error(t('recovery.verification_failed') || 'Verification failed. Please check your information.');
      }
    } catch (error) {
      toast.error(t('recovery.verification_error') || 'An error occurred during verification.');
    } finally {
      setIsVerifying(false);
    }
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-medium mb-2">
          {t('recovery.select_method.title') || 'How would you like to recover your account?'}
        </h2>
        <p className="text-muted-foreground">
          {t('recovery.select_method.subtitle') || 'Choose a recovery method to regain access to your KasiSave account'}
        </p>
      </div>

      <div className="grid gap-3">
        {recoveryMethods.map((method) => (
          <Card
            key={method.id}
            className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${
              !method.available ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => method.available && handleMethodSelect(method.id)}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                {method.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">{method.title}</h3>
                <p className="text-sm text-muted-foreground">{method.description}</p>
                {!method.available && (
                  <p className="text-xs text-destructive mt-1">
                    {t('recovery.method_unavailable') || 'Not available for your account'}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={onContactSupport}
          className="w-full"
        >
          <Phone className="w-4 h-4 mr-2" />
          {t('recovery.contact_support') || 'Contact Support for Help'}
        </Button>
      </div>
    </div>
  );

  const renderVerificationForm = () => {
    const method = recoveryMethods.find(m => m.id === selectedMethod);
    if (!method) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
            {method.icon}
          </div>
          <h2 className="text-xl font-medium mb-2">{method.title}</h2>
          <p className="text-muted-foreground">{method.description}</p>
        </div>

        <div className="space-y-4">
          {selectedMethod === 'recovery-code' && (
            <InputField
              label={t('recovery.emergency_code.label') || 'Recovery Code'}
              placeholder={t('recovery.emergency_code.placeholder') || 'Enter your 8-digit recovery code'}
              value={recoveryCode}
              onChange={setRecoveryCode}
              maxLength={8}
            />
          )}

          {selectedMethod === 'id-verification' && (
            <InputField
              label={t('recovery.id_verification.label') || 'SA ID Number'}
              placeholder={t('recovery.id_verification.placeholder') || 'Enter your 13-digit SA ID number'}
              value={idNumber}
              onChange={setIdNumber}
              maxLength={13}
            />
          )}

          {selectedMethod === 'trusted-contact' && (
            <div className="space-y-4">
              <InputField
                label={t('recovery.trusted_contact.label') || 'Trusted Contact Phone'}
                placeholder={t('recovery.trusted_contact.placeholder') || 'Phone number of your trusted contact'}
                value={trustedContactPhone}
                onChange={setTrustedContactPhone}
              />
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {t('recovery.trusted_contact.note') || 
                   'We will send a verification code to your trusted contact. They will need to share this code with you.'}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {selectedMethod === 'security-questions' && (
            <div className="space-y-4">
              <InputField
                label={t('recovery.security_questions.birth_place') || 'Where were you born?'}
                value={securityAnswers.birthPlace}
                onChange={(value) => setSecurityAnswers(prev => ({ ...prev, birthPlace: value }))}
              />
              <InputField
                label={t('recovery.security_questions.mother_maiden_name') || "What is your mother's maiden name?"}
                value={securityAnswers.motherMaidenName}
                onChange={(value) => setSecurityAnswers(prev => ({ ...prev, motherMaidenName: value }))}
              />
            </div>
          )}

          {/* New phone number field for all methods */}
          <InputField
            label={t('recovery.new_phone.label') || 'New Phone Number'}
            placeholder={t('recovery.new_phone.placeholder') || 'Enter your new phone number'}
            value={newPhoneNumber}
            onChange={setNewPhoneNumber}
            type="tel"
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep('select')}
              className="flex-1"
            >
              {t('common.back') || 'Back'}
            </Button>
            <Button
              onClick={handleVerification}
              disabled={isVerifying || !newPhoneNumber}
              className="flex-1"
            >
              {isVerifying ? (t('recovery.verifying') || 'Verifying...') : (t('recovery.verify') || 'Verify & Recover')}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <h2 className="text-xl font-medium mb-2">
          {t('recovery.success.title') || 'Account Recovery Successful!'}
        </h2>
        <p className="text-muted-foreground">
          {t('recovery.success.message') || 'Your account has been recovered and linked to your new phone number.'}
        </p>
      </div>
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm">
          <strong>{t('recovery.success.new_number') || 'New Phone Number:'}</strong> {newPhoneNumber}
        </p>
      </div>
    </div>
  );

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
          {step === 'select' && renderMethodSelection()}
          {step === 'verify' && renderVerificationForm()}
          {step === 'success' && renderSuccess()}
        </Card>
      </div>
    </div>
  );
};
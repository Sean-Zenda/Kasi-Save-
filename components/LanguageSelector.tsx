import { useLanguage, Language } from './LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Check, Globe } from 'lucide-react';

interface LanguageSelectorProps {
  onLanguageChange?: (language: Language) => void;
}

export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'en', name: t('language.english'), nativeName: 'English' },
    { code: 'zu', name: t('language.zulu'), nativeName: 'IsiZulu' },
    { code: 'st', name: t('language.sotho'), nativeName: 'Sesotho' },
    { code: 'af', name: t('language.afrikaans'), nativeName: 'Afrikaans' }
  ];

  const handleLanguageSelect = (newLanguage: Language) => {
    setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-white">{t('settings.language')}</h3>
          <p className="text-sm text-muted-foreground">Choose your preferred language</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {languages.map((lang) => (
          <Card
            key={lang.code}
            className={`p-4 cursor-pointer transition-all duration-200 border-border hover:border-primary/50 ${
              language === lang.code
                ? 'bg-primary/10 border-primary'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
            onClick={() => handleLanguageSelect(lang.code)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {lang.code === 'en' && '🇬🇧'}
                  {lang.code === 'zu' && '🇿🇦'}
                  {lang.code === 'st' && '🇿🇦'}
                  {lang.code === 'af' && '🇿🇦'}
                </div>
                <div>
                  <p className="text-white">{lang.nativeName}</p>
                  <p className="text-sm text-muted-foreground">{lang.name}</p>
                </div>
              </div>
              
              {language === lang.code && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          {language === 'en' && 'Choose the language that makes you most comfortable using KasiSave'}
          {language === 'zu' && 'Khetha ulimi olukwenza ukhululeke kakhulu usebenzisa i-KasiSave'}
          {language === 'st' && 'Khetha puo e u etsang hore u ikutlwe u phutholohetse ho sebedisa KasiSave'}
          {language === 'af' && 'Kies die taal wat jou die gemaklikste laat voel om KasiSave te gebruik'}
        </p>
      </div>
    </div>
  );
}

// Quick language switcher for header/navigation
export function QuickLanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  const languageLabels = {
    en: 'EN',
    zu: 'ZU',
    st: 'ST',
    af: 'AF'
  };

  const nextLanguage = () => {
    const languages: Language[] = ['en', 'zu', 'st', 'af'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={nextLanguage}
      className="text-primary hover:bg-primary/10 h-8 w-12"
    >
      {languageLabels[language]}
    </Button>
  );
}
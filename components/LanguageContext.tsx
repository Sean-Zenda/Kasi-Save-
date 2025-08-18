import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'zu' | 'st';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, variables?: Record<string, string>) => string | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys and values
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.goals': 'Goals',
    'nav.settings': 'Settings',
    'nav.back': 'Back',
    
    // Dashboard
    'dashboard.good_morning': 'Good morning',
    'dashboard.good_afternoon': 'Good afternoon',
    'dashboard.good_evening': 'Good evening',
    'dashboard.total_saved': 'Total Saved',
    'dashboard.deposit': 'Deposit',
    'dashboard.withdraw': 'Withdraw',
    'dashboard.recent_activity': 'Recent Activity',
    'dashboard.stokvels': 'Stokvels',
    'dashboard.view_all_stokvels': 'View All Stokvels',
    
    // AI Coach
    'ai.title': 'AI Financial Coach',
    'ai.subtitle': 'Your personal savings assistant',
    'ai.welcome.greeting': 'Hello {name}! 👋',
    'ai.welcome.intro': "I'm your AI financial coach, here to help you achieve your savings goals.",
    'ai.welcome.summary': '📊 Quick Summary:',
    'ai.welcome.help': "How can I help you today? You can ask about your savings, goals, spending habits, or get personalized financial advice!",
    'ai.thinking': 'Thinking...',
    'ai.error': "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
    'ai.input_placeholder': 'Ask me about your finances, goals, or saving tips...',
    'ai.listening': 'Listening... Speak your question',
    'ai.suggested_questions': 'Try asking me about:',
    'ai.suggestions.goal_progress': 'How can I reach my savings goal faster?',
    'ai.suggestions.spending': 'Analyze my spending patterns',
    'ai.suggestions.budget': 'Help me create a better budget',
    'ai.suggestions.emergency': 'How much should I save for emergencies?',
    'ai.suggestions.stokvel': 'Tell me about Stokvels',
    'ai.suggestions.tips': 'Give me saving tips for South Africa',
    
    // Voice AI
    'voice.speak': 'Speak',
    'voice.stop': 'Stop',
    'voice.voice': 'Voice',
    'voice.listening': 'Listening...',
    'voice.speaking': 'Speaking...',
    'voice.not_supported': 'Voice input not supported on this device',
    'voice.tts_not_supported': 'Voice output not supported on this device',
    'voice.permission_denied': 'Microphone permission denied. Please enable microphone access in your browser settings.',
    'voice.permission_required': 'Microphone permission is required for voice input',
    'voice.no_speech': 'No speech detected. Please try again.',
    'voice.audio_error': 'Audio capture error. Please check your microphone.',
    'voice.network_error': 'Network error. Speech recognition requires an internet connection.',
    'voice.service_not_allowed': 'Speech recognition service not allowed. Please try again.',
    'voice.error_general': 'Speech recognition error occurred',
    'voice.start_error': 'Could not start voice recognition. Please try again.',
    'voice.tts_error': 'Could not speak the text. Please check your audio settings.',
    'voice.https_required': 'Voice input requires a secure connection (HTTPS)',
    
    // Goals
    'goals.create': 'Create Goal',
    'goals.edit': 'Edit Goal',
    'goals.delete': 'Delete Goal',
    'goals.complete': 'Mark Complete',
    'goals.name': 'Goal Name',
    'goals.amount': 'Target Amount',
    'goals.category': 'Category',
    'goals.priority': 'Priority',
    
    // Deposits & Withdrawals
    'deposit.via': 'Deposit via',
    'deposit.ewallet': 'eWallet',
    'deposit.mtn_money': 'MTN Money',
    'deposit.payment_voucher': 'Payment Voucher',
    'deposit.cash_send': 'Cash Send',
    'deposit.payment_method': 'Payment Method',
    
    'withdraw.via': 'Withdrawal via',
    'withdraw.voucher': 'Redeemable Voucher',
    'withdraw.bank_account': 'Bank Account',
    'withdraw.linked_card': 'Linked Card',
    'withdraw.ewallet': 'eWallet',
    'withdraw.cash_send': 'Cash Send',
    'withdraw.qr_code': 'QR Code',
    'withdraw.method': 'Withdrawal Method',
    
    // Recovery
    'recovery.setup.success': 'Recovery methods saved successfully!',
    'recovery.setup.skipped': 'You can set up recovery methods later in Settings',
    'recovery.success.complete': 'Welcome back! Your account has been recovered.',
    
    // Support
    'support.contact_info': 'Contact Support: 0800 123 456 or help@kasave.co.za',
    
    // Stokvels
    'stokvel.groups': 'Save together with family and friends',
    
    // Settings
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.voice': 'Voice Settings',
    'settings.notifications': 'Notifications',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.confirm': 'Confirm',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Information'
  },
  
  zu: {
    // Navigation
    'nav.dashboard': 'Ideshibhodi',
    'nav.goals': 'Izinhloso',
    'nav.settings': 'Izilungiselelo',
    'nav.back': 'Buyela Emuva',
    
    // Dashboard
    'dashboard.good_morning': 'Sawubona ekuseni',
    'dashboard.good_afternoon': 'Sawubona emini',
    'dashboard.good_evening': 'Sawubona kusihlwa',
    'dashboard.total_saved': 'Isamba Esilondoloziwe',
    'dashboard.deposit': 'Faka Imali',
    'dashboard.withdraw': 'Khipha Imali',
    'dashboard.recent_activity': 'Ukusebenza Kwamuva',
    'dashboard.stokvels': 'Amastokveli',
    'dashboard.view_all_stokvels': 'Buka Wonke Amastokveli',
    
    // AI Coach
    'ai.title': 'Umqeqeshi Wezimali we-AI',
    'ai.subtitle': 'Umsizi wakho wokonga imali',
    'ai.welcome.greeting': 'Sawubona {name}! 👋',
    'ai.welcome.intro': "Ngingumqeqeshi wakho wezimali we-AI, ngilapha ukusiza ukuthi ufeze izinhloso zakho zokonga.",
    'ai.welcome.summary': '📊 Isifinyezo Esisheshayo:',
    'ai.welcome.help': "Ngingakusiza kanjani namuhla? Ungabuza ngokonga kwakho, izinhloso, mikhuba yokuthenga, noma uthole izeluleko zezimali eziqondene nawe!",
    'ai.thinking': 'Ngiyacabanga...',
    'ai.error': "Ngiyaxolisa, nginenkinga yokuxhuma manje. Sicela uzame futhi ngemva kwesikhashana.",
    'ai.input_placeholder': 'Ngibuze ngezimali zakho, izinhloso, noma amathiphu okonga...',
    'ai.listening': 'Ngiyalalela... Khuluma umbuzo wakho',
    'ai.suggested_questions': 'Zama ukungibuza ngalokhu:',
    'ai.suggestions.goal_progress': 'Ngingafinyelela kanjani injongo yami yokonga ngokushesha?',
    'ai.suggestions.spending': 'Hlaziya amaphethini ami okuthenga',
    'ai.suggestions.budget': 'Ngisiza ngenze isabelomali esingcono',
    'ai.suggestions.emergency': 'Kufanele ngilondoloze malini ezimeni eziphuthumayo?',
    'ai.suggestions.stokvel': 'Ngitshele ngamastokveli',
    'ai.suggestions.tips': 'Nginike amathiphu okonga eNingizimu Afrika',
    
    // Voice AI
    'voice.speak': 'Khuluma',
    'voice.stop': 'Misa',
    'voice.voice': 'Izwi',
    'voice.listening': 'Ngiyalalela...',
    'voice.speaking': 'Ngiyakhuluma...',
    'voice.not_supported': 'Ukufaka kwezwi akusekelwa kuleli divayisi',
    'voice.tts_not_supported': 'Ukukhipha kwezwi akusekelwa kuleli divayisi',
    'voice.permission_denied': 'Imvume yamakrofoni yenqatshelwe. Sicela unike imvume yamakrofoni ezilungiselelweni ze-browser yakho.',
    'voice.permission_required': 'Imvume yamakrofoni idingeka ukufaka izwi',
    'voice.no_speech': 'Akukho zwi elizwakalayo. Sicela uzame futhi.',
    'voice.audio_error': 'Iphutha lokubopha umsindo. Sicela uhlole imakrofoni yakho.',
    'voice.network_error': 'Iphutha lenethiwekhi. Ukubona kwenkulumo kudinga ukuxhumeka ku-inthanethi.',
    'voice.service_not_allowed': 'Isevisi yokubona inkulumo ayivunyelwe. Sicela uzame futhi.',
    'voice.error_general': 'Iphutha lokubona inkulumo lenzekile',
    'voice.start_error': 'Ayikwazanga ukuqala ukubona kwezwi. Sicela uzame futhi.',
    'voice.tts_error': 'Ayikwazanga ukukhuluma umbhalo. Sicela uhlole izilungiselelo zakho zomsindo.',
    'voice.https_required': 'Ukufaka kwezwi kudinga ukuxhumeka okuphephile (HTTPS)',
    
    // Recovery
    'recovery.setup.success': 'Izindlela zokubuyisela zigcinwe ngempumelelo!',
    'recovery.setup.skipped': 'Ungasetha izindlela zokubuyisela kamuva Ezimiselweni',
    'recovery.success.complete': 'Siyakwamukela emuva! I-akhawunti yakho ibibuyisiwe.',
    
    // Support  
    'support.contact_info': 'Xhumana Nokusekelwa: 0800 123 456 noma help@kasave.co.za',
    
    // Stokvels
    'stokvel.groups': 'Londoloza ndawonye nabangani nababeni',
    
    // Common
    'common.save': 'Londoloza',
    'common.cancel': 'Khansela',
    'common.delete': 'Susa',
    'common.edit': 'Hlela',
    'common.add': 'Engeza',
    'common.remove': 'Susa',
    'common.confirm': 'Qinisekisa',
    'common.loading': 'Iylayisha...',
    'common.error': 'Iphutha',
    'common.success': 'Impumelelo',
    'common.warning': 'Isexwayiso',
    'common.info': 'Ulwazi'
  },
  
  st: {
    // Navigation
    'nav.dashboard': 'Boto ya taolo',
    'nav.goals': 'Dipakane',
    'nav.settings': 'Ditokisetso',
    'nav.back': 'Boela Moraho',
    
    // Dashboard
    'dashboard.good_morning': 'Dumela hoseng',
    'dashboard.good_afternoon': 'Dumela motsheare',
    'dashboard.good_evening': 'Dumela mantsiboa',
    'dashboard.total_saved': 'Kakaretso ya tse Bolokehileng',
    'dashboard.deposit': 'Kenya Chelete',
    'dashboard.withdraw': 'Ntsha Chelete',
    'dashboard.recent_activity': 'Mesebetsi ya Haufinyane',
    'dashboard.stokvels': 'Distokvele',
    'dashboard.view_all_stokvels': 'Sheba Distokvele Tsohle',
    
    // AI Coach
    'ai.title': 'Moeletsi wa Ditjhelete wa AI',
    'ai.subtitle': 'Mothusi wa hao wa ho boloka chelete',
    'ai.welcome.greeting': 'Dumela {name}! 👋',
    'ai.welcome.intro': "Ke moeletsi wa hao wa ditjhelete wa AI, ke mona ho u thusa ho fihlela dipakane tsa hao tsa ho boloka.",
    'ai.welcome.summary': '📊 Kakaretso e Potlakisang:',
    'ai.welcome.help': "Nka u thusa jwang kajeno? U ka botsa ka ho boloka ha hao, dipakane, mekgwa ya ho reka, kapa u fumane keletso tsa ditjhelete tse ikhethileng!",
    'ai.thinking': 'Ke a nahana...',
    'ai.error': "Ke masoabi, ke na le bothata ba ho hokahana hajwale. Ka kopo leka hape kamora nako e khutshwane.",
    'ai.input_placeholder': 'Mpotsise ka ditjhelete tsa hao, dipakane, kapa malebela a ho boloka...',
    'ai.listening': 'Ke a mamela... Bua potso ya hao',
    'ai.suggested_questions': 'Leka ho mmotsa ka tsena:',
    'ai.suggestions.goal_progress': 'Nka finyella pakane ya ka ya ho boloka kapele jwang?',
    'ai.suggestions.spending': 'Sekaseka dipaterone tsa ka tsa ho reka',
    'ai.suggestions.budget': 'Nthuse ho etsa tekanyetso e ntlafetseng',
    'ai.suggestions.emergency': 'Ke lokela ho boloka bokae bakeng sa maemo a tshohanyetso?',
    'ai.suggestions.stokvel': 'Mmolelle ka Distokvele',
    'ai.suggestions.tips': 'Mpe malebela a ho boloka Afrika Borwa',
    
    // Voice AI
    'voice.speak': 'Bua',
    'voice.stop': 'Ema',
    'voice.voice': 'Lentswe',
    'voice.listening': 'Ke a mamela...',
    'voice.speaking': 'Ke a bua...',
    'voice.not_supported': 'Kenyo ya lentswe ha e tshehetswe sesebeliswa sena',
    'voice.tts_not_supported': 'Ntshelo ya lentswe ha e tshehetswe sesebeliswa sena',
    'voice.permission_denied': 'Tumello ya mokrofono e hanilwe. Ka kopo fa tumello ya mokrofono ditokisetsong tsa hao tsa browser.',
    'voice.permission_required': 'Tumello ya mokrofono e a hlokahala bakeng sa kenyo ya lentswe',
    'voice.no_speech': 'Ha ho lentswe le utloahalang. Ka kopo leka hape.',
    'voice.audio_error': 'Phoso ya ho nka molumo. Ka kopo hlahloba mokrofono wa hao.',
    'voice.network_error': 'Phoso ya network. Ho lemosa lentswe ho hloka kgokahanyo ya inthanete.',
    'voice.service_not_allowed': 'Tshebeletso ya ho lemosa lentswe ha e lumellwe. Ka kopo leka hape.',
    'voice.error_general': 'Phoso ya ho lemosa lentswe e etsahetswe',
    'voice.start_error': 'Ha e khone ho qala ho lemosa lentswe. Ka kopo leka hape.',
    'voice.tts_error': 'Ha e khone ho bua mongolo. Ka kopo hlahloba ditokisetso tsa hao tsa molumo.',
    'voice.https_required': 'Kenyo ya lentswe e hloka kgokahanyo e sireletsehileng (HTTPS)',
    
    // Recovery
    'recovery.setup.success': 'Ditsela tsa ho khutlisetsa di bolokeile ka katleho!',
    'recovery.setup.skipped': 'U ka beha ditsela tsa ho khutlisetsa kamora moo Ditokisetsong',
    'recovery.success.complete': 'Re u amohela hape! Akhaonto ya hao e khutlisitswe.',
    
    // Support
    'support.contact_info': 'Ikgokahanye le Tshehetso: 0800 123 456 kapa help@kasave.co.za',
    
    // Stokvels
    'stokvel.groups': 'Boloka hammoho le ba lelapa le metswalle',
    
    // Common
    'common.save': 'Boloka',
    'common.cancel': 'Hlakola',
    'common.delete': 'Tlosa',
    'common.edit': 'Fetola',
    'common.add': 'Kenyeletsa',
    'common.remove': 'Tlosa',
    'common.confirm': 'Netefatsa',
    'common.loading': 'E a jara...',
    'common.error': 'Phoso',
    'common.success': 'Katleho',
    'common.warning': 'Temoso',
    'common.info': 'Tlhahisoleseding'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('kasave-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('kasave-language', language);
    // Set HTML lang attribute for accessibility
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, variables?: Record<string, string>): string | null => {
    let translation = translations[language]?.[key as keyof typeof translations[typeof language]] || 
                     translations.en[key as keyof typeof translations.en] || 
                     null;

    // Replace variables in translation
    if (translation && variables) {
      Object.entries(variables).forEach(([varKey, varValue]) => {
        translation = translation!.replace(`{${varKey}}`, varValue);
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language options for UI
export const languageOptions = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'zu' as Language, name: 'Zulu', nativeName: 'isiZulu' },
  { code: 'st' as Language, name: 'Sotho', nativeName: 'Sesotho' }
];

// Voice language mappings for TTS and Speech Recognition
export const voiceLanguageMappings = {
  en: {
    tts: 'en-US',
    speech: 'en-US',
    voice: 'en-US-Journey-F'
  },
  zu: {
    tts: 'en-US', // Fallback to English for now
    speech: 'en-US', // Changed to English fallback
    voice: 'en-US-Journey-F'
  },
  st: {
    tts: 'en-US', // Fallback to English for now  
    speech: 'en-US', // Changed to English fallback
    voice: 'en-US-Journey-F'
  }
};
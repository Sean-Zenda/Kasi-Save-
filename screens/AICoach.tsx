import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Volume2,
  Mic,
  VolumeX,
  RefreshCw,
  Wifi,
  WifiOff,
  Key,
  ExternalLink,
  Info
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { VoiceAI } from '../components/VoiceAI';
import { googleTTSService } from '../services/google-tts-service';
import { geminiAIService } from '../backend/gemini-ai-service';
import { toast } from 'sonner';

interface AICoachProps {
  user: {
    name: string;
    totalSaved: number;
    goal: {
      name: string;
      amount: number;
      saved: number;
    };
    streak: number;
    level: number;
    goals: any[];
    bills: any[];
    monthlyBudget?: number;
  };
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  isGeminiResponse?: boolean;
}

export const AICoach: React.FC<AICoachProps> = ({ user, onBack }) => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [geminiStatus, setGeminiStatus] = useState<'checking' | 'available' | 'unavailable' | 'invalid-key'>('checking');
  const [showApiKeyInfo, setShowApiKeyInfo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceAIRef = useRef<any>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check Gemini service status on component mount
  useEffect(() => {
    checkGeminiStatus();
  }, []);

  // Initialize conversation with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'ai',
      content: getWelcomeMessage(),
      timestamp: new Date(),
      isGeminiResponse: false
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup on unmount - stop any speaking
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const checkGeminiStatus = async () => {
    setGeminiStatus('checking');
    try {
      console.log('🔍 Checking Gemini service status...');
      const isAvailable = geminiAIService.isServiceAvailable();
      const apiKeyStatus = geminiAIService.getApiKeyStatus();
      const initError = geminiAIService.getInitializationError();
      
      console.log('📊 Gemini service status:', isAvailable ? 'Available' : 'Not available');
      console.log('🔑 API key status:', apiKeyStatus);
      
      if (isAvailable) {
        setGeminiStatus('available');
        toast.success('AI Coach ready with Gemini AI', { duration: 3000 });
      } else if (initError?.includes('Invalid API key') || initError?.includes('API key not valid')) {
        setGeminiStatus('invalid-key');
        toast.error('Invalid API key - Using offline mode', { duration: 5000 });
      } else {
        setGeminiStatus('unavailable');
        toast.info('AI Coach ready with offline responses', { duration: 3000 });
      }
      
      // Show API key info if there are issues
      if (!isAvailable) {
        setShowApiKeyInfo(true);
      }
    } catch (error) {
      console.error('❌ Error checking Gemini status:', error);
      setGeminiStatus('unavailable');
      toast.warning('AI Coach ready with offline responses', { duration: 3000 });
    }
  };

  const retryGeminiConnection = async () => {
    try {
      console.log('🔄 Retrying Gemini connection...');
      toast.info('Reconnecting to AI service...', { duration: 2000 });
      
      const success = await geminiAIService.retryInitialization();
      if (success) {
        setGeminiStatus('available');
        setShowApiKeyInfo(false);
        toast.success('Connected to Gemini AI!', { duration: 3000 });
      } else {
        const initError = geminiAIService.getInitializationError();
        if (initError?.includes('Invalid API key') || initError?.includes('API key not valid')) {
          setGeminiStatus('invalid-key');
          toast.error('Invalid API key detected', { duration: 3000 });
        } else {
          setGeminiStatus('unavailable');
          toast.error('Failed to connect to Gemini AI', { duration: 3000 });
        }
      }
    } catch (error) {
      console.error('❌ Retry failed:', error);
      setGeminiStatus('unavailable');
      toast.error('Failed to connect to Gemini AI', { duration: 3000 });
    }
  };

  const getWelcomeMessage = () => {
    const goalProgress = user.goal.amount > 0 ? Math.round((user.goal.saved / user.goal.amount) * 100) : 0;
    
    // Localized welcome message (NO EMOJIS)
    const welcomeMessages = {
      en: [
        `Hello ${user.name}!`,
        "I'm your AI financial coach, here to help you achieve your savings goals.",
        '',
        'Quick Summary:',
        `Total Saved: R${user.totalSaved.toLocaleString()}`,
        `Main Goal: ${user.goal.name} (${goalProgress}% complete)`,
        `Streak: ${user.streak} days`,
        `Level: ${user.level}`,
        '',
        "How can I help you today? You can ask about your savings, goals, spending habits, or get personalized financial advice!"
      ],
      zu: [
        `Sawubona ${user.name}!`,
        "Ngingumeluleki wakho wezezimali we-AI, ngilapha ukuze ngikusize uzuze imigomo yakho yokonga.",
        '',
        'Isifingqo Esisheshayo:',
        `Okuphelele Okongwe: R${user.totalSaved.toLocaleString()}`,
        `Umgomo Oyinhloko: ${user.goal.name} (${goalProgress}% kuqedile)`,
        `Ukulandelana: ${user.streak} izinsuku`,
        `Izinga: ${user.level}`,
        '',
        "Ngingakusiza kanjani namuhla? Ungabuza ngokonga kwakho, imigomo, ukusebenzisa kwemali, noma uthole izeluleko zezezimali!"
      ],
      st: [
        `Dumela ${user.name}!`,
        "Ke moeletsi wa hao wa AI wa ditjhelete, ke teng ho o thusa ho fihlela dipheo tsa hao tsa ho boloka.",
        '',
        'Kakaretso e Potlakileng:',
        `Kaofela e Bolokeditsweng: R${user.totalSaved.toLocaleString()}`,
        `Sepheo sa Mantlha: ${user.goal.name} (${goalProgress}% e phethahetswe)`,
        `Ho tswella pele: Matsatsi a ${user.streak}`,
        `Boemo: ${user.level}`,
        '',
        "Nka o thusa jwang kajeno? O ka botsa ka ho boloka ha hao, dipheo, mekgwa ya ho sebedisa tjhelete, kapa o fumane dikeletso tsa ditjhelete!"
      ]
    };
    
    const messages = welcomeMessages[language as keyof typeof welcomeMessages] || welcomeMessages.en;
    return messages.join('\n');
  };

  const speakMessage = async (messageId: string, text: string) => {
    if (!text.trim() || speakingMessageId === messageId) return;
    
    // Stop any currently speaking message
    if (speakingMessageId) {
      stopSpeaking();
    }
    
    setSpeakingMessageId(messageId);
    
    try {
      console.log('🔊 Starting to speak message:', text.substring(0, 100) + '...');
      
      // Try Google TTS first
      if (googleTTSService.isAvailable()) {
        console.log('🔊 Using Google TTS service');
        await googleTTSService.speak(text, language);
        console.log('✅ Google TTS completed successfully');
      } else {
        // Fallback to browser TTS
        console.log('🔊 Using browser TTS fallback');
        await fallbackTTS(text);
        console.log('✅ Browser TTS completed successfully');
      }
    } catch (error) {
      console.error('❌ Error speaking message:', error);
      // Try browser TTS as fallback
      try {
        console.log('🔊 Trying browser TTS as fallback');
        await fallbackTTS(text);
      } catch (fallbackError) {
        console.error('❌ Fallback TTS also failed:', fallbackError);
        toast.error('Voice output temporarily unavailable');
      }
    } finally {
      setSpeakingMessageId(null);
      currentUtteranceRef.current = null;
    }
  };

  const stopSpeaking = () => {
    console.log('🛑 Stopping all TTS...');
    
    // Stop browser TTS immediately
    if ('speechSynthesis' in window) {
      console.log('🛑 Cancelling browser speech synthesis');
      window.speechSynthesis.cancel();
    }
    
    // Stop current utterance if it exists
    if (currentUtteranceRef.current) {
      console.log('🛑 Stopping current utterance');
      currentUtteranceRef.current.onend = null; // Prevent onend from firing
      currentUtteranceRef.current = null;
    }
    
    // Stop Google TTS service if available
    if (googleTTSService.isAvailable()) {
      try {
        console.log('🛑 Stopping Google TTS service');
        googleTTSService.stop?.();
      } catch (error) {
        console.log('⚠️ Could not stop Google TTS:', error);
      }
    }
    
    // Reset speaking state immediately
    setSpeakingMessageId(null);
    console.log('✅ All TTS stopped');
  };

  const fallbackTTS = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech first
        window.speechSynthesis.cancel();
        
        // Wait a bit to ensure cancellation is complete
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(text);
          currentUtteranceRef.current = utterance;
          
          // Set language based on current language
          const voiceLangCodes = {
            en: 'en-US',
            zu: 'en-US', // Fallback to English
            st: 'en-US'  // Fallback to English
          };
          
          utterance.lang = voiceLangCodes[language as keyof typeof voiceLangCodes] || 'en-US';
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;

          utterance.onstart = () => {
            console.log('🔊 Browser TTS started');
          };

          utterance.onend = () => {
            console.log('🔊 Browser TTS finished');
            currentUtteranceRef.current = null;
            resolve();
          };
          
          utterance.onerror = (event) => {
            console.error('❌ Browser TTS error:', event.error);
            currentUtteranceRef.current = null;
            reject(new Error(`Speech synthesis error: ${event.error}`));
          };

          utterance.onpause = () => {
            console.log('⏸️ Browser TTS paused');
          };

          utterance.onresume = () => {
            console.log('▶️ Browser TTS resumed');
          };

          // Start speaking
          console.log('🔊 Starting browser TTS');
          window.speechSynthesis.speak(utterance);
        }, 100);
      } else {
        reject(new Error('Speech synthesis not supported'));
      }
    });
  };

  const handleSendMessage = async (messageText?: string) => {
    const messageContent = messageText || input.trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      type: 'ai',
      content: t('ai.thinking') || 'Thinking...',
      timestamp: new Date(),
      isTyping: true
    };

    setMessages(prev => [...prev, typingMessage]);

    try {
      let aiResponse: string;
      let isGeminiResponse = false;
      
      // Try Gemini AI first if available
      if (geminiStatus === 'available') {
        console.log('🤖 Attempting to use Gemini AI...');
        try {
          aiResponse = await geminiAIService.getFinancialAdvice(messageContent, {
            user: {
              name: user.name,
              totalSaved: user.totalSaved,
              goals: user.goals,
              bills: user.bills,
              monthlyBudget: user.monthlyBudget || 5000,
              gamificationStats: {
                level: user.level,
                streak: user.streak
              }
            },
            language,
            context: 'ai_coach_chat',
            responseLanguage: language
          });
          isGeminiResponse = true;
          console.log('✅ Successfully got Gemini AI response');
          console.log('   Response length:', aiResponse.length, 'characters');
        } catch (geminiError) {
          console.log('❌ Gemini AI failed:', geminiError);
          
          // Check for API key errors
          if (geminiError instanceof Error && 
              (geminiError.message.includes('Invalid API key') || 
               geminiError.message.includes('API key not valid'))) {
            console.log('   → Invalid API key detected, switching to offline mode');
            setGeminiStatus('invalid-key');
            setShowApiKeyInfo(true);
            aiResponse = generateFallbackResponse(messageContent, user);
            toast.error('Invalid API key - switched to offline mode', { duration: 5000 });
          } else {
            console.log('   → Using fallback response due to API error');
            aiResponse = generateFallbackResponse(messageContent, user);
            toast.warning('Gemini temporarily unavailable - using offline responses', { duration: 3000 });
          }
        }
      } else {
        console.log('📱 Using local fallback responses (Gemini not available)');
        aiResponse = generateFallbackResponse(messageContent, user);
      }

      // Remove typing indicator and add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        isGeminiResponse
      };

      setMessages(prev => prev.filter(msg => msg.id !== 'typing').concat(aiMessage));

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Provide comprehensive fallback response
      const fallbackContent = generateFallbackResponse(messageContent, user);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: fallbackContent,
        timestamp: new Date(),
        isGeminiResponse: false
      };

      setMessages(prev => prev.filter(msg => msg.id !== 'typing').concat(errorMessage));
      toast.error('Using offline AI responses', { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (question: string, userData: typeof user): string => {
    const goalProgress = userData.goal.amount > 0 ? Math.round((userData.goal.saved / userData.goal.amount) * 100) : 0;
    const monthlyBudget = userData.monthlyBudget || 5000;
    
    // Simple keyword-based responses in different languages (NO EMOJIS)
    const lowerQuestion = question.toLowerCase();
    
    // Generate responses based on language
    const responses = {
      en: {
        goal: `Based on your current progress, you're ${goalProgress}% towards your "${userData.goal.name}" goal.\n\nTo reach your target of R${userData.goal.amount.toLocaleString()}, you need R${(userData.goal.amount - userData.goal.saved).toLocaleString()} more.\n\nTip: Try setting aside R${Math.ceil((userData.goal.amount - userData.goal.saved) / 12).toLocaleString()} per month to reach your goal within a year.`,
        budget: `Your monthly budget is R${monthlyBudget.toLocaleString()}. Here are some South African saving tips:\n\n• Use grocery store loyalty programs\n• Buy in bulk during specials\n• Consider switching to prepaid utilities\n• Join a Stokvel for group savings\n• Use public transport or car pooling\n\nRemember: Small savings add up to big results over time.`,
        stokvel: `Stokvels are a fantastic South African tradition for saving.\n\nBenefits:\n• Group accountability\n• Regular saving discipline\n• Social support\n• Bulk buying power\n\nYou can create or join a Stokvel right in the app. Start with family or trusted friends and set a monthly contribution that works for everyone.`,
        emergency: `An emergency fund is crucial for financial security.\n\nRecommendation: Aim for 3-6 months of expenses (R${(monthlyBudget * 3).toLocaleString()} - R${(monthlyBudget * 6).toLocaleString()}).\n\nWith your current savings of R${userData.totalSaved.toLocaleString()}, you're ${userData.totalSaved >= monthlyBudget * 3 ? 'well on your way!' : `R${((monthlyBudget * 3) - userData.totalSaved).toLocaleString()} away from a basic 3-month fund.`}\n\nStart small: Even R50 per week adds up to R2,600 per year.`,
        general: `Great question! You're doing well with your financial journey.\n\nYour achievements:\n• ${userData.streak} day saving streak\n• Level ${userData.level} achievement\n• R${userData.totalSaved.toLocaleString()} total saved\n\nKeep focusing on:\n• Your "${userData.goal.name}" goal\n• Consistent daily habits\n• Tracking your spending\n• Consider joining a Stokvel\n\nRemember: Every rand saved is a step towards financial freedom.`
      },
      zu: {
        goal: `Ngokwenqubekelaphambili yakho yamanje, usufinyelele ku-${goalProgress}% kwigyomo lakho elithi "${userData.goal.name}".\n\nUkuze ufinyelele igyomo lakho lama-R${userData.goal.amount.toLocaleString()}, udinga u-R${(userData.goal.amount - userData.goal.saved).toLocaleString()} okwengeziwe.\n\nIcebo: Zama ukubeka eceleni u-R${Math.ceil((userData.goal.amount - userData.goal.saved) / 12).toLocaleString()} ngenyanga ukuze ufinyelele igyomo lakho phakathi konyaka.`,
        budget: `Ibhajethi yakho yenyanga yi-R${monthlyBudget.toLocaleString()}. Nanka amacebo okonga aseNingizimu Afrika:\n\n• Sebenzisa izinhlelo zokwethembeka zasesitolo\n• Thenga ngobuningi ngesikhathi samaphakheji\n• Cabanga ukushintshela kumashini kagesi akhokhelwa kusengaphambili\n• Joyina iStokvel yokonga ngeqembu\n• Sebenzisa izimoto zomphakathi noma ukushara izimoto\n\nKhumbula: Ukonga okuncane kuqonda umsilazayo ngokuhamba kwesikhathi.`,
        stokvel: `AmaStokvel ayisiko elihle kakhulu eNingizimu Afrika lokonga.\n\nIzinzuzo:\n• Ukuziphendulela kweqembu\n• Ukuzijwayeza ukonga njalo\n• Ukusekelwa komphakathi\n• Amandla okuthenga kaningi\n\nUngakha noma ujoyine iStokvel ngqo ku-app. Qala nomndeni noma abangani abathembekile futhi ubeke umnikelo wenyanga osebenzela wonke umuntu.`,
        emergency: `Isikhwama sezingozi sibalulekile ekuvikelekeni kwezezimali.\n\nIsincomo: Hloselela izinyanga ezingu-3-6 zezindleko (R${(monthlyBudget * 3).toLocaleString()} - R${(monthlyBudget * 6).toLocaleString()}).\n\nNgokonga kwakho kwamanje okubala u-R${userData.totalSaved.toLocaleString()}, ${userData.totalSaved >= monthlyBudget * 3 ? 'uhamba kahle!' : `u-R${((monthlyBudget * 3) - userData.totalSaved).toLocaleString()} ukude nesikhwama sezinyanga ezi-3.`}\n\nQala kancane: Ngisho no-R50 ngeviki kuqoqa ku-R2,600 ngonyaka.`,
        general: `Umbuzo omuhle! Wenza kahle ngokuthi uhambe nohambo lwakho lwezezimali.\n\nImpumelelo yakho:\n• ${userData.streak} izinsuku zokulandelana kokonga\n• Impumelelo yezinga ${userData.level}\n• U-R${userData.totalSaved.toLocaleString()} konke okongile\n\nQhubeka ugxile ku:\n• Igyomo lakho elithi "${userData.goal.name}"\n• Jwayelana nesimiso sansuku zonke\n• Ukulandelela ukusetshenziswa kwemali yakho\n• Cabanga ukujoyina iStokvel\n\nKhumbula: Lonke iRandi elogcinwayo liyisinyathelo esilungele inkululeko yezezimali.`
      },
      st: {
        goal: `Ho latela tswelo pele ya hao ya hona joale, o fihlile ho ${goalProgress}% ya sepheo sa hao se reng "${userData.goal.name}".\n\nHo fihla sepheo sa hao sa R${userData.goal.amount.toLocaleString()}, o hloka R${(userData.goal.amount - userData.goal.saved).toLocaleString()} e eketsehileng.\n\nKeletso: Leka ho beha ka thoko R${Math.ceil((userData.goal.amount - userData.goal.saved) / 12).toLocaleString()} ka kgwedi ho fihla sepheo sa hao ka selemo.`,
        budget: `Tekanyetso ya hao ya kgwedi ke R${monthlyBudget.toLocaleString()}. Dikeletso tse ding tsa ho boloka tsa Afrika Borwa:\n\n• Sebedisa mananeo a botshepahali a mabenkele a dijo\n• Reka ka bongata nakong ya dithekiso tse khethehileng\n• Nahana ka ho fetohela ho motlakase o lefellwang esale pele\n• Kena Stokvel ya ho boloka ka sehlopha\n• Sebedisa dipalangwang tsa setjhaba kapa ho arolelana dikoloi\n\nHopola: Ho boloka ho honyane ho eketseha ho ba diphetho tse kgolo ka nako.`,
        stokvel: `DiStokvel ke setso se setle haholo sa Afrika Borwa sa ho boloka.\n\nMelemo:\n• Boikarabello ba sehlopha\n• Tlwaelo ya ho boloka ka linako\n• Tshehetso ya setjhaba\n• Matla a ho reka ka bongata\n\nO ka theha kapa o kene Stokvel hantle ka app. Qala ka lelapa kapa metswalle e tsheptjwang mme o behathe tefo ya kgwedi e sebetsang ho bohle.`,
        emergency: `Letlotlo la maemo a tshohanyetso le bohlokwa bakeng sa tshireletso ya ditjhelete.\n\nKeletso: Ikemisetse dikgwedi tse 3-6 tsa ditshenyehelo (R${(monthlyBudget * 3).toLocaleString()} - R${(monthlyBudget * 6).toLocaleString()}).\n\nKa poloko ya hao ya hona joale ya R${userData.totalSaved.toLocaleString()}, ${userData.totalSaved >= monthlyBudget * 3 ? 'o tswela pele hantle!' : `o hole ka R${((monthlyBudget * 3) - userData.totalSaved).toLocaleString()} ho letlotlo la motheo la dikgwedi tse 3.`}\n\nQala ho honyane: Le R50 ka beke e eketseha ho R2,600 ka selemo.`,
        general: `Potso e ntle! O etsa hantle ka leeto la hao la ditjhelete.\n\nDiphihlelo tsa hao:\n• Malatsi a ${userData.streak} a tswellopele ya poloko\n• Phihlelo ya boemo ba ${userData.level}\n• R${userData.totalSaved.toLocaleString()} kaofela e bolokilweng\n\nTswella o tsepame ho:\n• Sepheo sa hao se reng "${userData.goal.name}"\n• Ditlwaelo tse tshwanang tsa letsatsi le letsatsi\n• Ho latelela tshebediso ya tjhelete ya hao\n• Nahana ka ho kena Stokvel\n\nHopola: Rand e nngwe le e nngwe e bolokilweng ke mohato ho tokoloho ya ditjhelete.`
      }
    };

    const langResponses = responses[language as keyof typeof responses] || responses.en;
    
    if (lowerQuestion.includes('goal') || lowerQuestion.includes('target') || lowerQuestion.includes('sphe')) {
      return langResponses.goal;
    }
    
    if (lowerQuestion.includes('budget') || lowerQuestion.includes('spend') || lowerQuestion.includes('tekanyetso')) {
      return langResponses.budget;
    }
    
    if (lowerQuestion.includes('stokvel')) {
      return langResponses.stokvel;
    }
    
    if (lowerQuestion.includes('emergency') || lowerQuestion.includes('fund') || lowerQuestion.includes('tshohanyetso')) {
      return langResponses.emergency;
    }
    
    // Default response
    return langResponses.general;
  };

  const handleVoiceInput = (transcript: string) => {
    setInput(transcript);
    // Auto-send voice input after a short delay
    setTimeout(() => {
      handleSendMessage(transcript);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageContent = (content: string) => {
    // Split by lines and format
    return content.split('\n').map((line, index) => {
      // Check if line contains key indicators without emojis
      if (line.includes('Quick Summary:') || line.includes('Total Saved:') || line.includes('Main Goal:') || 
          line.includes('Streak:') || line.includes('Level:') || line.includes('Benefits:') || 
          line.includes('Recommendation:') || line.includes('Your achievements:')) {
        return (
          <div key={index} className="font-medium text-primary mb-1">
            {line}
          </div>
        );
      }
      
      // Empty lines for spacing
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      
      // Regular content
      return (
        <div key={index} className="mb-1">
          {line}
        </div>
      );
    });
  };

  const suggestedQuestions = {
    en: [
      "How can I reach my savings goal faster?",
      "Analyze my spending patterns",
      "Help me create a better budget",
      "How much should I save for emergencies?",
      "Tell me about Stokvels",
      "Give me saving tips for South Africa"
    ],
    zu: [
      "Ngingafinyelela kanjani igyomo lami lokonga ngokushesha?",
      "Hlaziya indlela yami yokusebenzisa imali",
      "Ngisiza ngenze ibhajethi engcono",
      "Kufanele ngonge malini ezingozini?",
      "Ngitshele ngamaStokvel",
      "Nginike amacebo okonga eNingizimu Afrika"
    ],
    st: [
      "Nka fihla sepheo sa poloko jwang kapele?",
      "Hlahloba mokgwa wa ka wa ho sebedisa tjhelete",
      "Nthuse ho etsa tekanyetso e betere",
      "Ke lokela ho boloka bokae bakeng sa maemo a tshohanyetso?",
      "Mpolelle ka diStokvel",
      "Mphe dikeletso tsa poloko Afrika Borwa"
    ]
  };

  const currentSuggestions = suggestedQuestions[language as keyof typeof suggestedQuestions] || suggestedQuestions.en;

  const getStatusBadge = () => {
    switch (geminiStatus) {
      case 'checking':
        return (
          <Badge variant="secondary" className="gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span className="text-xs">Connecting...</span>
          </Badge>
        );
      case 'available':
        return (
          <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
            <Wifi className="w-3 h-3" />
            <span className="text-xs">Gemini AI</span>
          </Badge>
        );
      case 'invalid-key':
        return (
          <Badge variant="destructive" className="gap-1">
            <Key className="w-3 h-3" />
            <span className="text-xs">Invalid API Key</span>
          </Badge>
        );
      case 'unavailable':
        return (
          <Badge variant="outline" className="gap-1">
            <WifiOff className="w-3 h-3" />
            <span className="text-xs">Offline Mode</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  const openApiKeyGuide = () => {
    window.open('https://makersuite.google.com/app/apikey', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              {/* KS Logo */}
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">KS</span>
              </div>
              <div>
                <h1 className="font-medium">{t('ai.title') || 'AI Financial Coach'}</h1>
                <p className="text-xs text-muted-foreground">
                  {t('ai.subtitle') || 'Your personal savings assistant'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {(geminiStatus === 'unavailable' || geminiStatus === 'invalid-key') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={retryGeminiConnection}
                className="gap-1"
                title="Retry connection to Gemini AI"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-xs">Retry</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* API Key Setup Alert */}
        {showApiKeyInfo && geminiStatus === 'invalid-key' && (
          <div className="p-4 pt-0">
            <Alert>
              <Key className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <strong>Gemini AI Setup Required:</strong> To enable advanced AI responses, set up your Google AI API key.
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openApiKeyGuide}
                    className="gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Get API Key
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApiKeyInfo(false)}
                  >
                    Dismiss
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Chat Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-primary-foreground">KS</span>
                  </div>
                )}
                
                <Card className={`max-w-[80%] ${message.type === 'user' ? 'bg-primary text-primary-foreground' : ''}`}>
                  <CardContent className="p-3">
                    {message.isTyping ? (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-sm">{message.content}</span>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm whitespace-pre-wrap">
                          {message.type === 'ai' ? formatMessageContent(message.content) : message.content}
                        </div>
                        
                        {/* AI Source indicator */}
                        {message.type === 'ai' && !message.isTyping && (
                          <div className="mt-2 pt-2 border-t border-muted/20">
                            <div className="flex items-center gap-1">
                              {message.isGeminiResponse ? (
                                <>
                                  <Wifi className="w-3 h-3 text-green-500" />
                                  <span className="text-xs text-muted-foreground">Powered by Gemini AI</span>
                                </>
                              ) : (
                                <>
                                  <WifiOff className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">Offline AI response</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className={`flex items-center justify-between mt-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`text-xs opacity-70 ${message.type === 'user' ? 'text-left' : 'text-left'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      
                      {/* Speak button for AI messages */}
                      {message.type === 'ai' && !message.isTyping && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (speakingMessageId === message.id) {
                              stopSpeaking();
                            } else {
                              speakMessage(message.id, message.content);
                            }
                          }}
                          className="opacity-70 hover:opacity-100 h-6 px-2"
                          title={speakingMessageId === message.id ? "Stop speaking" : "Speak this message"}
                        >
                          {speakingMessageId === message.id ? (
                            <>
                              <VolumeX className="w-3 h-3 mr-1" />
                              <span className="text-xs">Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3 mr-1" />
                              <span className="text-xs">Speak</span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {/* Suggested Questions */}
            {messages.length <= 1 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                  {t('ai.suggested_questions') || 'Try asking me about:'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentSuggestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage(question)}
                      className="justify-start text-left h-auto p-3 whitespace-normal"
                      disabled={isLoading}
                    >
                      <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* API Key Setup Info */}
            {showApiKeyInfo && geminiStatus !== 'invalid-key' && (
              <div className="mt-8">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p><strong>Enable Advanced AI:</strong> To get personalized Gemini AI responses, set up your Google AI API key.</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openApiKeyGuide}
                          className="gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Get Free API Key
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowApiKeyInfo(false)}
                        >
                          Continue with Offline Mode
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Set VITE_GEMINI_API_KEY in your environment variables after getting your key.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            {/* Invisible div for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-card p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('ai.input_placeholder') || "Ask me about your finances, goals, or saving tips..."}
                  disabled={isLoading}
                  className="min-h-[2.5rem] resize-none"
                />
              </div>
              
              {/* Voice Input */}
              <VoiceAI
                ref={voiceAIRef}
                onSpeechResult={handleVoiceInput}
                onListeningChange={setIsListening}
                disabled={isLoading}
              />
              
              {/* Send Button */}
              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                size="default"
                className="px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {isListening && (
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {t('ai.listening') || 'Listening... Speak your question'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
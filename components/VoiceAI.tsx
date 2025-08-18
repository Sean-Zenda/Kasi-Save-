import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Button } from './ui/button';
import { Mic, MicOff, Volume2, VolumeX, AlertCircle, Shield } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { googleTTSService } from '../services/google-tts-service';
import { toast } from 'sonner';

interface VoiceAIProps {
  onSpeechResult: (text: string) => void;
  onListeningChange: (isListening: boolean) => void;
  disabled?: boolean;
}

interface VoiceAIRef {
  speak: (text: string) => Promise<void>;
  startListening: () => void;
  stopListening: () => void;
  isListening: boolean;
  isSpeaking: boolean;
}

export const VoiceAI = forwardRef<VoiceAIRef, VoiceAIProps>(({
  onSpeechResult,
  onListeningChange,
  disabled = false
}, ref) => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');
  const [isSecureContext, setIsSecureContext] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Language codes mapping for speech recognition
  const speechLanguageCodes = {
    en: 'en-US',
    zu: 'en-US', // Fallback to English - zu-ZA may not be supported in all browsers
    st: 'en-US'  // Fallback to English - st-ZA may not be supported in all browsers
  };

  useEffect(() => {
    console.log('VoiceAI component initializing...');
    
    // Check if we're in a secure context (required for speech recognition)
    const secure = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    setIsSecureContext(secure);
    console.log('Secure context:', secure);

    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSupported = !!(SpeechRecognition && secure);
    setSpeechSupported(speechSupported);
    console.log('Speech recognition supported:', speechSupported);

    // Check for TTS support
    const ttsAvailable = googleTTSService.isAvailable();
    setTtsSupported(ttsAvailable);
    console.log('TTS supported:', ttsAvailable);

    // Check microphone permissions
    checkMicrophonePermission();

    if (speechSupported) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsRecording(true);
        setPermissionStatus('granted');
        onListeningChange(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognition result:', transcript);
        onSpeechResult(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        setIsListening(false);
        setIsRecording(false);
        onListeningChange(false);

        // Handle specific error types
        switch (event.error) {
          case 'not-allowed':
            setPermissionStatus('denied');
            if (!isSecureContext) {
              toast.error(t('voice.https_required') || 'Voice input requires HTTPS. Please access the site securely.');
            } else {
              toast.error(t('voice.permission_denied') || 'Microphone permission denied. Please enable microphone access in your browser settings.');
            }
            break;
          case 'no-speech':
            toast.info(t('voice.no_speech') || 'No speech detected. Please try again.');
            break;
          case 'audio-capture':
            toast.error(t('voice.audio_error') || 'Audio capture error. Please check your microphone.');
            break;
          case 'network':
            toast.error(t('voice.network_error') || 'Network error. Speech recognition requires an internet connection.');
            break;
          case 'service-not-allowed':
            toast.error(t('voice.service_not_allowed') || 'Speech recognition service not allowed. Please try again.');
            break;
          case 'aborted':
            // Silent handling for user-initiated stops
            break;
          default:
            toast.error(t('voice.error_general') || `Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        setIsRecording(false);
        onListeningChange(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, [onListeningChange, onSpeechResult, t, isSecureContext]);

  useEffect(() => {
    // Update recognition language when language changes
    if (recognitionRef.current) {
      const langCode = speechLanguageCodes[language as keyof typeof speechLanguageCodes] || 'en-US';
      recognitionRef.current.lang = langCode;
      console.log('Updated speech recognition language to:', langCode);
    }
  }, [language]);

  const checkMicrophonePermission = async () => {
    if (!navigator.permissions) {
      setPermissionStatus('unknown');
      return;
    }

    try {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setPermissionStatus(permissionStatus.state as 'granted' | 'denied' | 'prompt');
      console.log('Microphone permission status:', permissionStatus.state);
      
      // Listen for permission changes
      permissionStatus.onchange = () => {
        setPermissionStatus(permissionStatus.state as 'granted' | 'denied' | 'prompt');
      };
    } catch (error) {
      console.log('Could not check microphone permission:', error);
      setPermissionStatus('unknown');
    }
  };

  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported');
      }

      console.log('Requesting microphone permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Immediately stop the stream as we only wanted to get permission
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionStatus('granted');
      console.log('Microphone permission granted');
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      setPermissionStatus('denied');
      return false;
    }
  };

  const startListening = async () => {
    if (!speechSupported || !recognitionRef.current || disabled) {
      if (!isSecureContext) {
        toast.error(t('voice.https_required') || 'Voice input requires a secure connection (HTTPS).');
      } else {
        toast.error(t('voice.not_supported') || 'Voice input not supported on this device');
      }
      return;
    }

    // Check secure context
    if (!isSecureContext) {
      toast.error(t('voice.https_required') || 'Voice input requires HTTPS. Please access the site securely.');
      return;
    }

    // Check microphone permission first
    if (permissionStatus === 'denied') {
      toast.error(t('voice.permission_required') || 'Microphone permission is required for voice input. Please enable it in your browser settings.');
      return;
    }

    if (permissionStatus === 'prompt' || permissionStatus === 'unknown') {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        toast.error(t('voice.permission_required') || 'Microphone permission is required for voice input');
        return;
      }
    }

    try {
      console.log('Starting speech recognition...');
      setIsListening(true);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      onListeningChange(false);
      
      if (error instanceof Error && error.message.includes('already started')) {
        // Recognition is already running, try to stop and restart
        recognitionRef.current.stop();
        setTimeout(() => {
          try {
            if (recognitionRef.current) {
              recognitionRef.current.start();
            }
          } catch (retryError) {
            console.error('Retry error:', retryError);
            toast.error(t('voice.start_error') || 'Could not start voice recognition. Please try again.');
          }
        }, 100);
      } else {
        toast.error(t('voice.start_error') || 'Could not start voice recognition. Please try again.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      console.log('Stopping speech recognition...');
      recognitionRef.current.stop();
    }
    setIsListening(false);
    onListeningChange(false);
  };

  const speak = async (text: string) => {
    if (!text || disabled || isSpeaking) return;

    console.log('Starting TTS for text:', text.substring(0, 50) + '...');

    // Stop any current audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    setIsSpeaking(true);

    try {
      // Try Google Cloud TTS first
      if (ttsSupported) {
        console.log('Using Google TTS...');
        await googleTTSService.speak(text, language);
        console.log('Google TTS completed successfully');
      } else {
        // Fallback to browser TTS
        console.log('Using browser TTS fallback...');
        await fallbackTTS(text);
        console.log('Browser TTS completed successfully');
      }
    } catch (error) {
      console.error('Error with Google TTS, falling back to browser TTS:', error);
      try {
        await fallbackTTS(text);
        console.log('Fallback TTS completed successfully');
      } catch (fallbackError) {
        console.error('Error with fallback TTS:', fallbackError);
        toast.error(t('voice.tts_error') || 'Could not speak the text. Please check your audio settings.');
      }
    } finally {
      setIsSpeaking(false);
    }
  };

  const fallbackTTS = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
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

        utterance.onend = () => {
          console.log('Browser TTS finished');
          resolve();
        };
        
        utterance.onerror = (event) => {
          console.error('Browser TTS error:', event.error);
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        // Wait a bit before speaking to ensure synthesis is ready
        setTimeout(() => {
          console.log('Starting browser TTS...');
          window.speechSynthesis.speak(utterance);
        }, 100);
      } else {
        reject(new Error('Speech synthesis not supported'));
      }
    });
  };

  const stopSpeaking = () => {
    console.log('Stopping TTS...');
    
    // Stop Google TTS audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    // Stop browser TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    speak,
    startListening,
    stopListening,
    isListening,
    isSpeaking
  }), [isListening, isSpeaking]);

  const getSpeechButtonState = () => {
    if (!isSecureContext) {
      return { icon: Shield, text: 'HTTPS Required', variant: 'outline' as const, disabled: true };
    }
    
    if (permissionStatus === 'denied') {
      return { icon: AlertCircle, text: 'Permission Denied', variant: 'outline' as const, disabled: true };
    }
    
    if (isListening) {
      return { icon: MicOff, text: isRecording ? 'Recording...' : 'Stop', variant: 'default' as const, disabled: false };
    }
    
    return { icon: Mic, text: permissionStatus === 'prompt' ? 'Allow Mic' : (t('voice.speak') || 'Speak'), variant: 'outline' as const, disabled: false };
  };

  const speechButtonState = getSpeechButtonState();

  return (
    <div className="flex items-center gap-2">
      {/* Speech Recognition Button */}
      {speechSupported && (
        <Button
          variant={speechButtonState.variant}
          size="sm"
          onClick={isListening ? stopListening : startListening}
          disabled={disabled || isSpeaking || speechButtonState.disabled}
          className="gap-2"
          title={!isSecureContext ? 'HTTPS required for voice input' : ''}
        >
          <speechButtonState.icon className="w-4 h-4" />
          <span className="text-xs">
            {speechButtonState.text}
          </span>
        </Button>
      )}

      {/* Text-to-Speech Button */}
      <Button
        variant={isSpeaking ? "default" : "outline"}
        size="sm"
        onClick={stopSpeaking}
        disabled={disabled || !isSpeaking}
        className="gap-2"
        title={isSpeaking ? "Stop speaking" : "AI will speak responses"}
      >
        {isSpeaking ? (
          <>
            <VolumeX className="w-4 h-4" />
            <span className="text-xs">{t('voice.stop') || 'Stop'}</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span className="text-xs">{t('voice.voice') || 'Voice'}</span>
          </>
        )}
      </Button>

      {/* Status indicators */}
      {isRecording && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">
            {t('voice.listening') || 'Listening...'}
          </span>
        </div>
      )}

      {isSpeaking && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">
            {t('voice.speaking') || 'Speaking...'}
          </span>
        </div>
      )}

      {/* Connection status for non-secure contexts */}
      {!isSecureContext && (
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-orange-500" />
          <span className="text-xs text-muted-foreground">Secure connection needed</span>
        </div>
      )}
    </div>
  );
});

VoiceAI.displayName = 'VoiceAI';

// Custom hook for easy voice integration
export const useVoiceAI = () => {
  const [isListening, setIsListening] = useState(false);
  const voiceRef = useRef<VoiceAIRef | null>(null);

  const speak = async (text: string) => {
    if (voiceRef.current) {
      await voiceRef.current.speak(text);
    }
  };

  return {
    isListening,
    speak,
    voiceRef
  };
};

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
import { googleTTSService } from './google-tts-service';
import { geminiAIService } from '../backend/gemini-ai-service';

// Service health monitoring
export class ServiceHealth {
  static async getServiceStatus() {
    const status = {
      googleTTS: false,
      browserTTS: false,
      speechRecognition: false,
      geminiAI: false,
      microphonePermission: 'unknown' as 'granted' | 'denied' | 'prompt' | 'unknown',
      isSecureContext: false,
      voiceCapabilities: false
    };

    try {
      // Check secure context
      status.isSecureContext = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';

      // Check Google TTS
      status.googleTTS = googleTTSService.isAvailable();

      // Check browser TTS
      status.browserTTS = 'speechSynthesis' in window;

      // Check speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      status.speechRecognition = !!(SpeechRecognition && status.isSecureContext);

      // Check Gemini AI
      status.geminiAI = geminiAIService.isServiceAvailable();

      // Check microphone permissions
      if (navigator.permissions) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          status.microphonePermission = permissionStatus.state as 'granted' | 'denied' | 'prompt';
        } catch (error) {
          console.log('Could not check microphone permission:', error);
          status.microphonePermission = 'unknown';
        }
      }

      // Overall voice capabilities
      status.voiceCapabilities = (status.googleTTS || status.browserTTS) && status.speechRecognition;

    } catch (error) {
      console.error('Error checking service status:', error);
    }

    return status;
  }

  static async runDiagnostics() {
    console.log('=== KasiSave Voice Services Diagnostics ===');
    
    const status = await this.getServiceStatus();
    
    console.log('🔊 Text-to-Speech Services:');
    console.log(`  Google TTS: ${status.googleTTS ? '✅' : '❌'}`);
    console.log(`  Browser TTS: ${status.browserTTS ? '✅' : '❌'}`);
    
    console.log('🎤 Speech Recognition:');
    console.log(`  Available: ${status.speechRecognition ? '✅' : '❌'}`);
    console.log(`  Microphone Permission: ${status.microphonePermission}`);
    
    console.log('🤖 AI Services:');
    console.log(`  Gemini AI: ${status.geminiAI ? '✅' : '❌'}`);
    
    console.log('🔒 Security & Context:');
    console.log(`  Secure Context (HTTPS): ${status.isSecureContext ? '✅' : '❌'}`);
    console.log(`  Overall Voice Capabilities: ${status.voiceCapabilities ? '✅' : '❌'}`);
    
    if (!status.isSecureContext) {
      console.warn('⚠️ Voice input requires HTTPS or localhost');
    }
    
    if (status.microphonePermission === 'denied') {
      console.warn('⚠️ Microphone permission denied - voice input unavailable');
    }
    
    console.log('=== End Diagnostics ===');
    
    return status;
  }
}

// Export services
export { googleTTSService };
export { geminiAIService };

// Type definitions
export interface ServiceStatus {
  googleTTS: boolean;
  browserTTS: boolean;
  speechRecognition: boolean;
  geminiAI: boolean;
  microphonePermission: 'granted' | 'denied' | 'prompt' | 'unknown';
  isSecureContext: boolean;
  voiceCapabilities: boolean;
}

// Helper function to run diagnostics in development - only run in browser environment
if (typeof window !== 'undefined' && import.meta.env?.MODE === 'development') {
  // Run diagnostics after a short delay to allow services to initialize
  setTimeout(() => {
    ServiceHealth.runDiagnostics();
  }, 2000);
}
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Volume2, 
  Mic, 
  Wifi, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { ServiceHealth } from '../services/index';
import { googleTTSService } from '../services/google-tts-service';
import { toast } from 'sonner';

interface ServiceStatus {
  googleTTS: boolean;
  browserTTS: boolean;
  speechRecognition: boolean;
  geminiAI: boolean;
  microphonePermission: 'granted' | 'denied' | 'prompt' | 'unknown';
  isSecureContext: boolean;
  voiceCapabilities: boolean;
}

export const VoiceDebugPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    checkServiceStatus();
  }, []);

  const checkServiceStatus = async () => {
    setLoading(true);
    try {
      const serviceStatus = await ServiceHealth.getServiceStatus();
      setStatus(serviceStatus as ServiceStatus);
    } catch (error) {
      console.error('Error checking service status:', error);
      toast.error('Failed to check service status');
    } finally {
      setLoading(false);
    }
  };

  const testGoogleTTS = async () => {
    setTesting(true);
    try {
      await googleTTSService.speak("This is a test of Google Text to Speech service", 'en');
      toast.success('Google TTS test completed successfully');
    } catch (error) {
      console.error('Google TTS test failed:', error);
      toast.error('Google TTS test failed - check console for details');
    } finally {
      setTesting(false);
    }
  };

  const testBrowserTTS = async () => {
    setTesting(true);
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("This is a test of browser text to speech");
        utterance.rate = 0.9;
        utterance.onend = () => {
          toast.success('Browser TTS test completed');
          setTesting(false);
        };
        utterance.onerror = () => {
          toast.error('Browser TTS test failed');
          setTesting(false);
        };
        window.speechSynthesis.speak(utterance);
      } else {
        toast.error('Browser TTS not supported');
        setTesting(false);
      }
    } catch (error) {
      console.error('Browser TTS test failed:', error);
      toast.error('Browser TTS test failed');
      setTesting(false);
    }
  };

  const testSpeechRecognition = async () => {
    setTesting(true);
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = () => {
          toast.info('Speech recognition started - say something!');
        };
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          toast.success(`Speech recognition test completed. You said: "${transcript}"`);
          setTesting(false);
        };
        
        recognition.onerror = (event) => {
          toast.error(`Speech recognition test failed: ${event.error}`);
          setTesting(false);
        };
        
        recognition.onend = () => {
          setTesting(false);
        };
        
        recognition.start();
      } else {
        toast.error('Speech recognition not supported');
        setTesting(false);
      }
    } catch (error) {
      console.error('Speech recognition test failed:', error);
      toast.error('Speech recognition test failed');
      setTesting(false);
    }
  };

  const resetGoogleTTS = () => {
    googleTTSService.reset();
    toast.info('Google TTS service reset');
    checkServiceStatus();
  };

  const getStatusIcon = (isWorking: boolean) => {
    return isWorking ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getPermissionBadge = (permission: string) => {
    const colors = {
      granted: 'bg-green-500',
      denied: 'bg-red-500', 
      prompt: 'bg-yellow-500',
      unknown: 'bg-gray-500'
    };
    return (
      <Badge className={`${colors[permission as keyof typeof colors]} text-white`}>
        {permission}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Voice Services Diagnostic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Checking service status...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Voice Services Diagnostic
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status && (
          <>
            {/* Service Status */}
            <div className="space-y-3">
              <h3 className="font-medium">Service Status</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm">Google TTS</span>
                  </div>
                  {getStatusIcon(status.googleTTS)}
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm">Browser TTS</span>
                  </div>
                  {getStatusIcon(status.browserTTS)}
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    <span className="text-sm">Speech Recognition</span>
                  </div>
                  {getStatusIcon(status.speechRecognition)}
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm">Gemini AI</span>
                  </div>
                  {getStatusIcon(status.geminiAI)}
                </div>
              </div>
            </div>

            {/* Security & Permissions */}
            <div className="space-y-3">
              <h3 className="font-medium">Security & Permissions</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Secure Context (HTTPS)</span>
                  </div>
                  {getStatusIcon(status.isSecureContext)}
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    <span className="text-sm">Microphone Permission</span>
                  </div>
                  {getPermissionBadge(status.microphonePermission)}
                </div>
              </div>
            </div>

            {/* Test Buttons */}
            <div className="space-y-3">
              <h3 className="font-medium">Test Services</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={testGoogleTTS}
                  disabled={!status.googleTTS || testing}
                >
                  Test Google TTS
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={testBrowserTTS}
                  disabled={!status.browserTTS || testing}
                >
                  Test Browser TTS
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={testSpeechRecognition}
                  disabled={!status.speechRecognition || testing}
                >
                  Test Speech Recognition
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetGoogleTTS}
                  disabled={testing}
                >
                  Reset Google TTS
                </Button>
              </div>
            </div>

            {/* Troubleshooting Tips */}
            <div className="space-y-3">
              <h3 className="font-medium">Troubleshooting Tips</h3>
              
              <div className="p-3 bg-muted rounded-lg space-y-2 text-sm">
                {!status.isSecureContext && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                    <span>Voice features require HTTPS. Use a secure connection.</span>
                  </div>
                )}
                
                {status.microphonePermission === 'denied' && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <span>Microphone access denied. Check browser settings and reload the page.</span>
                  </div>
                )}
                
                {!status.googleTTS && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <span>Google TTS unavailable. Using browser TTS as fallback.</span>
                  </div>
                )}
                
                {!status.speechRecognition && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <span>Speech recognition not supported in this browser or requires HTTPS.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex justify-center">
              <Button variant="outline" onClick={checkServiceStatus} disabled={loading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
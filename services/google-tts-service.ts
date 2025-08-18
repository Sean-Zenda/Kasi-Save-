// Google Cloud Text-to-Speech Service
interface TTSRequest {
  text: string;
  languageCode: string;
  voiceName?: string;
  ssmlGender?: 'NEUTRAL' | 'FEMALE' | 'MALE';
}

interface TTSResponse {
  audioContent: string;
}

class GoogleTTSService {
  private serviceAccount = {
    type: "service_account",
    project_id: "famous-augury-469314-b0",
    private_key_id: "a0eb9dc723c631e0da3e352a7623dcd64ddb6600",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCWzf7iE0QbHuGP\naf3G9DAs/yaEhFzHURdt4V+BeU94DsVTW/yuaX75eCskqpdC/sbut6zJOzKTSluO\nyQVW8Bgol46iTtWq7GejFx5xVnmvRF7M5FJ+Rq4x5UJApVbazv/CrettibfHE/+d\nMts9W+oTknLltPTOTfzxNqobFfrkZrPB4X3IEkCs9hVeo25I23v93aLmGSc5bp4K\nKWMry056AehHv2oNB7BOxKQ15A7z22VQImBMAh0DadyPuw7dkBICWNBQ011OEyfG\ntxmITStC3a/nl8VusMvNoTYoZNs4tubIXofWZMObRQuByiOkTPnVGcWTAirvb5mw\ny57T1PELAgMBAAECggEAM6bkySxOJHfkTAnCqVVT9uWBnNv1JzOoMbOC0cbqKDXu\n8klMd7Scj/fP1yQy4PiAzJzOqrIC9Z3/VB2YHZnovGaErSURXBTSvnKZs7opvZVO\nXyFI/AVbfq2GjrvSzukdguGtBHyqHJ7F62LS4uZLe16qyfC79LmTjE7r3pEduQLJ\nc7+Rlu3QEELKtGmcqr4jL5yWZUOTv5+nLpprFzO5v7lHE7EESv/62NFNU/BMQ8fL\nCV4jx4papUhORpLet1QbH+lJOgZ8Q6v1fY9iOfvdJOEmEIXii4IYVEAa93luySi2\n4MeMSCOy7OAH0IizIeICfkRvnNcmd7rECWhyjXN3SQKBgQDQdvlH0bXFaos7nNjy\npr9FGHOUu5hR2glKIuOM7M2k+Uf7sCXocBT5wuvlC8TDYGX5V1AFRwNBBuSEWI4B\nGlbn6kUIaZ4qTkJT118saiCRd/dMmoeiC+B8Kumw1M1ntv7DoJzWD1V0gGnR6pFV\nGv/kucuJDLOHdWEdWolkQaO5zwKBgQC5MSTMv7SjsxAMGEHgklnqE8yuvr25BLaC\nGcbw4VaJ/4LpFHTi3Dq2Ws4U7LlS8Ui0zNfobefDRtWGNjpNemJF4xBVyOXGI+LV\nfc/KnViqtWYb7zzVDe7dsBnZYi9bqg1C2sU6q8qhJ55fkrj8w5yF3HeC3YVsR5mL\nj2bfUtywBQKBgGbBPj7Yb/DPg7HurkFtT/qPAundTkeKYenZKLDeSL944LJ/MTBR\njwVNv1k3Y9WqPpmZICh5yHDVJO7Xd6ezhALsxvpOlVflG2yYTKFn7oXFzHBF+3U0\nxYJu5KH1QwpMeWeUU7pv9H9ojMCcDucUV+42Zs03JYcvpJ8DcZWphTqhAoGAWAxE\nedB/mwEMlSOHVrVeaItHWqG3ZFsYRtzomCga0/uWiyi9tgqNI5witRIjvoqXTdbC\npHB0q4RnCquHpsSUKrQdVRvyGvV+6JArliKfQHKEfK2PF6DLO715XMBw0b0VFv8a\nnJ2G9n32r2v75bk/FunOLHsT73pPR2pDt9QWtt0CgYALvD/B9Z9f7sDkVU3Lhd+V\nbyx0FWzrQX3Pg8KEa3SDGTxP0cb/NB7JgurBvdNQoa/9ylaWpQJRK+vOY2FlCvzX\nh1Bvz5aC5o4ArJ8ojKFFZb34k0PY6BR5t2AUO9ZkvMD2lsUuHWWO/c1R392TDxmO\nkDDZUc+gmi2IodA6D2lYMQ==\n-----END PRIVATE KEY-----\n",
    client_email: "tts-service-329@famous-augury-469314-b0.iam.gserviceaccount.com",
    client_id: "113533525627337165919",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/tts-service-329%40famous-augury-469314-b0.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  };

  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private isServiceEnabled = true;

  // Voice configurations for different languages
  private voiceConfig = {
    'en': { languageCode: 'en-US', name: 'en-US-Journey-F', ssmlGender: 'FEMALE' as const },
    'zu': { languageCode: 'en-US', name: 'en-US-Journey-F', ssmlGender: 'FEMALE' as const }, // Fallback to English for Zulu
    'st': { languageCode: 'en-US', name: 'en-US-Journey-F', ssmlGender: 'FEMALE' as const }  // Fallback to English for Sotho
  };

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      console.log('Getting new access token...');
      
      // Create JWT for Google OAuth
      const jwt = await this.createJWT();
      
      // Exchange JWT for access token
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token request failed:', response.status, errorText);
        throw new Error(`Failed to get access token: ${response.status}`);
      }

      const tokenData = await response.json();
      this.accessToken = tokenData.access_token;
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000) - 60000; // Subtract 1 minute for safety

      console.log('Successfully obtained access token');
      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      this.isServiceEnabled = false;
      throw error;
    }
  }

  private async createJWT(): Promise<string> {
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: this.serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: this.serviceAccount.token_uri,
      exp: now + 3600,
      iat: now
    };

    // Encode header and payload
    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));

    const signingInput = `${encodedHeader}.${encodedPayload}`;

    try {
      // Import the private key for signing
      const privateKey = await this.importPrivateKey(this.serviceAccount.private_key);
      
      // Sign the JWT
      const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        privateKey,
        new TextEncoder().encode(signingInput)
      );

      const encodedSignature = this.base64UrlEncode(signature);

      return `${signingInput}.${encodedSignature}`;
    } catch (error) {
      console.error('Error creating JWT:', error);
      throw error;
    }
  }

  private base64UrlEncode(data: string | ArrayBuffer): string {
    let base64: string;
    
    if (typeof data === 'string') {
      base64 = btoa(data);
    } else {
      base64 = btoa(String.fromCharCode(...new Uint8Array(data)));
    }
    
    return base64.replace(/[+/]/g, (char) => char === '+' ? '-' : '_').replace(/=/g, '');
  }

  private async importPrivateKey(privateKeyPem: string): Promise<CryptoKey> {
    try {
      // Remove PEM headers and whitespace
      const privateKeyBase64 = privateKeyPem
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s/g, '');

      // Convert base64 to ArrayBuffer
      const binaryString = atob(privateKeyBase64);
      const privateKeyBuffer = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        privateKeyBuffer[i] = binaryString.charCodeAt(i);
      }

      // Import the key
      return await crypto.subtle.importKey(
        'pkcs8',
        privateKeyBuffer,
        {
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256'
        },
        false,
        ['sign']
      );
    } catch (error) {
      console.error('Error importing private key:', error);
      throw error;
    }
  }

  async synthesizeSpeech(request: TTSRequest): Promise<Blob> {
    if (!this.isServiceEnabled) {
      throw new Error('Google TTS service is disabled');
    }

    try {
      console.log('Synthesizing speech for text:', request.text.substring(0, 50) + '...');
      
      const accessToken = await this.getAccessToken();
      const voiceConfig = this.voiceConfig[request.languageCode as keyof typeof this.voiceConfig] || this.voiceConfig.en;

      const requestBody = {
        input: { text: request.text },
        voice: {
          languageCode: voiceConfig.languageCode,
          name: voiceConfig.name,
          ssmlGender: request.ssmlGender || voiceConfig.ssmlGender
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 1.0,
          pitch: 0.0,
          volumeGainDb: 0.0
        }
      };

      console.log('Making TTS API request...');

      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('TTS API error:', response.status, errorText);
        
        if (response.status === 401) {
          // Token might be expired, reset it
          this.accessToken = null;
        }
        
        throw new Error(`TTS API error: ${response.status}`);
      }

      const data: TTSResponse = await response.json();
      
      if (!data.audioContent) {
        throw new Error('No audio content in TTS response');
      }
      
      // Convert base64 audio to blob
      const audioData = atob(data.audioContent);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }

      console.log('Successfully synthesized speech, audio length:', audioArray.length);
      return new Blob([audioArray], { type: 'audio/mpeg' });
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      this.isServiceEnabled = false;
      throw error;
    }
  }

  async speak(text: string, languageCode: string = 'en'): Promise<void> {
    if (!text || text.trim().length === 0) {
      console.log('No text to speak');
      return;
    }

    try {
      console.log('Speaking text:', text.substring(0, 100) + '...');
      
      const audioBlob = await this.synthesizeSpeech({
        text: text.trim(),
        languageCode
      });

      // Create audio element and play
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          console.log('Audio playback finished');
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        audio.onerror = (event) => {
          console.error('Audio playback error:', event);
          URL.revokeObjectURL(audioUrl);
          reject(new Error('Audio playback failed'));
        };
        
        audio.oncanplaythrough = () => {
          console.log('Audio ready to play');
        };
        
        console.log('Starting audio playback...');
        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('Error speaking text:', error);
      throw error;
    }
  }

  // Check if TTS is available
  isAvailable(): boolean {
    const hasRequiredAPIs = 'crypto' in window && 
                           'subtle' in crypto && 
                           'fetch' in window &&
                           this.isServiceEnabled;
    
    console.log('Google TTS available:', hasRequiredAPIs);
    return hasRequiredAPIs;
  }

  // Reset service state (useful for retry)
  reset(): void {
    this.accessToken = null;
    this.tokenExpiry = 0;
    this.isServiceEnabled = true;
    console.log('Google TTS service reset');
  }
}

// Singleton instance
export const googleTTSService = new GoogleTTSService();

// Export types
export type { TTSRequest, TTSResponse };
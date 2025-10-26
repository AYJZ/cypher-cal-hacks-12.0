// Microsoft Azure Speech Service for accurate Mandarin Chinese
// This provides the most accurate Mandarin pronunciation with proper tones

// Azure Speech Service credentials
const AZURE_SPEECH_KEY = 'DM7A8px87O5bCeDTfL9cAMiRVqYgbrY0PfDlAQcUHzMdYDkbfpr0JQQJ99BJACYeBjFXJ3w3AAAYACOGuWMU';
const AZURE_SPEECH_REGION = 'eastus';

// Available Azure voices for Mandarin Chinese
export const AZURE_VOICES = {
  // Female voices
  xiaoxiao: {
    id: 'zh-CN-XiaoxiaoNeural',
    name: '晓晓',
    gender: 'female',
    description: 'Warm and friendly female voice',
    style: 'general',
  },
  xiaoyi: {
    id: 'zh-CN-XiaoyiNeural',
    name: '晓伊',
    gender: 'female',
    description: 'Young and energetic female voice',
    style: 'cheerful',
  },
  xiaoxuan: {
    id: 'zh-CN-XiaoxuanNeural',
    name: '晓萱',
    gender: 'female',
    description: 'Calm and soothing female voice',
    style: 'calm',
  },
  xiaohan: {
    id: 'zh-CN-XiaohanNeural',
    name: '晓涵',
    gender: 'female',
    description: 'Professional female voice',
    style: 'professional',
  },
  xiaomeng: {
    id: 'zh-CN-XiaomengNeural',
    name: '晓梦',
    gender: 'female',
    description: 'Young girl voice',
    style: 'young',
  },
  xiaoyan: {
    id: 'zh-CN-XiaoyanNeural',
    name: '晓颜',
    gender: 'female',
    description: 'Storytelling female voice',
    style: 'storytelling',
  },
  
  // Male voices
  yunxi: {
    id: 'zh-CN-YunxiNeural',
    name: '云希',
    gender: 'male',
    description: 'Professional male voice',
    style: 'professional',
  },
  yunyang: {
    id: 'zh-CN-YunyangNeural',
    name: '云扬',
    gender: 'male',
    description: 'News anchor male voice',
    style: 'newscast',
  },
  yunjian: {
    id: 'zh-CN-YunjianNeural',
    name: '云健',
    gender: 'male',
    description: 'Energetic male voice',
    style: 'energetic',
  },
  yunxia: {
    id: 'zh-CN-YunxiaNeural',
    name: '云夏',
    gender: 'male',
    description: 'Young male voice',
    style: 'young',
  },
  yunfeng: {
    id: 'zh-CN-YunfengNeural',
    name: '云枫',
    gender: 'male',
    description: 'Calm male voice',
    style: 'calm',
  },
  
  // Special voices
  liaoning: {
    id: 'zh-CN-liaoning-XiaobeiNeural',
    name: '晓北',
    gender: 'female',
    description: 'Liaoning dialect female voice',
    style: 'regional',
  },
  shaanxi: {
    id: 'zh-CN-shaanxi-XiaoniNeural',
    name: '晓妮',
    gender: 'female',
    description: 'Shaanxi dialect female voice',
    style: 'regional',
  },
} as const;

export type AzureVoiceKey = keyof typeof AZURE_VOICES;

export async function generateSpeech(text: string, voiceName: string = 'zh-CN-XiaoxiaoNeural'): Promise<string> {
  try {
    console.log('=== Generating Speech with Azure TTS ===');
    console.log('Text:', text);
    
    // Azure Speech endpoint
    const endpoint = `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
    
    // SSML for better control over pronunciation
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">
        <voice name="${voiceName}">
          <prosody rate="0.85">
            ${text}
          </prosody>
        </voice>
      </speak>
    `.trim();
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      },
      body: ssml,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure Speech API error:', response.status, errorText);
      throw new Error(`Failed to generate speech: ${response.status}`);
    }

    // Get the audio as a blob
    const audioBlob = await response.blob();
    
    // Convert to blob URL
    const audioUrl = URL.createObjectURL(audioBlob);
    
    console.log('Speech generated successfully with Azure');
    return audioUrl;
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}

// Helper function to get voice ID from key
export function getVoiceId(voiceKey: AzureVoiceKey): string {
  return AZURE_VOICES[voiceKey].id;
}

// Helper function to generate speech with voice key instead of full ID
export async function generateSpeechWithVoice(text: string, voiceKey: AzureVoiceKey = 'xiaoxiao'): Promise<string> {
  const voiceId = getVoiceId(voiceKey);
  return generateSpeech(text, voiceId);
}

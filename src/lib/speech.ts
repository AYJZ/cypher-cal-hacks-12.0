// Browser's built-in speech synthesis for Mandarin Chinese
// Enhanced version with better voice selection and error handling

// Wait for voices to load
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    
    // Wait for voices to load
    speechSynthesis.addEventListener('voiceschanged', () => {
      resolve(speechSynthesis.getVoices());
    }, { once: true });
  });
}

export async function generateSpeech(text: string): Promise<string> {
  try {
    console.log('=== Generating Speech with Browser TTS ===');
    console.log('Text:', text);
    
    // Check if speech synthesis is available
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported in this browser');
    }
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    // Get available voices
    const voices = await loadVoices();
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    
    // Rank Chinese voices by preference
    const chineseVoices = voices.filter(voice => 
      voice.lang === 'zh-CN' || 
      voice.lang === 'zh-TW' ||
      voice.lang === 'zh-HK' ||
      voice.lang.startsWith('zh') ||
      voice.lang === 'cmn-CN' ||
      voice.name.toLowerCase().includes('chinese') ||
      voice.name.includes('中文')
    );
    
    // Sort by preference: zh-CN (Mainland) > zh-TW (Taiwan) > zh-HK (Hong Kong)
    chineseVoices.sort((a, b) => {
      if (a.lang === 'zh-CN') return -1;
      if (b.lang === 'zh-CN') return 1;
      if (a.lang === 'zh-TW') return -1;
      if (b.lang === 'zh-TW') return 1;
      return 0;
    });
    
    console.log('Chinese voices found:', chineseVoices.map(v => `${v.name} (${v.lang})`));
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (chineseVoices.length > 0) {
      utterance.voice = chineseVoices[0];
      console.log('Using Chinese voice:', chineseVoices[0].name, chineseVoices[0].lang);
    } else {
      console.warn('No Chinese voice found, using default with zh-CN language');
    }
    
    // Set properties for clear pronunciation
    utterance.lang = 'zh-CN';
    utterance.rate = 0.75; // Slower speed for learning
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Since browser TTS doesn't return audio data, we'll return a special marker
    // The actual playback will happen through the speechSynthesis API
    speechSynthesis.speak(utterance);
    
    // Return a special URL that indicates we're using browser TTS
    return 'browser-tts:' + text;
    
  } catch (error) {
    console.error('Error with browser TTS:', error);
    throw error;
  }
}

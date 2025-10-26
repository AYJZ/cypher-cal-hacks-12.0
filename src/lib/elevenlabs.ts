// Browser's built-in speech synthesis for Mandarin Chinese
// This works locally without any API keys

export async function generateSpeech(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      console.log('=== Generating Speech with Browser TTS ===');
      console.log('Text:', text);
      
      // Check if speech synthesis is available
      if (!('speechSynthesis' in window)) {
        throw new Error('Speech synthesis not supported in this browser');
      }
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices
      const voices = speechSynthesis.getVoices();
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      
      // Find a Chinese voice (prefer zh-CN for Beijing dialect)
      const chineseVoice = voices.find(voice => 
        voice.lang === 'zh-CN' || 
        voice.lang.startsWith('zh-') || 
        voice.lang === 'cmn-CN'
      );
      
      if (chineseVoice) {
        utterance.voice = chineseVoice;
        console.log('Using Chinese voice:', chineseVoice.name, chineseVoice.lang);
      } else {
        console.warn('No Chinese voice found, using default');
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
      resolve('browser-tts:' + text);
      
    } catch (error) {
      console.error('Error with browser TTS:', error);
      reject(error);
    }
  });
}

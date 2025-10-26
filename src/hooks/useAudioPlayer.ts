import { useState, useCallback, useRef } from "react";
import { generateSpeech } from "@/lib/azure-speech";
import { useToast } from "@/hooks/use-toast";

/**
 * Shared audio player hook based on /pinyin page implementation
 * Provides consistent audio playback across the app with proper state management
 */
export function useAudioPlayer() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { toast } = useToast();
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  /**
   * Play audio for Chinese text
   * @param text - Chinese text to speak
   * @param id - Unique identifier for this audio (for tracking playback state)
   * @param voiceName - Optional Azure voice name (defaults to Xiaoxiao)
   */
  const playAudio = useCallback(async (
    text: string, 
    id: string, 
    voiceName: string = 'zh-CN-XiaoxiaoNeural'
  ) => {
    try {
      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      
      // Cleanup previous URL
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = null;
      }

      setPlayingId(id);
      
      // Generate speech using Azure TTS
      const audioUrl = await generateSpeech(text, voiceName);
      currentUrlRef.current = audioUrl;
      
      // Create and play audio
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      
      audio.onended = () => {
        setPlayingId(null);
        currentAudioRef.current = null;
        if (currentUrlRef.current) {
          URL.revokeObjectURL(currentUrlRef.current);
          currentUrlRef.current = null;
        }
      };
      
      audio.onerror = (error) => {
        console.error("Audio playback error:", error);
        setPlayingId(null);
        currentAudioRef.current = null;
        toast({
          title: "Audio Error",
          description: "⚠️ Audio unavailable — please try again.",
          variant: "destructive",
        });
      };
      
      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setPlayingId(null);
      currentAudioRef.current = null;
      toast({
        title: "Audio Error",
        description: "⚠️ Audio unavailable — please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  /**
   * Stop currently playing audio
   */
  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }
    setPlayingId(null);
  }, []);

  /**
   * Check if specific audio is currently playing
   */
  const isPlaying = useCallback((id: string) => {
    return playingId === id;
  }, [playingId]);

  return {
    playAudio,
    stopAudio,
    isPlaying,
    playingId,
  };
}
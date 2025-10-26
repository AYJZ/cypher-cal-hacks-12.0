import { useState } from "react";
import { Volume2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateSpeech } from "@/lib/azure-speech";

interface VocabularyTooltipProps {
  chinese: string;
  pinyin: string;
  english: string;
  onSave?: () => void;
}

export const VocabularyTooltip = ({
  chinese,
  pinyin,
  english,
  onSave,
}: VocabularyTooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayAudio = async () => {
    try {
      setIsLoading(true);
      let url = audioUrl;
      if (!url) {
        // Generate speech using Azure
        url = await generateSpeech(chinese);
        setAudioUrl(url);
      }
      const audio = new Audio(url);
      audio.play();
    } catch (e) {
      console.error("Failed to play audio", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (onSave) onSave();
    setVisible(false);
  };

  return (
    <div className="relative inline-block">
      <span
        className="cursor-pointer hover:bg-accent/20 rounded px-0.5 transition-colors"
        onClick={() => setVisible(!visible)}
      >
        {chinese}
      </span>
      
      {visible && (
        <>
          {/* Backdrop to close on click outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setVisible(false)}
          />
          
          {/* Tooltip */}
          <div
            className={cn(
              "absolute z-50 mt-2 left-1/2 -translate-x-1/2",
              "w-48 p-3 rounded-xl glass gradient-edge shadow-glow",
              "animate-fade-in"
            )}
          >
            <div className="text-center space-y-2">
              {/* Chinese character */}
              <div className="text-xl font-medium text-foreground">
                {chinese}
              </div>
              
              {/* Pinyin */}
              <div className="text-sm text-muted-foreground">
                {pinyin}
              </div>
              
              {/* English meaning */}
              <div className="text-sm text-foreground font-light">
                {english}
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2 pt-2 border-t border-border/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayAudio}
                  disabled={isLoading}
                  className="flex-1 h-8 gap-1.5 hover:bg-accent/20"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span className="text-xs">{isLoading ? 'Loading...' : 'Play'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="flex-1 h-8 gap-1.5 hover:bg-accent/20"
                >
                  <Star className="h-3.5 w-3.5" />
                  <span className="text-xs">Save</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

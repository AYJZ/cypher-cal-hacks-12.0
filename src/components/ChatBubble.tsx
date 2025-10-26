import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages, BookOpen, Volume2 } from "lucide-react";
import { VocabularyTooltip } from "./VocabularyTooltip";
import { generateSpeech } from "@/lib/azure-speech";
import { useToast } from "@/hooks/use-toast";

interface MessageSegment {
  chinese: string;
  pinyin: string;
  english: string;
}

interface ChatBubbleProps {
  message: {
    role: "user" | "assistant";
    content: string | { segments: MessageSegment[] };
  };
  voiceName?: string; // Azure voice ID for TTS
}

const ChatBubble = ({ message, voiceName }: ChatBubbleProps) => {
  const isUser = message.role === "user";
  const [showPinyin, setShowPinyin] = useState(false); // Hide pinyin by default
  const [showEnglish, setShowEnglish] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  // Check if content is structured
  const isStructured = typeof message.content === "object" && message.content !== null && "segments" in message.content;
  const segments = isStructured ? (message.content as { segments: MessageSegment[] }).segments : [];

  // Play audio for the message
  const playAudio = async () => {
    if (!isStructured || isUser) return;
    
    try {
      setIsPlaying(true);
      // Get full Chinese text
      const chineseText = segments.map(s => s.chinese).join("");
      const voice = voiceName || 'zh-CN-XiaoxiaoNeural';
      
      const audioUrl = await generateSpeech(chineseText, voice);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        toast({
          title: "Audio Error",
          description: "Failed to play audio",
          variant: "destructive",
        });
      };
      
      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
      toast({
        title: "Audio Error", 
        description: "Failed to play audio",
        variant: "destructive",
      });
    }
  };

  // Helper function to render Chinese text with pinyin above
  const renderChineseWithPinyin = (segment: MessageSegment) => {
    if (!segment.chinese) return null;

    // Split Chinese and Pinyin for proper alignment
    const chineseChars = segment.chinese.split("");
    const pinyinWords = segment.pinyin ? segment.pinyin.split(" ") : [];

    return (
      <span className="inline-flex flex-wrap items-end">
        {chineseChars.map((char, idx) => {
          const pinyinWord = pinyinWords[idx] || "";
          
          // Always show pinyin with ruby annotations when available
          if (showPinyin && pinyinWord) {
            return (
              <ruby key={idx} className="chinese-text text-lg mx-0.5">
                <VocabularyTooltip
                  chinese={char}
                  pinyin={pinyinWord}
                  english={segment.english.split(/[，。！？]/)[0]} // First part of translation
                  onSave={() => {
                    console.log("Saved:", char, pinyinWord);
                  }}
                />
                <rt className="text-xs text-muted-foreground" style={{ fontSize: "0.65em" }}>
                  {pinyinWord}
                </rt>
              </ruby>
            );
          }
          
          // Without pinyin, just show character with tooltip
          return (
            <VocabularyTooltip
              key={idx}
              chinese={char}
              pinyin={pinyinWord}
              english={segment.english.split(/[，。！？]/)[0]}
              onSave={() => {
                console.log("Saved:", char, pinyinWord);
              }}
            />
          );
        })}
      </span>
    );
  };

  // If plain text, render normally
  if (!isStructured) {
    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-up`}>
        <Card
          className={`max-w-[80%] p-5 glass gradient-edge ${
            isUser
              ? "bg-primary/10 text-foreground"
              : "bg-card/70 text-card-foreground"
          } border-none shadow-float hover:shadow-glow transition-all duration-300`}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed font-light">
            {message.content as string}
          </div>
        </Card>
      </div>
    );
  }

  // Render structured content with toggles
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-up`}>
      <Card
        className={`max-w-[80%] p-5 glass gradient-edge ${
          isUser
            ? "bg-primary/10 text-foreground"
            : "bg-card/70 text-card-foreground"
        } border-none shadow-float hover:shadow-glow transition-all duration-300`}
      >
        <div className="space-y-3">
          {/* Toggleable content: Chinese with Pinyin OR English translation */}
          <div className="leading-loose transition-all duration-200">
            {showEnglish ? (
              // Show English translation
              <div className="text-sm text-muted-foreground font-light">
                {segments.map((segment, idx) => (
                  <span key={idx}>{segment.english}{idx < segments.length - 1 ? ' ' : ''}</span>
                ))}
              </div>
            ) : (
              // Show Chinese with Pinyin
              <div className="text-base">
                {segments.map((segment, idx) => (
                  <span key={idx}>{renderChineseWithPinyin(segment)}</span>
                ))}
              </div>
            )}
          </div>

          {/* Toggle buttons - minimalist icon style */}
          <div className="flex gap-2 pt-3 border-t border-border/20">
            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={playAudio}
                disabled={isPlaying}
                className={`h-8 px-3 text-xs gap-1.5 font-light transition-all duration-200 hover:bg-accent/10 ${
                  isPlaying ? "animate-pulse" : ""
                }`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>听</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPinyin(!showPinyin)}
              disabled={showEnglish}
              className={`h-8 px-3 text-xs gap-1.5 font-light transition-all duration-200 ${
                showPinyin ? "bg-accent/20 text-accent-foreground scale-105" : "hover:bg-accent/10"
              } ${showEnglish ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>拼</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEnglish(!showEnglish)}
              className={`h-8 px-3 text-xs gap-1.5 font-light transition-all duration-200 ${
                showEnglish ? "bg-accent/20 text-accent-foreground scale-105" : "hover:bg-accent/10"
              }`}
            >
              <Languages className="h-3.5 w-3.5" />
              <span>{showEnglish ? "中" : "EN"}</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatBubble;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Volume2, Check, X } from "lucide-react";
import { generateSpeech } from "@/lib/azure-speech";
import { useToast } from "@/hooks/use-toast";

interface Question {
  word: string;
  pinyin: string;
  tone: number;
  meaning: string;
}

const wordBank: Question[] = [
  // Tone 1 - High level tone
  { word: "妈", pinyin: "mā", tone: 1, meaning: "mother" },
  { word: "天", pinyin: "tiān", tone: 1, meaning: "sky/day" },
  { word: "书", pinyin: "shū", tone: 1, meaning: "book" },
  { word: "车", pinyin: "chē", tone: 1, meaning: "car" },
  { word: "花", pinyin: "huā", tone: 1, meaning: "flower" },
  { word: "家", pinyin: "jiā", tone: 1, meaning: "home" },
  { word: "师", pinyin: "shī", tone: 1, meaning: "teacher" },
  { word: "一", pinyin: "yī", tone: 1, meaning: "one" },
  { word: "猫", pinyin: "māo", tone: 1, meaning: "cat" },
  { word: "高", pinyin: "gāo", tone: 1, meaning: "tall" },
  { word: "三", pinyin: "sān", tone: 1, meaning: "three" },
  { word: "山", pinyin: "shān", tone: 1, meaning: "mountain" },
  { word: "中", pinyin: "zhōng", tone: 1, meaning: "middle" },
  { word: "听", pinyin: "tīng", tone: 1, meaning: "listen" },
  { word: "星", pinyin: "xīng", tone: 1, meaning: "star" },
  { word: "生", pinyin: "shēng", tone: 1, meaning: "birth" },
  { word: "风", pinyin: "fēng", tone: 1, meaning: "wind" },
  { word: "光", pinyin: "guāng", tone: 1, meaning: "light" },
  { word: "关", pinyin: "guān", tone: 1, meaning: "close" },
  { word: "安", pinyin: "ān", tone: 1, meaning: "peace" },
  { word: "班", pinyin: "bān", tone: 1, meaning: "class" },
  { word: "杯", pinyin: "bēi", tone: 1, meaning: "cup" },
  { word: "春", pinyin: "chūn", tone: 1, meaning: "spring" },
  { word: "灯", pinyin: "dēng", tone: 1, meaning: "lamp" },
  { word: "低", pinyin: "dī", tone: 1, meaning: "low" },
  { word: "分", pinyin: "fēn", tone: 1, meaning: "minute" },
  { word: "歌", pinyin: "gē", tone: 1, meaning: "song" },
  { word: "黑", pinyin: "hēi", tone: 1, meaning: "black" },
  { word: "鸡", pinyin: "jī", tone: 1, meaning: "chicken" },
  { word: "开", pinyin: "kāi", tone: 1, meaning: "open" },
  { word: "拉", pinyin: "lā", tone: 1, meaning: "pull" },
  { word: "千", pinyin: "qiān", tone: 1, meaning: "thousand" },
  { word: "他", pinyin: "tā", tone: 1, meaning: "he" },
  { word: "新", pinyin: "xīn", tone: 1, meaning: "new" },
  { word: "音", pinyin: "yīn", tone: 1, meaning: "sound" },
  { word: "真", pinyin: "zhēn", tone: 1, meaning: "real" },
  { word: "知", pinyin: "zhī", tone: 1, meaning: "know" },
  { word: "八", pinyin: "bā", tone: 1, meaning: "eight" },
  { word: "今", pinyin: "jīn", tone: 1, meaning: "today" },

  // Tone 2 - Rising tone
  { word: "茶", pinyin: "chá", tone: 2, meaning: "tea" },
  { word: "红", pinyin: "hóng", tone: 2, meaning: "red" },
  { word: "来", pinyin: "lái", tone: 2, meaning: "come" },
  { word: "年", pinyin: "nián", tone: 2, meaning: "year" },
  { word: "钱", pinyin: "qián", tone: 2, meaning: "money" },
  { word: "人", pinyin: "rén", tone: 2, meaning: "person" },
  { word: "时", pinyin: "shí", tone: 2, meaning: "time" },
  { word: "学", pinyin: "xué", tone: 2, meaning: "study" },
  { word: "鱼", pinyin: "yú", tone: 2, meaning: "fish" },
  { word: "长", pinyin: "cháng", tone: 2, meaning: "long" },
  { word: "成", pinyin: "chéng", tone: 2, meaning: "become" },
  { word: "回", pinyin: "huí", tone: 2, meaning: "return" },
  { word: "名", pinyin: "míng", tone: 2, meaning: "name" },
  { word: "平", pinyin: "píng", tone: 2, meaning: "flat" },
  { word: "头", pinyin: "tóu", tone: 2, meaning: "head" },
  { word: "同", pinyin: "tóng", tone: 2, meaning: "same" },
  { word: "完", pinyin: "wán", tone: 2, meaning: "finish" },
  { word: "王", pinyin: "wáng", tone: 2, meaning: "king" },
  { word: "文", pinyin: "wén", tone: 2, meaning: "text" },
  { word: "无", pinyin: "wú", tone: 2, meaning: "none" },
  { word: "行", pinyin: "xíng", tone: 2, meaning: "walk" },
  { word: "羊", pinyin: "yáng", tone: 2, meaning: "sheep" },
  { word: "园", pinyin: "yuán", tone: 2, meaning: "garden" },
  { word: "云", pinyin: "yún", tone: 2, meaning: "cloud" },
  { word: "白", pinyin: "bái", tone: 2, meaning: "white" },
  { word: "从", pinyin: "cóng", tone: 2, meaning: "from" },
  { word: "和", pinyin: "hé", tone: 2, meaning: "and" },
  { word: "男", pinyin: "nán", tone: 2, meaning: "male" },
  { word: "朋", pinyin: "péng", tone: 2, meaning: "friend" },
  { word: "球", pinyin: "qiú", tone: 2, meaning: "ball" },
  { word: "谁", pinyin: "shéi", tone: 2, meaning: "who" },
  { word: "题", pinyin: "tí", tone: 2, meaning: "topic" },
  { word: "寻", pinyin: "xún", tone: 2, meaning: "seek" },
  { word: "言", pinyin: "yán", tone: 2, meaning: "speech" },
  { word: "原", pinyin: "yuán", tone: 2, meaning: "origin" },
  { word: "直", pinyin: "zhí", tone: 2, meaning: "straight" },

  // Tone 3 - Falling-rising tone
  { word: "你", pinyin: "nǐ", tone: 3, meaning: "you" },
  { word: "好", pinyin: "hǎo", tone: 3, meaning: "good" },
  { word: "我", pinyin: "wǒ", tone: 3, meaning: "I/me" },
  { word: "有", pinyin: "yǒu", tone: 3, meaning: "have" },
  { word: "小", pinyin: "xiǎo", tone: 3, meaning: "small" },
  { word: "水", pinyin: "shuǐ", tone: 3, meaning: "water" },
  { word: "米", pinyin: "mǐ", tone: 3, meaning: "rice" },
  { word: "五", pinyin: "wǔ", tone: 3, meaning: "five" },
  { word: "马", pinyin: "mǎ", tone: 3, meaning: "horse" },
  { word: "买", pinyin: "mǎi", tone: 3, meaning: "buy" },
  { word: "美", pinyin: "měi", tone: 3, meaning: "beautiful" },
  { word: "狗", pinyin: "gǒu", tone: 3, meaning: "dog" },
  { word: "古", pinyin: "gǔ", tone: 3, meaning: "ancient" },
  { word: "老", pinyin: "lǎo", tone: 3, meaning: "old" },
  { word: "两", pinyin: "liǎng", tone: 3, meaning: "two (items)" },
  { word: "起", pinyin: "qǐ", tone: 3, meaning: "rise" },
  { word: "手", pinyin: "shǒu", tone: 3, meaning: "hand" },
  { word: "土", pinyin: "tǔ", tone: 3, meaning: "earth" },
  { word: "晚", pinyin: "wǎn", tone: 3, meaning: "late" },
  { word: "舞", pinyin: "wǔ", tone: 3, meaning: "dance" },
  { word: "写", pinyin: "xiě", tone: 3, meaning: "write" },
  { word: "雨", pinyin: "yǔ", tone: 3, meaning: "rain" },
  { word: "早", pinyin: "zǎo", tone: 3, meaning: "early" },
  { word: "走", pinyin: "zǒu", tone: 3, meaning: "walk" },
  { word: "左", pinyin: "zuǒ", tone: 3, meaning: "left" },
  { word: "北", pinyin: "běi", tone: 3, meaning: "north" },
  { word: "本", pinyin: "běn", tone: 3, meaning: "root/this" },
  { word: "给", pinyin: "gěi", tone: 3, meaning: "give" },
  { word: "果", pinyin: "guǒ", tone: 3, meaning: "fruit" },
  { word: "几", pinyin: "jǐ", tone: 3, meaning: "how many" },
  { word: "可", pinyin: "kě", tone: 3, meaning: "can" },
  { word: "口", pinyin: "kǒu", tone: 3, meaning: "mouth" },
  { word: "里", pinyin: "lǐ", tone: 3, meaning: "inside" },
  { word: "脸", pinyin: "liǎn", tone: 3, meaning: "face" },
  { word: "女", pinyin: "nǚ", tone: 3, meaning: "female" },
  { word: "请", pinyin: "qǐng", tone: 3, meaning: "please" },
  { word: "想", pinyin: "xiǎng", tone: 3, meaning: "think" },

  // Tone 4 - Falling tone
  { word: "爱", pinyin: "ài", tone: 4, meaning: "love" },
  { word: "爸", pinyin: "bà", tone: 4, meaning: "father" },
  { word: "不", pinyin: "bù", tone: 4, meaning: "not" },
  { word: "菜", pinyin: "cài", tone: 4, meaning: "vegetable" },
  { word: "大", pinyin: "dà", tone: 4, meaning: "big" },
  { word: "的", pinyin: "de", tone: 4, meaning: "(possessive)" },
  { word: "地", pinyin: "dì", tone: 4, meaning: "ground" },
  { word: "对", pinyin: "duì", tone: 4, meaning: "correct" },
  { word: "二", pinyin: "èr", tone: 4, meaning: "two" },
  { word: "饭", pinyin: "fàn", tone: 4, meaning: "rice/meal" },
  { word: "个", pinyin: "gè", tone: 4, meaning: "(measure word)" },
  { word: "过", pinyin: "guò", tone: 4, meaning: "pass" },
  { word: "后", pinyin: "hòu", tone: 4, meaning: "after" },
  { word: "话", pinyin: "huà", tone: 4, meaning: "speech" },
  { word: "会", pinyin: "huì", tone: 4, meaning: "can/will" },
  { word: "见", pinyin: "jiàn", tone: 4, meaning: "see" },
  { word: "叫", pinyin: "jiào", tone: 4, meaning: "call" },
  { word: "看", pinyin: "kàn", tone: 4, meaning: "look" },
  { word: "快", pinyin: "kuài", tone: 4, meaning: "fast" },
  { word: "乐", pinyin: "lè", tone: 4, meaning: "happy" },
  { word: "六", pinyin: "liù", tone: 4, meaning: "six" },
  { word: "路", pinyin: "lù", tone: 4, meaning: "road" },
  { word: "骂", pinyin: "mà", tone: 4, meaning: "scold" },
  { word: "卖", pinyin: "mài", tone: 4, meaning: "sell" },
  { word: "面", pinyin: "miàn", tone: 4, meaning: "face/noodle" },
  { word: "木", pinyin: "mù", tone: 4, meaning: "wood" },
  { word: "去", pinyin: "qù", tone: 4, meaning: "go" },
  { word: "日", pinyin: "rì", tone: 4, meaning: "day/sun" },
  { word: "上", pinyin: "shàng", tone: 4, meaning: "up/on" },
  { word: "四", pinyin: "sì", tone: 4, meaning: "four" },
  { word: "太", pinyin: "tài", tone: 4, meaning: "too" },
  { word: "万", pinyin: "wàn", tone: 4, meaning: "ten thousand" },
  { word: "问", pinyin: "wèn", tone: 4, meaning: "ask" },
  { word: "下", pinyin: "xià", tone: 4, meaning: "down" },
  { word: "谢", pinyin: "xiè", tone: 4, meaning: "thank" },
  { word: "要", pinyin: "yào", tone: 4, meaning: "want" },
  { word: "月", pinyin: "yuè", tone: 4, meaning: "moon/month" },
  { word: "在", pinyin: "zài", tone: 4, meaning: "at/in" },
  { word: "这", pinyin: "zhè", tone: 4, meaning: "this" },
]; 

// Ensure tones match pinyin diacritics across the entire word bank
const deriveToneFromPinyin = (pinyin: string): number => {
  const toneSets = [
    { chars: 'āēīōūǖĀĒĪŌŪǕ', tone: 1 },
    { chars: 'áéíóúǘÁÉÍÓÚǗ', tone: 2 },
    { chars: 'ǎěǐǒǔǚǍĚǏǑǓǙ', tone: 3 },
    { chars: 'àèìòùǜÀÈÌÒÙǛ', tone: 4 },
  ];
  for (const { chars, tone } of toneSets) {
    if ([...pinyin].some((ch) => chars.includes(ch))) return tone;
  }
  return 0; // neutral or missing mark
};

// Normalize tones once at module load
const normalizedWordBank: Question[] = wordBank
  .map((q) => {
    const derived = deriveToneFromPinyin(q.pinyin);
    // Always use the derived tone if it's valid (1-4)
    if (derived >= 1 && derived <= 4) {
      return { ...q, tone: derived };
    }
    // If no tone mark found, check if the original tone is valid
    // This handles edge cases where pinyin might not have tone marks
    if (q.tone >= 1 && q.tone <= 4) {
      console.warn(`No tone mark found in pinyin "${q.pinyin}" for word "${q.word}", using provided tone ${q.tone}`);
      return q;
    }
    // Skip words with invalid tones
    console.error(`Invalid tone for word "${q.word}" with pinyin "${q.pinyin}"`);
    return null;
  })
  .filter((q): q is Question => q !== null && q.tone >= 1 && q.tone <= 4);

interface TonePracticeProps {
  onClose: () => void;
}

export const TonePractice = ({ onClose }: TonePracticeProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [audioCache, setAudioCache] = useState<Map<string, string>>(new Map());
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Shuffle and select 4 random words from the normalized wordbank
    const shuffled = [...normalizedWordBank].sort(() => Math.random() - 0.5).slice(0, 4);
    setSessionQuestions(shuffled);
    
    // Cleanup function to revoke all blob URLs
    return () => {
      audioCache.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const loadAudioForQuestion = async (chineseCharacter: string) => {
    // If already cached, don't reload
    if (audioCache.has(chineseCharacter)) {
      return;
    }
    
    setIsLoadingAudio(true);
    
    try {
      // Explicitly log what we're sending to ensure it's Chinese characters
      console.log(`Loading Mandarin audio for Chinese character: "${chineseCharacter}"`);
      console.log(`Character code points:`, [...chineseCharacter].map(c => c.codePointAt(0)));
      
      // Generate speech using local ElevenLabs integration
      const audioUrl = await generateSpeech(chineseCharacter);
      
      // Cache the audio URL
      setAudioCache(prev => new Map(prev).set(chineseCharacter, audioUrl));
      
      console.log('Audio loaded successfully for:', chineseCharacter);
    } catch (err: any) {
      console.error(`Error loading ${chineseCharacter}:`, err);
      console.error('Full error object:', err);
      console.error('Error type:', err?.constructor?.name);
      console.error('Error message:', err?.message);
      
      // Check if it's an API key issue
      if (err?.message?.includes('401') || err?.message?.includes('403')) {
        toast({
          title: "API Key Error",
          description: "Please update your ElevenLabs API key in src/lib/elevenlabs.ts",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Audio Error",
          description: err?.message || "Failed to load audio. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // Load audio for the current question when it changes
  useEffect(() => {
    if (sessionQuestions.length > 0 && !showSummary) {
      // Explicitly get the Chinese character from the question
      const currentQuestion_data = sessionQuestions[currentQuestion];
      const chineseCharacter = currentQuestion_data.word;
      console.log(`Current question - Chinese: "${chineseCharacter}", Pinyin: ${currentQuestion_data.pinyin}, Tone: ${currentQuestion_data.tone}`);
      loadAudioForQuestion(chineseCharacter);
    }
  }, [currentQuestion, sessionQuestions, showSummary]);

  const playAudio = async () => {
    if (sessionQuestions.length === 0) return;
    
    // Get the Chinese character to play
    const chineseCharacter = sessionQuestions[currentQuestion].word;
    const cachedUrl = audioCache.get(chineseCharacter);
    
    console.log(`Playing audio for Chinese character: "${chineseCharacter}"`);
    
    if (!cachedUrl) {
      toast({
        title: "Audio Not Ready",
        description: "Please wait for audio to load.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPlaying(true);
    
    try {
      // Azure returns a blob URL, so we can use regular audio playback
      const audio = new Audio(cachedUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        toast({
          title: "Audio Error",
          description: "Failed to play audio. Please try again.",
          variant: "destructive",
        });
      };
      
      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      toast({
        title: "Audio Error",
        description: "Failed to play audio. Please try again.",
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (sessionQuestions.length > 0 && currentQuestion === 0 && !showSummary && !isLoadingAudio && audioCache.has(sessionQuestions[0].word)) {
      // Auto-play first question after audio is loaded
      setTimeout(() => playAudio(), 500);
    }
  }, [sessionQuestions, isLoadingAudio, audioCache]);

  const handleAnswer = async (selectedTone: number) => {
    if (feedback) return; // Prevent multiple clicks

    const correct = selectedTone === sessionQuestions[currentQuestion].tone;
    setFeedback(correct ? "correct" : "incorrect");

    if (correct) {
      setScore(score + 1);
      // Move to next immediately after correct answer
      setTimeout(() => {
        moveToNext();
      }, 1000);
    } else {
      // For incorrect answer, just show feedback and move on (don't replay)
        setTimeout(() => {
          moveToNext();
      }, 1500);
    }
  };

  const moveToNext = () => {
    setFeedback(null);
    if (currentQuestion < sessionQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      // Play audio immediately when moving to next question
      setTimeout(() => playAudio(), 100);
    } else {
      setShowSummary(true);
    }
  };

  // Test function to debug audio loading
  const testAudioLoading = async () => {
    console.log('=== Testing Audio Loading ===');
    try {
      const testChar = '妈';
      console.log('Testing with character:', testChar);
      
      const audioUrl = await generateSpeech(testChar);
      console.log('Test successful - Audio URL:', audioUrl);
      
      // Play the test audio
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (err) {
      console.error('Test failed - Exception:', err);
    }
  };

  if (sessionQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <div>Loading...</div>
        <Button onClick={testAudioLoading} variant="outline">
          Test Audio Loading
        </Button>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 animate-fade-in">
          <h2 className="text-3xl font-light text-foreground">Practice Complete!</h2>
          <div className="text-6xl font-light text-primary animate-scale-in">
            {score}/{sessionQuestions.length}
          </div>
          <p className="text-xl text-muted-foreground">
            {score >= 8 ? "Excellent work!" : score >= 6 ? "Good job!" : "Keep practicing!"}
          </p>
          <div className="flex gap-4 justify-center">
          <Button
            onClick={() => {
              setCurrentQuestion(0);
              setScore(0);
              setShowSummary(false);
              setFeedback(null);
                const shuffled = [...normalizedWordBank].sort(() => Math.random() - 0.5).slice(0, 10);
              setSessionQuestions(shuffled);
              setAudioCache(new Map()); // Clear cache for new session
            }}
            className="btn-3d"
          >
            Practice Again
          </Button>
          <Button onClick={onClose} variant="outline">
            Back to Lessons
          </Button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / sessionQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        {/* Progress Bar */}
        <div className="space-y-2 animate-fade-in">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {sessionQuestions.length}</span>
            <span>{score} correct</span>
          </div>
          <Progress value={progress} className="h-3 shadow-glow" />
        </div>

        {/* Audio Player */}
        <div className="flex flex-col items-center justify-center space-y-8 animate-scale-in">
          <button
            onClick={playAudio}
            disabled={isPlaying}
            className={`
              w-32 h-32 rounded-full gradient-edge bg-card 
              flex items-center justify-center
              transition-all duration-300
              ${isPlaying ? "animate-pulse-glow scale-110" : "hover:scale-105 hover:shadow-glow"}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <Volume2 className="w-16 h-16 text-foreground" />
          </button>
          <p className="text-muted-foreground text-sm">
            {isLoadingAudio ? "Loading audio..." : isPlaying ? "Playing..." : "Click to play"}
          </p>
        </div>

        {/* Tone Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up">
          {[1, 2, 3, 4].map((tone) => (
            <Button
              key={tone}
              onClick={() => handleAnswer(tone)}
              disabled={feedback !== null}
              className={`
                h-20 text-lg btn-3d
                ${feedback === "correct" && tone === sessionQuestions[currentQuestion].tone
                  ? "bg-green-500/20 border-green-500"
                  : feedback === "incorrect" && tone === sessionQuestions[currentQuestion].tone
                  ? "bg-red-500/20 border-red-500"
                  : ""
                }
              `}
            >
              {tone === 1 && "1st Tone ˉ"}
              {tone === 2 && "2nd Tone ˊ"}
              {tone === 3 && "3rd Tone ˇ"}
              {tone === 4 && "4th Tone ˋ"}
            </Button>
          ))}
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`
              p-6 rounded-lg text-center space-y-2 animate-fade-in
              ${feedback === "correct"
                ? "bg-green-500/10 border border-green-500/30"
                : "bg-red-500/10 border border-red-500/30"
              }
            `}
          >
            {feedback === "correct" ? (
              <>
                <div className="flex items-center justify-center gap-2 text-green-500">
                  <Check className="w-6 h-6" />
                  <span className="text-xl font-medium">Correct!</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {sessionQuestions[currentQuestion].word} ({sessionQuestions[currentQuestion].pinyin}) - {sessionQuestions[currentQuestion].meaning}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 text-red-500">
                  <X className="w-6 h-6" />
                  <span className="text-xl font-medium">Try Again</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Listen carefully to the tone
                </p>
                <p className="text-sm text-foreground chinese-text">
                  {sessionQuestions[currentQuestion].word} ({sessionQuestions[currentQuestion].pinyin}) - {sessionQuestions[currentQuestion].meaning}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, ArrowLeft, Mic, Sparkles } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { useState } from "react";

export default function Pronunciation() {
  const navigate = useNavigate();
  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const difficultSounds = [
    { pinyin: "zh", example: "中国 (zhōngguó)", meaning: "China", tip: "Like 'j' in 'judge'" },
    { pinyin: "q", example: "请 (qǐng)", meaning: "please", tip: "Like 'ch' in 'cheese'" },
    { pinyin: "x", example: "谢谢 (xièxie)", meaning: "thank you", tip: "Like 'sh' in 'sheep'" },
    { pinyin: "r", example: "日 (rì)", meaning: "day", tip: "Between 'r' and 'zh'" },
  ];

  const playSound = (sound: string) => {
    setPlayingSound(sound);
    setTimeout(() => setPlayingSound(null), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="pt-24 pb-12 px-6 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 animate-fade-in">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/scenarios")}
            className="hover:scale-110 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Core Foundations</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Pronunciation Practice
            </h1>
            <p className="text-muted-foreground mt-2">Master the unique sounds of Mandarin Chinese</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden animate-fade-in">
          <div className="h-full w-1/4 bg-gradient-to-r from-blue-500 via-pink-500 to-orange-500 rounded-full" />
        </div>

        {/* Connecting Line */}
        <div className="flex justify-center -my-4 animate-fade-in">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-60 rounded-full shadow-glow" />
        </div>

        {/* Difficult Sounds */}
        <Card className="p-6 md:p-8 space-y-6 gradient-edge animate-fade-in border-border/50">
          <div className="flex items-center gap-3">
            <Mic className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Challenging Sounds</h2>
          </div>
          <p className="text-muted-foreground">
            These sounds don't exist in English. Practice them slowly and carefully.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {difficultSounds.map((sound, index) => (
              <button
                key={index}
                onClick={() => playSound(sound.pinyin)}
                className="group p-5 rounded-xl glass gradient-edge hover:shadow-glow transition-all text-left space-y-3 hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-primary">{sound.pinyin}</div>
                  <Volume2 className={`h-5 w-5 transition-all ${playingSound === sound.pinyin ? 'text-primary scale-125 animate-pulse' : 'text-muted-foreground group-hover:text-primary'}`} />
                </div>
                <div className="text-lg font-medium text-foreground">{sound.example}</div>
                <div className="text-sm text-muted-foreground">{sound.meaning}</div>
                <div className="flex items-start gap-2 text-xs text-accent bg-accent/10 px-3 py-1 rounded-full inline-flex">
                  <Sparkles className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span>{sound.tip}</span>
                </div>
                {playingSound === sound.pinyin && (
                  <div className="h-1 rounded-full bg-primary/20 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent animate-slide-in-right" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Connecting Line */}
        <div className="flex justify-center -my-4 animate-fade-in">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-60 rounded-full shadow-glow" />
        </div>

        {/* Practice Tips */}
        <Card className="p-6 space-y-4 gradient-edge animate-fade-in border-border/50 bg-gradient-to-br from-primary/5 to-accent/5" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-xl font-bold text-foreground">Practice Tips</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary">✓</span>
              <span>Listen to native speakers and mimic their mouth shape</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">✓</span>
              <span>Record yourself and compare with native pronunciation</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">✓</span>
              <span>Practice difficult sounds 5 minutes daily</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">✓</span>
              <span>Don't worry about perfection - focus on being understood</span>
            </li>
          </ul>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Button variant="outline" onClick={() => { window.scrollTo(0, 0); navigate("/pinyin-tones"); }}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous Lesson
          </Button>
          <Button onClick={() => { window.scrollTo(0, 0); navigate("/greetings"); }} className="shadow-glow">
            Continue Learning
            <Sparkles className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
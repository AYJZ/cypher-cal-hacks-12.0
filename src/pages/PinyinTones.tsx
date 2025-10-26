import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, ArrowLeft, Music, Sparkles, BookOpen } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { useState } from "react";

export default function PinyinTones() {
  const navigate = useNavigate();
  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const toneExamples = [
    { 
      tone: "1st Tone", 
      symbol: "ˉ", 
      pinyin: "mā", 
      character: "妈", 
      meaning: "mother",
      description: "High and flat, like singing a musical note",
      color: "text-red-500"
    },
    { 
      tone: "2nd Tone", 
      symbol: "ˊ", 
      pinyin: "má", 
      character: "麻", 
      meaning: "hemp",
      description: "Rising, like asking a question 'what?'",
      color: "text-yellow-500"
    },
    { 
      tone: "3rd Tone", 
      symbol: "ˇ", 
      pinyin: "mǎ", 
      character: "马", 
      meaning: "horse",
      description: "Dips down then rises, like saying 'really?'",
      color: "text-green-500"
    },
    { 
      tone: "4th Tone", 
      symbol: "ˋ", 
      pinyin: "mà", 
      character: "骂", 
      meaning: "scold",
      description: "Sharp falling, like a command 'stop!'",
      color: "text-blue-500"
    },
  ];

  const commonInitials = [
    { char: "b", example: "爸 (bà)", meaning: "dad" },
    { char: "p", example: "婆 (pó)", meaning: "grandma" },
    { char: "m", example: "妈 (mā)", meaning: "mom" },
    { char: "f", example: "发 (fā)", meaning: "send" },
    { char: "d", example: "大 (dà)", meaning: "big" },
    { char: "t", example: "他 (tā)", meaning: "he" },
    { char: "n", example: "你 (nǐ)", meaning: "you" },
    { char: "l", example: "来 (lái)", meaning: "come" },
  ];

  const commonFinals = [
    { char: "a", example: "啊 (ā)", meaning: "ah" },
    { char: "o", example: "哦 (ō)", meaning: "oh" },
    { char: "e", example: "饿 (è)", meaning: "hungry" },
    { char: "i", example: "衣 (yī)", meaning: "clothes" },
    { char: "u", example: "乌 (wū)", meaning: "crow" },
    { char: "ü", example: "鱼 (yú)", meaning: "fish" },
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
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pb-2">
              Pinyin & Tones
            </h1>
            <p className="text-muted-foreground mt-2">Learn the building blocks of Chinese pronunciation</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden animate-fade-in">
          <div className="h-full w-0 bg-gradient-to-r from-blue-500 via-pink-500 to-orange-500 rounded-full" />
        </div>

        {/* Connecting Line to Next Section */}
        <div className="flex justify-center -my-4 animate-fade-in">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-60 rounded-full shadow-glow" />
        </div>

        {/* What is Pinyin */}
        <Card className="p-6 md:p-8 space-y-4 gradient-edge animate-fade-in border-border/50">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">What is Pinyin?</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Pinyin (拼音)</span> is the romanization system for Mandarin Chinese. 
            It uses the Latin alphabet to show you how to pronounce Chinese characters. 
            Think of it as your pronunciation guide!
          </p>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-around gap-6 text-center">
              <div className="space-y-2">
                <div className="text-5xl font-bold text-foreground">你好</div>
                <div className="text-xs text-muted-foreground">Chinese Characters</div>
              </div>
              <div className="text-3xl text-primary">→</div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-accent">nǐ hǎo</div>
                <div className="text-xs text-muted-foreground">Pinyin</div>
              </div>
              <div className="text-3xl text-primary">→</div>
              <div className="space-y-2">
                <div className="text-3xl font-semibold text-foreground">Hello</div>
                <div className="text-xs text-muted-foreground">Meaning</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Connecting Line */}
        <div className="flex justify-center -my-4 animate-fade-in">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-60 rounded-full shadow-glow" />
        </div>

        {/* The Four Tones */}
        <Card className="p-6 md:p-8 space-y-6 gradient-edge animate-fade-in border-border/50" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3">
            <Music className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">The Four Tones</h2>
          </div>
          <p className="text-muted-foreground">
            Mandarin has <span className="font-semibold text-foreground">4 tones</span> plus a neutral tone. 
            The same syllable with different tones means completely different things!
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {toneExamples.map((tone, index) => (
              <button
                key={index}
                onClick={() => playSound(tone.character)}
                className="group p-5 rounded-xl glass gradient-edge hover:shadow-glow transition-all text-left space-y-3 hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`text-5xl font-bold ${tone.color}`}>
                      {tone.character}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{tone.tone}</div>
                      <div className="text-2xl font-semibold text-foreground">{tone.pinyin}</div>
                    </div>
                  </div>
                  <Volume2 className={`h-5 w-5 transition-all ${playingSound === tone.character ? 'text-primary scale-125 animate-pulse' : 'text-muted-foreground group-hover:text-primary'}`} />
                </div>
                <div className="text-sm text-accent font-medium">{tone.meaning}</div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground bg-primary/5 px-3 py-2 rounded-lg">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{tone.description}</span>
                </div>
                {playingSound === tone.character && (
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

        {/* Initials (Consonants) */}
        <Card className="p-6 md:p-8 space-y-6 gradient-edge animate-fade-in border-border/50" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-xl font-bold text-foreground">Initials (Consonants)</h3>
          <p className="text-sm text-muted-foreground">These sounds start syllables in Mandarin</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {commonInitials.map((initial, index) => (
              <button
                key={index}
                onClick={() => playSound(initial.char)}
                className="group p-4 rounded-xl glass gradient-edge hover:shadow-glow transition-all text-center space-y-2 hover:scale-110"
              >
                <div className="text-3xl font-bold text-primary">{initial.char}</div>
                <div className="text-xs text-foreground">{initial.example}</div>
                <div className="text-xs text-muted-foreground">{initial.meaning}</div>
                <Volume2 className={`h-4 w-4 mx-auto transition-all ${playingSound === initial.char ? 'text-primary scale-125 animate-pulse' : 'text-muted-foreground group-hover:text-primary'}`} />
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            There are 23 initials total - these are the most common ones to get started
          </p>
        </Card>

        {/* Connecting Line */}
        <div className="flex justify-center -my-4 animate-fade-in">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-60 rounded-full shadow-glow" />
        </div>

        {/* Finals (Vowels) */}
        <Card className="p-6 md:p-8 space-y-6 gradient-edge animate-fade-in border-border/50" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-xl font-bold text-foreground">Finals (Vowels)</h3>
          <p className="text-sm text-muted-foreground">These form the core sound of each syllable</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {commonFinals.map((final, index) => (
              <button
                key={index}
                onClick={() => playSound(final.char)}
                className="group p-5 rounded-xl glass gradient-edge hover:shadow-glow transition-all text-center space-y-2 hover:scale-110"
              >
                <div className="text-4xl font-bold text-primary">{final.char}</div>
                <div className="text-sm text-foreground">{final.example}</div>
                <div className="text-xs text-muted-foreground">{final.meaning}</div>
                <Volume2 className={`h-4 w-4 mx-auto transition-all ${playingSound === final.char ? 'text-primary scale-125 animate-pulse' : 'text-muted-foreground group-hover:text-primary'}`} />
              </button>
            ))}
          </div>
        </Card>

        {/* Connecting Line */}
        <div className="flex justify-center -my-4 animate-fade-in">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-60 rounded-full shadow-glow" />
        </div>

        {/* Practice Section */}
        <Card className="p-6 space-y-4 gradient-edge animate-fade-in border-border/50 bg-gradient-to-br from-primary/5 to-accent/5" style={{ animationDelay: "0.4s" }}>
          <h3 className="text-xl font-bold text-foreground">🎯 Practice Makes Perfect</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary">✓</span>
              <span>Listen to each sound multiple times to train your ear</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">✓</span>
              <span>Practice tones separately before combining with syllables</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">✓</span>
              <span>Watch native speakers' mouth movements for accurate pronunciation</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">✓</span>
              <span>Use the tone practice tool to test your understanding</span>
            </li>
          </ul>
          <Button 
            onClick={() => navigate("/pinyin")} 
            variant="outline"
            className="w-full mt-4"
          >
            Open Full Pinyin Reference
            <BookOpen className="h-4 w-4 ml-2" />
          </Button>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <Button variant="outline" onClick={() => { window.scrollTo(0, 0); navigate("/scenarios"); }}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Map
          </Button>
          <Button onClick={() => { window.scrollTo(0, 0); navigate("/pronunciation"); }} className="shadow-glow">
            Continue Learning
            <Sparkles className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
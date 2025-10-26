import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, ArrowLeft, Hash, Sparkles, Calculator } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { useState } from "react";

export default function Numbers() {
  const navigate = useNavigate();
  const [playingNumber, setPlayingNumber] = useState<string | null>(null);

  const basicNumbers = [
    { character: "一", pinyin: "yī", number: 1 },
    { character: "二", pinyin: "èr", number: 2 },
    { character: "三", pinyin: "sān", number: 3 },
    { character: "四", pinyin: "sì", number: 4 },
    { character: "五", pinyin: "wǔ", number: 5 },
    { character: "六", pinyin: "liù", number: 6 },
    { character: "七", pinyin: "qī", number: 7 },
    { character: "八", pinyin: "bā", number: 8 },
    { character: "九", pinyin: "jiǔ", number: 9 },
    { character: "十", pinyin: "shí", number: 10 },
  ];

  const bigNumbers = [
    { character: "百", pinyin: "bǎi", meaning: "hundred", example: "一百 (100)" },
    { character: "千", pinyin: "qiān", meaning: "thousand", example: "一千 (1,000)" },
    { character: "万", pinyin: "wàn", meaning: "ten thousand", example: "一万 (10,000)" },
  ];

  const playNumber = (num: string) => {
    setPlayingNumber(num);
    setTimeout(() => setPlayingNumber(null), 1000);
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
              Numbers & Counting
            </h1>
            <p className="text-muted-foreground mt-2">Essential numbers for daily life</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden animate-fade-in">
          <div className="h-full w-3/5 bg-gradient-to-r from-blue-500 via-pink-500 to-orange-500 rounded-full" />
        </div>

        {/* Connecting Line */}
        <div className="flex justify-center -my-4 animate-fade-in">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-60 rounded-full shadow-glow" />
        </div>

        {/* Basic Numbers 1-10 */}
        <Card className="p-6 md:p-8 space-y-6 gradient-edge animate-fade-in border-border/50">
          <div className="flex items-center gap-3">
            <Hash className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Numbers 1-10</h2>
          </div>
          <p className="text-muted-foreground">Master these first - you'll use them constantly!</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {basicNumbers.map((num) => (
              <button
                key={num.number}
                onClick={() => playNumber(num.character)}
                className="group p-4 rounded-xl glass gradient-edge hover:shadow-glow transition-all text-center space-y-2 hover:scale-110"
              >
                <div className="text-xs text-muted-foreground">{num.number}</div>
                <div className="text-4xl font-bold text-primary">{num.character}</div>
                <div className="text-sm text-foreground">{num.pinyin}</div>
                <Volume2 className={`h-4 w-4 mx-auto transition-all ${playingNumber === num.character ? 'text-primary scale-125 animate-pulse' : 'text-muted-foreground group-hover:text-primary'}`} />
                {playingNumber === num.character && (
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

        {/* Larger Numbers */}
        <Card className="p-6 md:p-8 space-y-6 gradient-edge animate-fade-in border-border/50" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3">
            <Calculator className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Larger Numbers</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {bigNumbers.map((num, index) => (
              <button
                key={index}
                onClick={() => playNumber(num.character)}
                className="group p-5 rounded-xl glass gradient-edge hover:shadow-glow transition-all text-center space-y-3 hover:scale-105"
              >
                <div className="text-5xl font-bold text-primary">{num.character}</div>
                <div className="text-xl text-foreground">{num.pinyin}</div>
                <div className="text-sm text-accent">{num.meaning}</div>
                <div className="text-xs text-muted-foreground bg-primary/5 px-3 py-1 rounded-full">
                  {num.example}
                </div>
                <Volume2 className={`h-5 w-5 mx-auto transition-all ${playingNumber === num.character ? 'text-primary scale-125 animate-pulse' : 'text-muted-foreground group-hover:text-primary'}`} />
              </button>
            ))}
          </div>
        </Card>

        {/* Connecting Line */}
        <div className="flex justify-center -my-4 animate-fade-in">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-60 rounded-full shadow-glow" />
        </div>

        {/* Practical Examples */}
        <Card className="p-6 space-y-4 gradient-edge animate-fade-in border-border/50 bg-gradient-to-br from-primary/5 to-accent/5" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-xl font-bold text-foreground">🎯 Practical Usage</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg glass border border-border/30">
              <div className="text-lg font-semibold text-foreground mb-2">Phone Numbers</div>
              <div className="text-2xl text-primary">一三八 五六七八 九零一二</div>
              <div className="text-sm text-muted-foreground mt-1">138-5678-9012</div>
            </div>
            <div className="p-4 rounded-lg glass border border-border/30">
              <div className="text-lg font-semibold text-foreground mb-2">Prices</div>
              <div className="text-2xl text-primary">五十八块</div>
              <div className="text-sm text-muted-foreground mt-1">58 yuan (wǔshíbā kuài)</div>
            </div>
            <div className="p-4 rounded-lg glass border border-border/30">
              <div className="text-lg font-semibold text-foreground mb-2">Dates</div>
              <div className="text-2xl text-primary">二零二五年</div>
              <div className="text-sm text-muted-foreground mt-1">Year 2025 (èr líng èr wǔ nián)</div>
            </div>
          </div>
        </Card>

        {/* Connecting Line */}
        <div className="flex justify-center -my-4 animate-fade-in">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-60 rounded-full shadow-glow" />
        </div>

        {/* Tips */}
        <Card className="p-6 space-y-4 gradient-edge animate-fade-in border-border/50" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Quick Tips
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>二 (èr) vs 两 (liǎng): Use 两 before measure words (两个, liǎng gè = two items)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Lucky number: 八 (8) sounds like 发 (fā - prosperity)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Unlucky number: 四 (4) sounds like 死 (sǐ - death)</span>
            </li>
          </ul>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Button variant="outline" onClick={() => { window.scrollTo(0, 0); navigate("/greetings"); }}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous Lesson
          </Button>
          <Button onClick={() => { window.scrollTo(0, 0); navigate("/daily-words"); }} className="shadow-glow">
            Continue Learning
            <Sparkles className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
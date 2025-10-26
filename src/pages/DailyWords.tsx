import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, ArrowLeft, BookOpen, Sparkles, Coffee, Home as HomeIcon, Sun, Target, Check } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { useState } from "react";

export default function DailyWords() {
  const navigate = useNavigate();
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const categories = [
    {
      title: "At Home",
      icon: <HomeIcon className="h-5 w-5" />,
      words: [
        { character: "家", pinyin: "jiā", meaning: "home/family" },
        { character: "房间", pinyin: "fángjiān", meaning: "room" },
        { character: "厨房", pinyin: "chúfáng", meaning: "kitchen" },
        { character: "卫生间", pinyin: "wèishēngjiān", meaning: "bathroom" },
      ]
    },
    {
      title: "Food & Drink",
      icon: <Coffee className="h-5 w-5" />,
      words: [
        { character: "水", pinyin: "shuǐ", meaning: "water" },
        { character: "茶", pinyin: "chá", meaning: "tea" },
        { character: "饭", pinyin: "fàn", meaning: "rice/meal" },
        { character: "面", pinyin: "miàn", meaning: "noodles" },
      ]
    },
    {
      title: "Daily Actions",
      icon: <Sun className="h-5 w-5" />,
      words: [
        { character: "吃", pinyin: "chī", meaning: "eat" },
        { character: "喝", pinyin: "hē", meaning: "drink" },
        { character: "看", pinyin: "kàn", meaning: "look/watch" },
        { character: "去", pinyin: "qù", meaning: "go" },
      ]
    }
  ];

  const playWord = (word: string) => {
    setPlayingWord(word);
    setTimeout(() => setPlayingWord(null), 1000);
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
              Daily Words
            </h1>
            <p className="text-muted-foreground mt-2">Essential vocabulary for everyday life</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden animate-fade-in">
          <div className="h-full w-4/5 bg-gradient-to-r from-blue-500 via-pink-500 to-orange-500 rounded-full" />
        </div>

        {/* Connecting Line */}
        <div className="flex justify-center -my-4 animate-fade-in">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-60 rounded-full shadow-glow" />
        </div>

        {/* Word Categories */}
        {categories.map((category, catIndex) => (
          <div key={catIndex}>
            <Card 
              className="p-6 md:p-8 space-y-6 gradient-edge animate-fade-in border-border/50"
              style={{ animationDelay: `${catIndex * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {category.words.map((word, wordIndex) => (
                  <button
                    key={wordIndex}
                    onClick={() => playWord(word.character)}
                    className="group p-5 rounded-xl glass gradient-edge hover:shadow-glow transition-all text-left space-y-2 hover:scale-105"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-primary">{word.character}</div>
                      <Volume2 className={`h-5 w-5 transition-all ${playingWord === word.character ? 'text-primary scale-125 animate-pulse' : 'text-muted-foreground group-hover:text-primary'}`} />
                    </div>
                    <div className="text-lg text-foreground">{word.pinyin}</div>
                    <div className="text-sm text-accent">{word.meaning}</div>
                    {playingWord === word.character && (
                      <div className="h-1 rounded-full bg-primary/20 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent animate-slide-in-right" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Card>
            
            {/* Connecting Line between categories */}
            {catIndex < categories.length - 1 && (
              <div className="flex justify-center -my-4 animate-fade-in">
                <div className="w-1 h-12 bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-60 rounded-full shadow-glow" />
              </div>
            )}
          </div>
        ))}

        {/* Connecting Line */}
        <div className="flex justify-center -my-4 animate-fade-in">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-60 rounded-full shadow-glow" />
        </div>

        {/* Practice Sentences */}
        <Card className="p-6 space-y-4 gradient-edge animate-fade-in border-border/50 bg-gradient-to-br from-primary/5 to-accent/5" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Practice Sentences</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg glass border border-border/30">
              <div className="text-2xl font-bold text-primary mb-2">我去家。</div>
              <div className="text-lg text-foreground mb-1">wǒ qù jiā.</div>
              <div className="text-sm text-muted-foreground">I go home.</div>
            </div>
            <div className="p-4 rounded-lg glass border border-border/30">
              <div className="text-2xl font-bold text-primary mb-2">我吃饭。</div>
              <div className="text-lg text-foreground mb-1">wǒ chī fàn.</div>
              <div className="text-sm text-muted-foreground">I eat (a meal).</div>
            </div>
            <div className="p-4 rounded-lg glass border border-border/30">
              <div className="text-2xl font-bold text-primary mb-2">我喝茶。</div>
              <div className="text-lg text-foreground mb-1">wǒ hē chá.</div>
              <div className="text-sm text-muted-foreground">I drink tea.</div>
            </div>
          </div>
        </Card>

        {/* Connecting Line */}
        <div className="flex justify-center -my-4 animate-fade-in">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-60 rounded-full shadow-glow" />
        </div>

        {/* Learning Tips */}
        <Card className="p-6 space-y-4 gradient-edge animate-fade-in border-border/50" style={{ animationDelay: "0.4s" }}>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Learning Strategy
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-3 items-start">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>Learn words in context - make simple sentences</span>
            </li>
            <li className="flex gap-3 items-start">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>Practice 5 new words daily, review previous ones</span>
            </li>
            <li className="flex gap-3 items-start">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>Use flashcards or sticky notes around your home</span>
            </li>
            <li className="flex gap-3 items-start">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>Speak out loud - pronunciation practice is crucial</span>
            </li>
          </ul>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <Button variant="outline" onClick={() => { window.scrollTo(0, 0); navigate("/numbers"); }}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous Lesson
          </Button>
          <Button onClick={() => { window.scrollTo(0, 0); navigate("/scenarios"); }} className="shadow-glow">
            Start Main Lessons
            <Sparkles className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
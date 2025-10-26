import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, ArrowLeft, MessageCircle, Sparkles, Clock } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { cn } from "@/lib/utils";

export default function Greetings() {
  const navigate = useNavigate();
  const { playAudio, isPlaying } = useAudioPlayer();

  const greetings = [
    { 
      character: "你好", 
      pinyin: "nǐ hǎo", 
      meaning: "Hello", 
      usage: "Universal greeting, any time",
      cultural: "Most common way to say hello"
    },
    { 
      character: "您好", 
      pinyin: "nín hǎo", 
      meaning: "Hello (formal)", 
      usage: "Formal settings, showing respect",
      cultural: "Used when addressing elders, superiors, or customers"
    },
    { 
      character: "早上好", 
      pinyin: "zǎoshang hǎo", 
      meaning: "Good morning", 
      usage: "Before noon",
      cultural: "More formal than 你好"
    },
    { 
      character: "晚上好", 
      pinyin: "wǎnshang hǎo", 
      meaning: "Good evening", 
      usage: "After 6pm",
      cultural: "Used at night in both casual and professional settings"
    },
    { 
      character: "再见", 
      pinyin: "zàijiàn", 
      meaning: "Goodbye", 
      usage: "Formal farewell",
      cultural: "Literally means 'see you again'"
    },
  ];

  const casualPhrases = [
    { character: "嗨", pinyin: "hāi", meaning: "Hi", note: "Very casual, borrowed from English" },
    { character: "拜拜", pinyin: "bàibài", meaning: "Bye-bye", note: "Informal, borrowed from English" },
  ];

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
              Greetings & Farewells
            </h1>
            <p className="text-muted-foreground mt-2 pb-2">Start every conversation with confidence</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden animate-fade-in">
          <div className="h-full w-2/5 bg-gradient-to-r from-blue-500 via-pink-500 to-orange-500 rounded-full" />
        </div>

        {/* Connecting Line */}
        <div className="flex justify-center -my-4 animate-fade-in">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-60 rounded-full shadow-glow" />
        </div>

        {/* Common Greetings */}
        <Card className="p-6 md:p-8 space-y-6 gradient-edge animate-fade-in border-border/50">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Essential Greetings</h2>
          </div>
          
          <div className="space-y-4">
            {greetings.map((greeting, index) => (
              <button
                key={index}
                onClick={() => playAudio(greeting.character, `greeting-${index}`)}
                disabled={isPlaying(`greeting-${index}`)}
                className="w-full group p-6 rounded-xl glass gradient-edge hover:shadow-glow transition-all text-left space-y-3 hover:scale-[1.02] disabled:opacity-80"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-foreground">{greeting.character}</div>
                    <div className="text-xl text-primary">{greeting.pinyin}</div>
                  </div>
                  <div className={cn(
                    "relative",
                    isPlaying(`greeting-${index}`) && "animate-pulse"
                  )}>
                    {/* Glow ring when playing */}
                    {isPlaying(`greeting-${index}`) && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-40 blur-lg scale-150 animate-pulse" />
                    )}
                    <Volume2 className={cn(
                      "h-6 w-6 relative z-10 transition-all",
                      isPlaying(`greeting-${index}`) ? 'text-primary scale-125' : 'text-muted-foreground group-hover:text-primary'
                    )} />
                  </div>
                </div>
                <div className="text-lg font-medium text-accent">{greeting.meaning}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {greeting.usage}
                </div>
                <div className="flex items-start gap-2 text-sm text-foreground bg-primary/5 px-4 py-2 rounded-lg">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{greeting.cultural}</span>
                </div>
                {isPlaying(`greeting-${index}`) && (
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

        {/* Casual Phrases */}
        <Card className="p-6 space-y-4 gradient-edge animate-fade-in border-border/50" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-xl font-bold text-foreground">Casual Phrases</h3>
          <p className="text-sm text-muted-foreground">Use these with friends and peers</p>
          <div className="grid md:grid-cols-2 gap-4">
            {casualPhrases.map((phrase, index) => (
              <button
                key={index}
                onClick={() => playAudio(phrase.character, `casual-${index}`)}
                disabled={isPlaying(`casual-${index}`)}
                className="p-4 rounded-xl glass gradient-edge hover:shadow-glow transition-all text-left space-y-2 hover:scale-105 group disabled:opacity-80"
              >
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-foreground">{phrase.character}</div>
                  <div className={cn(
                    "relative",
                    isPlaying(`casual-${index}`) && "animate-pulse"
                  )}>
                    {isPlaying(`casual-${index}`) && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-40 blur-lg scale-150 animate-pulse" />
                    )}
                    <Volume2 className={cn(
                      "h-5 w-5 relative z-10 transition-all",
                      isPlaying(`casual-${index}`) ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                    )} />
                  </div>
                </div>
                <div className="text-lg text-primary">{phrase.pinyin}</div>
                <div className="text-sm text-accent">{phrase.meaning}</div>
                <div className="text-xs text-muted-foreground">{phrase.note}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Connecting Line */}
        <div className="flex justify-center -my-4 animate-fade-in">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-60 rounded-full shadow-glow" />
        </div>

        {/* Cultural Tips */}
        <Card className="p-6 space-y-4 gradient-edge animate-fade-in border-border/50 bg-gradient-to-br from-primary/5 to-accent/5" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-xl font-bold text-foreground">🌏 Cultural Insights</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Chinese people often greet with "吃了吗？" (Have you eaten?) as a sign of care</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Handshakes are common in business, but bowing is not traditional in Chinese culture</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Using someone's title + surname is more respectful than just their name</span>
            </li>
          </ul>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button variant="outline" onClick={() => { window.scrollTo(0, 0); navigate("/pronunciation"); }}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous Lesson
          </Button>
          <Button onClick={() => { window.scrollTo(0, 0); navigate("/greetings-quiz"); }} className="shadow-glow">
            Take Quiz
            <Sparkles className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, ArrowRight, BookOpen, Sparkles, ArrowLeft } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { cn } from "@/lib/utils";

export default function Intro() {
  const navigate = useNavigate();
  const { playAudio, isPlaying } = useAudioPlayer();

  const toneExamples = [
    { tone: "1st", pinyin: "mā", character: "妈", meaning: "mother", color: "text-red-500" },
    { tone: "2nd", pinyin: "má", character: "麻", meaning: "hemp", color: "text-yellow-500" },
    { tone: "3rd", pinyin: "mǎ", character: "马", meaning: "horse", color: "text-green-500" },
    { tone: "4th", pinyin: "mà", character: "骂", meaning: "scold", color: "text-blue-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="pt-24 pb-12 px-6 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative text-center space-y-4 animate-fade-in">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home")}
            className="absolute left-0 top-0 btn-3d hover:scale-110 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Complete Beginner's Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to Chinese!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's start with the basics. No prior knowledge needed — we'll guide you every step of the way.
          </p>
        </div>

        {/* Section 1: What are Chinese Characters? */}
        <Card className="p-6 md:p-8 space-y-4 gradient-edge animate-fade-in border-border/50">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">What are Chinese Characters?</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Chinese uses <span className="font-semibold text-foreground">characters (汉字)</span> instead of an alphabet. 
            Each character represents a word or part of a word, and often carries meaning through its visual structure.
          </p>
          <div className="grid md:grid-cols-3 gap-4 pt-4">
            {[
              { char: "人", pinyin: "rén", meaning: "person" },
              { char: "火", pinyin: "huǒ", meaning: "fire" },
              { char: "山", pinyin: "shān", meaning: "mountain" }
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-lg bg-card/50 border border-border/30 text-center space-y-2 hover:scale-105 transition-transform">
                <div className="text-5xl font-bold text-primary">{item.char}</div>
                <div className="text-sm text-accent">{item.pinyin}</div>
                <div className="text-xs text-muted-foreground">{item.meaning}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Section 2: What is Pinyin? */}
        <Card className="p-6 md:p-8 space-y-4 gradient-edge animate-fade-in border-border/50" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-2xl font-bold text-foreground">What is Pinyin?</h2>
          <p className="text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Pinyin (拼音)</span> is the romanization system for Chinese. 
            It uses the Latin alphabet to show you <span className="text-accent">how to pronounce</span> characters. 
            Think of it as your pronunciation guide!
          </p>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-around gap-6 text-center">
              <div className="space-y-2">
                <div className="text-5xl font-bold text-foreground">你好</div>
                <div className="text-xs text-muted-foreground">Chinese Characters</div>
              </div>
              <ArrowRight className="h-8 w-8 text-primary rotate-90 md:rotate-0" />
              <div className="space-y-2">
                <div className="text-4xl font-bold text-accent">nǐ hǎo</div>
                <div className="text-xs text-muted-foreground">Pinyin (pronunciation)</div>
              </div>
              <ArrowRight className="h-8 w-8 text-primary rotate-90 md:rotate-0" />
              <div className="space-y-2">
                <div className="text-3xl font-semibold text-foreground">Hello</div>
                <div className="text-xs text-muted-foreground">Meaning</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 3: Why Tones Matter */}
        <Card className="p-6 md:p-8 space-y-6 gradient-edge animate-fade-in border-border/50" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-2xl font-bold text-foreground">Why Tones Matter</h2>
          <p className="text-muted-foreground leading-relaxed">
            Chinese is a <span className="font-semibold text-foreground">tonal language</span>. 
            The same sound can have completely different meanings depending on the <span className="text-accent">tone</span> you use.
            There are <span className="font-semibold text-foreground">4 main tones</span> plus a neutral tone.
          </p>
          
          {/* Tone Visualization */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Click each tone to see the difference:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {toneExamples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => playAudio(example.character, `tone-${index}`)}
                  disabled={isPlaying(`tone-${index}`)}
                  className="group p-5 rounded-xl bg-card/50 border border-border/30 hover:border-primary/50 transition-all text-left space-y-3 hover:scale-105 disabled:opacity-80"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`text-4xl font-bold ${example.color}`}>
                        {example.character}
                      </div>
                      <div>
                        <div className="text-xl font-semibold text-foreground">{example.pinyin}</div>
                        <div className="text-xs text-muted-foreground">{example.tone} Tone</div>
                      </div>
                    </div>
                    <div className={cn(
                      "relative",
                      isPlaying(`tone-${index}`) && "animate-pulse"
                    )}>
                      {/* Glow ring when playing */}
                      {isPlaying(`tone-${index}`) && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-40 blur-lg scale-150 animate-pulse" />
                      )}
                      <Volume2 className={cn(
                        "h-5 w-5 relative z-10 transition-all",
                        isPlaying(`tone-${index}`) ? 'text-primary scale-125' : 'text-muted-foreground group-hover:text-primary'
                      )} />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Meaning: {example.meaning}</div>
                  
                  {/* Tone Line Animation */}
                  {isPlaying(`tone-${index}`) && (
                    <div className="h-2 rounded-full bg-primary/20 overflow-hidden">
                      <div className={`h-full bg-gradient-to-r from-primary to-accent animate-slide-in-right`} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Pro tip:</span> Getting tones right is crucial! 
              Saying "mā" (mother) vs "mǎ" (horse) can lead to very different conversations! 🐴
            </p>
          </div>
        </Card>

        {/* Demo Section */}
        <Card className="p-6 md:p-8 space-y-4 gradient-edge animate-fade-in border-border/50 bg-gradient-to-br from-primary/5 to-accent/5" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-2xl font-bold text-foreground">Try it yourself!</h2>
          <p className="text-muted-foreground">
            Here's your first phrase. Practice saying "你好" (hello) with the correct tones:
          </p>
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="text-6xl font-bold text-primary">你好</div>
            <div className="flex items-center gap-4">
              <div className="text-center space-y-1">
                <div className="text-3xl font-bold text-accent">nǐ</div>
                <div className="text-xs text-muted-foreground">3rd tone</div>
              </div>
              <div className="text-3xl text-muted-foreground">+</div>
              <div className="text-center space-y-1">
                <div className="text-3xl font-bold text-accent">hǎo</div>
                <div className="text-xs text-muted-foreground">3rd tone</div>
              </div>
            </div>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2"
              onClick={() => playAudio("你好", "nihao-demo")}
              disabled={isPlaying("nihao-demo")}
            >
              <Volume2 className={cn(
                "h-5 w-5",
                isPlaying("nihao-demo") && "animate-pulse"
              )} />
              Play Pronunciation
            </Button>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="flex justify-center pt-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Button
            size="lg"
            onClick={() => {
              navigate("/pinyin");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-8 py-6 text-lg gap-3 shadow-glow hover:scale-105 transition-transform"
          >
            Start Learning Pinyin
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

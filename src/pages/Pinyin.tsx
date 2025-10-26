import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2, ChevronLeft, ChevronRight, HelpCircle, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TonePractice } from "@/components/TonePractice";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { TopNav } from "@/components/TopNav";
import { cn } from "@/lib/utils";

interface PinyinCard {
  char: string;
  pinyin: string;
  example: string;
  exampleChar: string;
  audio?: string;
}

// Complete list of Mandarin initials (consonants)
const initials: PinyinCard[] = [
  { char: "b", pinyin: "b", example: "爸 (bà) - dad", exampleChar: "爸" },
  { char: "p", pinyin: "p", example: "婆 (pó) - grandma", exampleChar: "婆" },
  { char: "m", pinyin: "m", example: "妈 (mā) - mom", exampleChar: "妈" },
  { char: "f", pinyin: "f", example: "发 (fā) - send", exampleChar: "发" },
  { char: "d", pinyin: "d", example: "大 (dà) - big", exampleChar: "大" },
  { char: "t", pinyin: "t", example: "他 (tā) - he", exampleChar: "他" },
  { char: "n", pinyin: "n", example: "你 (nǐ) - you", exampleChar: "你" },
  { char: "l", pinyin: "l", example: "来 (lái) - come", exampleChar: "来" },
  { char: "g", pinyin: "g", example: "哥 (gē) - brother", exampleChar: "哥" },
  { char: "k", pinyin: "k", example: "看 (kàn) - look", exampleChar: "看" },
  { char: "h", pinyin: "h", example: "好 (hǎo) - good", exampleChar: "好" },
  { char: "j", pinyin: "j", example: "家 (jiā) - home", exampleChar: "家" },
  { char: "q", pinyin: "q", example: "去 (qù) - go", exampleChar: "去" },
  { char: "x", pinyin: "x", example: "小 (xiǎo) - small", exampleChar: "小" },
  { char: "zh", pinyin: "zh", example: "中 (zhōng) - middle", exampleChar: "中" },
  { char: "ch", pinyin: "ch", example: "吃 (chī) - eat", exampleChar: "吃" },
  { char: "sh", pinyin: "sh", example: "是 (shì) - is", exampleChar: "是" },
  { char: "r", pinyin: "r", example: "人 (rén) - person", exampleChar: "人" },
  { char: "z", pinyin: "z", example: "在 (zài) - at", exampleChar: "在" },
  { char: "c", pinyin: "c", example: "菜 (cài) - vegetable", exampleChar: "菜" },
  { char: "s", pinyin: "s", example: "三 (sān) - three", exampleChar: "三" },
  { char: "y", pinyin: "y", example: "一 (yī) - one", exampleChar: "一" },
  { char: "w", pinyin: "w", example: "我 (wǒ) - I", exampleChar: "我" },
];

const finals: PinyinCard[] = [
  { char: "a", pinyin: "a", example: "啊 (ā) - ah", exampleChar: "啊" },
  { char: "o", pinyin: "o", example: "哦 (ō) - oh", exampleChar: "哦" },
  { char: "e", pinyin: "e", example: "饿 (è) - hungry", exampleChar: "饿" },
  { char: "i", pinyin: "i", example: "衣 (yī) - clothes", exampleChar: "衣" },
  { char: "u", pinyin: "u", example: "乌 (wū) - crow", exampleChar: "乌" },
  { char: "ü", pinyin: "ü", example: "鱼 (yú) - fish", exampleChar: "鱼" },
];

const tones = [
  { symbol: "ˉ", name: "First Tone", example: "mā 妈 (mom)" },
  { symbol: "ˊ", name: "Second Tone", example: "má 麻 (hemp)" },
  { symbol: "ˇ", name: "Third Tone", example: "mǎ 马 (horse)" },
  { symbol: "ˋ", name: "Fourth Tone", example: "mà 骂 (scold)" },
];

const Pinyin = () => {
  const navigate = useNavigate();
  const [showPractice, setShowPractice] = useState(false);
  const [initialsPage, setInitialsPage] = useState(0);
  const { playAudio, isPlaying } = useAudioPlayer();

  const itemsPerPage = 6;
  const totalInitialPages = Math.ceil(initials.length / itemsPerPage);

  const getCurrentInitials = () => {
    const start = initialsPage * itemsPerPage;
    const end = start + itemsPerPage;
    return initials.slice(start, end);
  };

  const nextInitialsPage = () => {
    setInitialsPage((prev) => (prev + 1) % totalInitialPages);
  };

  const prevInitialsPage = () => {
    setInitialsPage((prev) => (prev - 1 + totalInitialPages) % totalInitialPages);
  };

  if (showPractice) {
    return <TonePractice onClose={() => setShowPractice(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="relative text-center space-y-4 animate-fade-in">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/home")}
            className="absolute left-0 top-0 btn-3d hover:scale-110 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-4xl font-bold text-foreground">Learn Pinyin</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-4 glass border-border/50">
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">What's Pinyin?</p>
                    <p className="text-sm text-muted-foreground">
                      Pinyin (拼音) is the romanization system for Chinese characters. 
                      It uses the Latin alphabet to show you how to pronounce Chinese words. 
                      Think of it as your pronunciation guide!
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-muted-foreground font-light">
            Master Chinese pronunciation with interactive cards
          </p>
        </div>

        {/* Tones Section */}
        <section className="space-y-6 animate-fade-up">
          <h2 className="text-2xl font-light text-foreground">Tones</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {tones.map((tone, idx) => (
              <Card
                key={idx}
                className="p-6 gradient-edge bg-card hover:shadow-glow transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-center space-y-3">
                  <div className="text-5xl font-light animate-float" style={{ animationDelay: `${idx * 0.2}s` }}>
                    {tone.symbol}
                  </div>
                  <p className="text-sm font-medium text-foreground">{tone.name}</p>
                  <p className="text-xs text-muted-foreground chinese-text">
                    {tone.example}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Practice Button */}
        <div className="flex justify-center animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <Button
            onClick={() => setShowPractice(true)}
            size="lg"
            className="btn-3d text-lg px-8"
          >
            Practice Tones
          </Button>
        </div>

        {/* Initials Section */}
        <section className="space-y-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-2xl font-light text-foreground">Initials (Consonants)</h2>
          <div className="relative">
            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevInitialsPage}
              className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 btn-3d"
              disabled={totalInitialPages <= 1}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextInitialsPage}
              className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 btn-3d"
              disabled={totalInitialPages <= 1}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            
            {/* Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {getCurrentInitials().map((card, idx) => (
                <Card
                  key={card.char}
                  className="p-4 gradient-edge bg-card hover:shadow-glow transition-all duration-300 animate-scale-in h-[140px] flex flex-col justify-between"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="text-center">
                    <div className="text-3xl font-light text-foreground mb-2">
                      {card.char}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => playAudio(card.exampleChar, `initial-${card.char}`)}
                      disabled={isPlaying(`initial-${card.char}`)}
                      className="mx-auto btn-3d h-8 w-8 rounded-full mb-2 relative"
                    >
                      {/* Glow ring when playing */}
                      {isPlaying(`initial-${card.char}`) && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-40 blur-md scale-150 animate-pulse" />
                      )}
                      <Volume2 className={cn(
                        "h-4 w-4 relative z-10",
                        isPlaying(`initial-${card.char}`) && 'animate-pulse'
                      )} />
                    </Button>
                    <p className="text-xs text-muted-foreground chinese-text">
                      {card.example}
                    </p>
                  </div>
                </Card>
              ))}
              {/* Fill empty spaces to maintain grid */}
              {Array.from({ length: itemsPerPage - getCurrentInitials().length }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-[140px]" />
              ))}
            </div>
            
            {/* Page Indicator */}
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalInitialPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setInitialsPage(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === initialsPage ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Finals Section */}
        <section className="space-y-6 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-2xl font-light text-foreground">Finals (Vowels)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {finals.map((card, idx) => (
              <Card
                key={card.char}
                className="p-4 gradient-edge bg-card hover:shadow-glow transition-all duration-300 animate-scale-in h-[140px] flex flex-col justify-between"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="text-center">
                  <div className="text-3xl font-light text-foreground mb-2">
                    {card.char}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => playAudio(card.exampleChar, `final-${card.char}`)}
                    disabled={isPlaying(`final-${card.char}`)}
                    className="mx-auto btn-3d h-8 w-8 rounded-full mb-2 relative"
                  >
                    {/* Glow ring when playing */}
                    {isPlaying(`final-${card.char}`) && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-40 blur-md scale-150 animate-pulse" />
                    )}
                    <Volume2 className={cn(
                      "h-4 w-4 relative z-10",
                      isPlaying(`final-${card.char}`) && 'animate-pulse'
                    )} />
                  </Button>
                  <p className="text-xs text-muted-foreground chinese-text">
                    {card.example}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Pinyin;

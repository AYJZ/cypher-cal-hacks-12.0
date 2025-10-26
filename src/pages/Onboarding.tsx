import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { X, BookOpen, MessageCircle, Sparkles, Plane, Briefcase, PartyPopper, BookMarked } from "lucide-react";

const nativeLanguages = [
  { id: "en", title: "English", icon: "🇬🇧" },
  { id: "es", title: "Spanish", icon: "🇪🇸" },
  { id: "fr", title: "French", icon: "🇫🇷" },
  { id: "de", title: "German", icon: "🇩🇪" },
  { id: "ja", title: "Japanese", icon: "🇯🇵" },
  { id: "ko", title: "Korean", icon: "🇰🇷" },
];

const targetLanguages = [
  { id: "zh", title: "Chinese", icon: "🇨🇳" },
  { id: "en", title: "English", icon: "🇬🇧" },
  { id: "es", title: "Spanish", icon: "🇪🇸" },
  { id: "fr", title: "French", icon: "🇫🇷" },
  { id: "de", title: "German", icon: "🇩🇪" },
  { id: "ja", title: "Japanese", icon: "🇯🇵" },
];

const purposes = [
  { id: "travel", title: "Travel", icon: Plane, description: "Learn phrases for exploring new countries" },
  { id: "professional", title: "Professional", icon: Briefcase, description: "Business language and formal communication" },
  { id: "social", title: "Social", icon: PartyPopper, description: "Chat with friends and make connections" },
  { id: "study", title: "Study", icon: BookMarked, description: "Academic learning and exam preparation" },
];

const Onboarding = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nativeLanguage, setNativeLanguage] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false); // Don't show immediately
  const navigate = useNavigate();
  const { toast } = useToast();

  // Remove the automatic overlay display on mount

  const handleNext = () => {
    if (step === 1 && nativeLanguage) {
      setStep(2);
    } else if (step === 2 && targetLanguage) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2);
    }
  };

  const handleContinue = async () => {
    if (!selectedPurpose || !nativeLanguage || !targetLanguage) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Guest mode - store in localStorage
        localStorage.setItem("cypherPurpose", selectedPurpose);
        localStorage.setItem("cypherNativeLanguage", nativeLanguage);
        localStorage.setItem("cypherTargetLanguage", targetLanguage);
        localStorage.removeItem("isGuest"); // Remove flag after completing onboarding
        
        // Show the 3-step overlay after completing selections
        setShowOverlay(true);
      } else {
        // Authenticated - save to database
        const { error } = await supabase
          .from("user_profiles")
          .upsert({
            user_id: user.id,
            purpose: selectedPurpose,
            native_language: nativeLanguage,
            target_language: targetLanguage,
          });

        if (error) throw error;
        // Show the 3-step overlay after completing selections
        setShowOverlay(true);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    if (step === 1) return "What's your native language?";
    if (step === 2) return "What language do you want to learn?";
    return "Why are you learning?";
  };

  const getStepSubtitle = () => {
    if (step === 1) return "We'll use this to help you understand better";
    if (step === 2) return "Choose the language you want to master";
    return "This helps us personalize your learning experience";
  };

  const onboardingSteps = [
    { icon: BookOpen, title: "Learn Pinyin", desc: "Master pronunciation basics" },
    { icon: Sparkles, title: "Practice Sentences", desc: "Build real-world phrases" },
    { icon: MessageCircle, title: "Chat Naturally", desc: "Converse with AI friends" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col items-center justify-center p-4 animate-fade-in">
      {/* 3-Step Onboarding Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-3xl p-8 md:p-12 gradient-edge border-border/50 relative">
            <button
              onClick={() => setShowOverlay(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center space-y-6 mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Your Learning Journey</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                3 Steps to Fluency
              </h2>
              <p className="text-muted-foreground text-lg">
                Here's how Cypher will help you master Chinese naturally
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {onboardingSteps.map((stepInfo, idx) => (
                <div
                  key={idx}
                  className="text-center space-y-4 p-6 rounded-xl bg-card/50 border border-border/30 hover:scale-105 transition-transform animate-fade-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <stepInfo.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-primary font-semibold">Step {idx + 1}</div>
                    <h3 className="text-lg font-bold text-foreground">{stepInfo.title}</h3>
                    <p className="text-sm text-muted-foreground">{stepInfo.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => {
                setShowOverlay(false);
                localStorage.setItem("cypherSeenOnboarding", "true");
                navigate("/intro");
                toast({
                  title: "Welcome to Cypher! 🎉",
                  description: "Let's start your language learning journey!",
                  duration: 2000,
                });
              }}
              size="lg"
              className="w-full h-14 text-lg shadow-glow"
            >
              Let's Get Started
            </Button>
          </Card>
        </div>
      )}

      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-light tracking-tight">Cypher</h1>
          <p className="text-xl text-muted-foreground font-light">
            Learn languages in real-world context
          </p>
        </div>

        <Card className="glass p-8 space-y-6 border-none shadow-float">
          <div className="space-y-2 text-center">
            <div className="text-sm text-muted-foreground font-light mb-4">
              Step {step} of 3
            </div>
            <h2 className="text-2xl font-light text-foreground">
              {getStepTitle()}
            </h2>
            <p className="text-muted-foreground font-light">
              {getStepSubtitle()}
            </p>
            {step === 2 && (
              <p className="text-xs text-muted-foreground italic mt-2">
                We are only supporting Chinese for demo
              </p>
            )}
          </div>

          {step === 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {nativeLanguages.map((lang, idx) => (
                <Card
                  key={lang.id}
                  className={`glass p-6 cursor-pointer border-none transition-all duration-300 hover:scale-105 hover:shadow-glow ${
                    nativeLanguage === lang.id
                      ? "bg-gradient-to-br from-primary/20 to-accent/20 shadow-float scale-105"
                      : "shadow-soft"
                  }`}
                  onClick={() => setNativeLanguage(lang.id)}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="text-4xl mb-2 text-center">{lang.icon}</div>
                  <h3 className="text-base font-medium text-foreground text-center">
                    {lang.title}
                  </h3>
                </Card>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {targetLanguages.map((lang, idx) => (
                <Card
                  key={lang.id}
                  className={`glass p-6 cursor-pointer border-none transition-all duration-300 hover:scale-105 hover:shadow-glow ${
                    targetLanguage === lang.id
                      ? "bg-gradient-to-br from-primary/20 to-accent/20 shadow-float scale-105"
                      : "shadow-soft"
                  }`}
                  onClick={() => setTargetLanguage(lang.id)}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="text-4xl mb-2 text-center">{lang.icon}</div>
                  <h3 className="text-base font-medium text-foreground text-center">
                    {lang.title}
                  </h3>
                </Card>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {purposes.map((purpose, idx) => (
                <Card
                  key={purpose.id}
                  className={`glass p-6 cursor-pointer border-none transition-all duration-300 hover:scale-105 hover:shadow-glow ${
                    selectedPurpose === purpose.id
                      ? "bg-gradient-to-br from-primary/20 to-accent/20 shadow-float scale-105"
                      : "shadow-soft"
                  }`}
                  onClick={() => setSelectedPurpose(purpose.id)}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex justify-center mb-3">
                    <purpose.icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {purpose.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light">{purpose.description}</p>
                </Card>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                size="lg"
                className="h-14 font-light"
              >
                ← Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={(step === 1 && !nativeLanguage) || (step === 2 && !targetLanguage)}
                size="lg"
                className="flex-1 h-14 bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 hover:scale-[1.02] font-light disabled:opacity-40"
              >
                Continue →
              </Button>
            ) : (
              <Button
                onClick={handleContinue}
                disabled={!selectedPurpose || loading}
                size="lg"
                className="flex-1 h-14 bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 hover:scale-[1.02] font-light disabled:opacity-40"
              >
                {loading ? "Setting up..." : "Get Started →"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Brain, Headphones, Users, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ShaderBackground from "@/components/ui/shader-background";

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Auto-redirect authenticated users to home
  useEffect(() => {
    if (!loading && user) {
      navigate("/home");
    }
  }, [user, loading, navigate]);

  const handleTryItOut = () => {
    if (user) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-observe]").forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  return (
    <div className="min-h-screen">
      {/* Logo */}
      <div className="fixed top-6 left-6 z-50">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Cypher
        </h1>
      </div>

      {/* Hero Section with black edges */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden bg-background">
        {/* Removed shader background */}
        
        {/* White gradient edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/60 z-10" />
        
        <div className="relative z-20 max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent pb-3">
            Learn languages through context
          </h1>
          <h2 className="text-4xl md:text-5xl font-light text-foreground/80">
            — not textbooks.
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto">
            Converse naturally with AI characters that teach you in real-life scenarios.
          </p>
          <Button
            onClick={handleTryItOut}
            size="lg"
            className="h-16 px-12 text-lg bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 hover:scale-105 btn-3d"
          >
            TRY IT OUT!
          </Button>
          
          <div className="mt-12 flex justify-center gap-8 text-sm text-muted-foreground opacity-70">
            <span>🇨🇳 你好</span>
            <span>🇬🇧 Hello</span>
            <span>🇪🇸 Hola</span>
            <span>🇫🇷 Bonjour</span>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section
        id="problem"
        data-observe
        className={`py-32 px-4 bg-gradient-to-b from-background to-secondary/10 transition-all duration-1000 ${
          isVisible("problem") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Traditional apps teach words, not communication.
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Memorization-based learning creates gaps between vocabulary and real conversation. 
              You end up knowing words but unable to use them naturally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Card className="glass p-12 text-center space-y-4 border-none shadow-float">
              <div className="text-6xl font-bold bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">
                70%
              </div>
              <p className="text-xl text-muted-foreground">
                forget new words within 24 hours
              </p>
            </Card>
            <Card className="glass p-12 text-center space-y-4 border-none shadow-float">
              <div className="text-6xl font-bold bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">
                15%
              </div>
              <p className="text-xl text-muted-foreground">
                ever reach conversational fluency
              </p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <Card className="glass p-8 space-y-4 border-none shadow-soft opacity-60">
              <h3 className="text-2xl font-semibold">❌ Textbook Apps</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Isolated vocabulary lists</li>
                <li>• No real context</li>
                <li>• Boring repetition</li>
                <li>• Can't apply to real life</li>
              </ul>
            </Card>
            <Card className="gradient-edge p-8 space-y-4 border-none shadow-glow">
              <h3 className="text-2xl font-semibold">✨ Cypher</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Learn through conversations</li>
                <li>• Real-world scenarios</li>
                <li>• Dynamic interactions</li>
                <li>• Immediate application</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section
        id="solution"
        data-observe
        className={`py-32 px-4 transition-all duration-1000 ${
          isVisible("solution") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Cypher — Learn like you live it.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass p-8 space-y-4 border-none shadow-float hover:shadow-glow transition-all duration-300">
              <MessageSquare className="w-12 h-12 text-primary" />
              <h3 className="text-2xl font-semibold">AI Conversations</h3>
              <p className="text-muted-foreground font-light">
                Practice realistic scenarios with AI that adapts to your level and responds naturally.
              </p>
            </Card>

            <Card className="glass p-8 space-y-4 border-none shadow-float hover:shadow-glow transition-all duration-300">
              <Brain className="w-12 h-12 text-accent" />
              <h3 className="text-2xl font-semibold">Context-Based Lessons</h3>
              <p className="text-muted-foreground font-light">
                Learn language through purpose — travel, work, social life — not random word lists.
              </p>
            </Card>

            <Card className="glass p-8 space-y-4 border-none shadow-float hover:shadow-glow transition-all duration-300">
              <Headphones className="w-12 h-12 text-primary" />
              <h3 className="text-2xl font-semibold">Tone & Pinyin Practice</h3>
              <p className="text-muted-foreground font-light">
                Master Mandarin pronunciation with realistic voice playback and tone visualization.
              </p>
            </Card>

            <Card className="glass p-8 space-y-4 border-none shadow-float hover:shadow-glow transition-all duration-300">
              <Users className="w-12 h-12 text-accent" />
              <h3 className="text-2xl font-semibold">AI Friends</h3>
              <p className="text-muted-foreground font-light">
                Build relationships with characters who remember your story and help you grow.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Quote Section */}
      <section
        id="research"
        data-observe
        className={`py-32 px-4 bg-gradient-to-b from-background to-secondary/10 transition-all duration-1000 ${
          isVisible("research") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <Card className="glass p-12 border-none shadow-float text-center">
            <blockquote className="space-y-6">
              <p className="text-2xl md:text-3xl font-light italic text-foreground/90 leading-relaxed">
                "Words and structures encountered in real, dynamic contexts trigger stronger emotional 
                and sensory associations, leading to deeper encoding in memory."
              </p>
              <footer className="text-lg text-muted-foreground">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  — Language Learning & Cognition Research, 2021
                </span>
              </footer>
            </blockquote>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        data-observe
        className={`py-32 px-4 transition-all duration-1000 ${
          isVisible("how-it-works") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Experience fluency in 3 steps.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Card className="gradient-edge p-8 text-center space-y-4 border-none shadow-float">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-semibold">1. Choose your goal</h3>
              <p className="text-muted-foreground font-light">
                Select your learning purpose: travel, work, social, or study.
              </p>
            </Card>

            <Card className="gradient-edge p-8 text-center space-y-4 border-none shadow-float">
              <div className="text-5xl mb-4">🌳</div>
              <h3 className="text-2xl font-semibold">2. Follow your tree</h3>
              <p className="text-muted-foreground font-light">
                Progress through personalized learning paths designed for your goals.
              </p>
            </Card>

            <Card className="gradient-edge p-8 text-center space-y-4 border-none shadow-float">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-2xl font-semibold">3. Chat and learn</h3>
              <p className="text-muted-foreground font-light">
                Immerse yourself in conversations that feel real and build fluency.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section
        id="testimonials"
        data-observe
        className={`py-32 px-4 bg-gradient-to-b from-background to-secondary/10 transition-all duration-1000 ${
          isVisible("testimonials") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              What early learners are saying.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass p-8 space-y-4 border-none shadow-float hover:shadow-glow transition-all duration-300">
              <p className="text-lg italic text-muted-foreground">
                "It feels like texting a real friend — but I'm learning Chinese."
              </p>
              <div className="text-sm text-muted-foreground/70">— Sarah K.</div>
            </Card>

            <Card className="glass p-8 space-y-4 border-none shadow-float hover:shadow-glow transition-all duration-300">
              <p className="text-lg italic text-muted-foreground">
                "Finally, an app that teaches context, not vocabulary lists."
              </p>
              <div className="text-sm text-muted-foreground/70">— Michael R.</div>
            </Card>

            <Card className="glass p-8 space-y-4 border-none shadow-float hover:shadow-glow transition-all duration-300">
              <p className="text-lg italic text-muted-foreground">
                "Cypher helped me actually speak with confidence."
              </p>
              <div className="text-sm text-muted-foreground/70">— Jessica L.</div>
            </Card>
          </div>

        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent pb-3">
              Fluency through feeling.
            </h2>
            <p className="text-2xl md:text-3xl text-muted-foreground font-light">
              Start your Cypher journey today.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate("/start")}
              size="lg"
              className="h-16 px-12 text-lg bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 hover:scale-105 btn-3d"
            >
              TRY IT OUT!
            </Button>
            <Button
              onClick={() => navigate("/home")}
              variant="ghost"
              size="lg"
              className="h-16 px-8 text-lg group"
            >
              Learn more
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground/60">
            <span>36 hours</span>
            <span>•</span>
            <span>Built at Cal Hacks</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, Sparkles, Sprout, Music, Mic, HandMetal, Hash, BookMarked, UtensilsCrossed, Users, Briefcase, Plane, Heart, MapPin, ShoppingBag, BookOpen, type LucideIcon } from "lucide-react";

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon_emoji: string;
  difficulty: string;
  category: string;
}

interface Branch {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  lessons: Scenario[];
  expanded: boolean;
}

const categoryConfig: Record<string, { title: string; icon: LucideIcon; description: string }> = {
  "ordering": {
    title: "Ordering & Daily Tasks",
    icon: UtensilsCrossed,
    description: "Transactional and service interactions"
  },
  "social": {
    title: "Social & Relationship",
    icon: Users,
    description: "Casual and emotional communication"
  },
  "professional": {
    title: "Professional & Academic",
    icon: Briefcase,
    description: "Workplace and formal language"
  },
  "travel": {
    title: "Travel & Navigation",
    icon: Plane,
    description: "Moving around and situational awareness"
  },
  "health": {
    title: "Emergency & Health",
    icon: Heart,
    description: "Survival and care situations"
  }
};

const coreFoundations = [
  {
    id: "pinyin-tones",
    title: "Pinyin & Tones",
    icon: Music,
    difficulty: "beginner",
    route: "/pinyin-tones",
  },
  {
    id: "pronunciation",
    title: "Pronunciation",
    icon: Mic,
    difficulty: "beginner",
    route: "/pronunciation",
  },
  {
    id: "greetings",
    title: "Greetings",
    icon: HandMetal,
    difficulty: "beginner",
    route: "/greetings",
  },
  {
    id: "numbers",
    title: "Numbers & Counting",
    icon: Hash,
    difficulty: "beginner",
    route: "/numbers",
  },
  {
    id: "daily-words",
    title: "Daily Words",
    icon: BookMarked,
    difficulty: "beginner",
    route: "/daily-words",
  }
];

// Get category icon for lessons  
const getCategoryIcon = (category: string): LucideIcon => {
  const iconMap: { [key: string]: LucideIcon } = {
    "food": UtensilsCrossed,
    "travel": MapPin,
    "social": Users,
    "shopping": ShoppingBag,
    "entertainment": Sparkles,
    "education": BookOpen,
    "ordering": UtensilsCrossed,
    "professional": Briefcase,
    "health": Heart
  };
  return iconMap[category] || Sparkles;
};

export const LevelMap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const { data: scenarios, error } = await supabase
          .from("scenarios")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;

        // Group scenarios by category
        const grouped = scenarios?.reduce((acc, scenario) => {
          const category = scenario.category || "ordering";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(scenario);
          return acc;
        }, {} as Record<string, Scenario[]>) || {};

        // Create branches from grouped scenarios
        const branchList: Branch[] = Object.entries(categoryConfig).map(([key, config]) => ({
          id: key,
          title: config.title,
          icon: config.icon,
          description: config.description,
          lessons: grouped[key] || [],
          expanded: key === "ordering" // First branch expanded by default
        }));

        setBranches(branchList);
      } catch (error) {
        console.error("Error loading scenarios:", error);
        toast({
          title: "Error",
          description: "Failed to load lessons. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadScenarios();
  }, [toast]);

  const handleCoreModuleClick = (route: string) => {
    // Navigate to explainer pages instead of chat
    navigate(route);
  };

  const toggleBranch = (branchId: string) => {
    setBranches(prev => prev.map(branch => 
      branch.id === branchId 
        ? { ...branch, expanded: !branch.expanded }
        : branch
    ));
  };

  const handleMainTreeClick = (lesson: Scenario) => {
    // For demo: all lessons are clickable
    // In production: check if Core Foundations are completed
    navigate(`/chat?scenario=${lesson.id}`);
  };

  if (loading) {
    return (
      <div className="relative w-full max-w-6xl mx-auto py-12 flex items-center justify-center min-h-[400px]">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-primary/60 rounded-full animate-float" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 bg-primary/60 rounded-full animate-float" style={{ animationDelay: "300ms" }} />
          <div className="w-3 h-3 bg-primary/60 rounded-full animate-float" style={{ animationDelay: "600ms" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto py-12 px-6">
      {/* ✨ Core Foundations Section */}
      <div className="mb-32">
        {/* Section Label */}
        <div className="flex justify-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-8 py-4 glass gradient-edge rounded-full shadow-glow">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-xl font-medium bg-gradient-to-r from-blue-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Core Foundations
            </span>
          </div>
        </div>

        {/* Duolingo-Style Curved Roadmap */}
        <div className="relative max-w-2xl mx-auto">
          {/* Curved connecting path using SVG */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none -z-10"
            style={{ height: `${coreFoundations.length * 110}px` }}
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.8" />
                <stop offset="50%" stopColor="rgb(236, 72, 153)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="rgb(251, 146, 60)" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {coreFoundations.map((_, idx) => {
              if (idx === coreFoundations.length - 1) return null;
              const isLeft = idx % 2 === 0;
              const nextIsLeft = (idx + 1) % 2 === 0;
              const startX = isLeft ? "30%" : "70%";
              const endX = nextIsLeft ? "30%" : "70%";
              const startY = idx * 110 + 55;
              const endY = (idx + 1) * 110 + 55;
              const controlY = (startY + endY) / 2;
              
              return (
                <path
                  key={`path-${idx}`}
                  d={`M ${startX} ${startY} Q 50% ${controlY} ${endX} ${endY}`}
                  stroke="url(#pathGradient)"
                  strokeWidth="5"
                  fill="none"
                  filter="url(#glow)"
                  className="animate-pulse"
                  style={{ animationDuration: "3s", animationDelay: `${idx * 0.5}s` }}
                />
              );
            })}
          </svg>

          {/* Module Nodes */}
          {coreFoundations.map((module, idx) => {
            const isLeft = idx % 2 === 0;
            const isHovered = hoveredModule === module.id;
            const isActive = idx === 0; // First module is "active" for demo
            
            return (
              <div 
                key={module.id} 
                className="relative mb-8 animate-fade-in" 
                style={{ 
                  animationDelay: `${idx * 0.1}s`,
                  height: "110px"
                }}
              >
                {/* Module Container */}
                <div className={cn(
                  "absolute top-1/2 -translate-y-1/2 transition-all duration-500",
                  isLeft ? "left-[15%]" : "left-[65%]"
                )}>
                  <button
                    onClick={() => handleCoreModuleClick(module.route)}
                    onMouseEnter={() => setHoveredModule(module.id)}
                    onMouseLeave={() => setHoveredModule(null)}
                    className="relative group"
                  >
                    {/* Outer glow effect */}
                    <div className={cn(
                      "absolute inset-0 rounded-full transition-all duration-500 blur-xl",
                      "bg-gradient-to-r from-blue-500/30 via-pink-500/30 to-orange-500/30",
                      isHovered && "scale-150 opacity-100",
                      !isHovered && "scale-100 opacity-50"
                    )} />
                    
                    {/* Module circle */}
                    <div className={cn(
                      "relative w-20 h-20 rounded-full glass",
                      "border-2 border-primary/30",
                      "flex items-center justify-center",
                      "shadow-soft transition-all duration-500",
                      "hover:scale-110 hover:shadow-glow hover:border-primary/60",
                      isHovered && "scale-110 shadow-glow border-primary/60",
                      isActive && "ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
                    )}>
                      <module.icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
                      
                      {/* Checkmark for completed */}
                      {idx === 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg animate-scale-in">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                  
                  {/* Module title */}
                  <div className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-36",
                    isLeft ? "left-full ml-5" : "right-full mr-5 text-right"
                  )}>
                    <p className={cn(
                      "text-sm font-medium text-foreground transition-all duration-300",
                      isHovered && "text-primary scale-105"
                    )}>
                      {module.title}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Divider */}
      <div className="flex justify-center mb-16 animate-fade-in">
        <div className="inline-flex items-center gap-3 px-8 py-4 glass gradient-edge rounded-full shadow-glow">
          <Sprout className="w-8 h-8 text-primary" />
          <span className="text-xl font-medium bg-gradient-to-r from-blue-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            Main Lessons
          </span>
        </div>
      </div>

      {/* 🌱 Main Tree Section */}
      <div className="space-y-4">
        {branches.map((branch, branchIdx) => {
          const hasLessons = branch.lessons.length > 0;
          
          return (
            <div
              key={branch.id}
              className="animate-fade-up"
              style={{ animationDelay: `${branchIdx * 0.1}s` }}
            >
              {/* Connecting Line Above Branch */}
              {branchIdx > 0 && (
                <div className="h-8 flex justify-center mb-2">
                  <div className="w-1 h-full bg-gradient-to-b from-blue-500 via-pink-500 to-orange-500 opacity-40 rounded-full" />
                </div>
              )}

              {/* Branch Card */}
              <div className={cn(
                "glass gradient-edge rounded-3xl overflow-hidden transition-all duration-500",
                "hover:shadow-glow",
                branch.expanded && "shadow-glow"
              )}>
                {/* Branch Header - Clickable */}
                <button
                  onClick={() => hasLessons && toggleBranch(branch.id)}
                  className={cn(
                    "w-full p-6 flex items-center gap-6 text-left transition-all",
                    hasLessons && "cursor-pointer hover:bg-primary/5"
                  )}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-soft">
                    <branch.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-foreground mb-1">{branch.title}</h3>
                    <p className="text-sm text-muted-foreground font-light">{branch.description}</p>
                    {!hasLessons && (
                      <p className="text-xs text-muted-foreground/60 mt-2 italic">Lessons coming soon...</p>
                    )}
                  </div>
                  {hasLessons && (
                    <div className="text-muted-foreground transition-transform duration-300" style={{ transform: branch.expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <ChevronDown className="h-6 w-6" />
                    </div>
                  )}
                </button>

                {/* Lessons Grid - Collapsible */}
                {hasLessons && (
                  <div className={cn(
                    "transition-all duration-500 ease-in-out overflow-hidden",
                    branch.expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                  )}>
                    <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {branch.lessons.map((lesson, lessonIdx) => {
                        const isHovered = hoveredModule === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onMouseEnter={() => setHoveredModule(lesson.id)}
                            onMouseLeave={() => setHoveredModule(null)}
                            onClick={() => handleMainTreeClick(lesson)}
                            className={cn(
                              "glass gradient-edge rounded-2xl p-5 transition-all duration-300",
                              "hover:shadow-glow hover:scale-105",
                              "flex items-start gap-4 text-left",
                              "animate-fade-in"
                            )}
                            style={{ animationDelay: `${lessonIdx * 0.05}s` }}
                          >
                            <div className={cn(
                              "w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10",
                              "flex items-center justify-center shadow-soft transition-all duration-300",
                              isHovered && "shadow-glow scale-110"
                            )}>
                              {(() => {
                                const LessonIcon = getCategoryIcon(lesson.category);
                                return <LessonIcon className="w-7 h-7 text-primary" strokeWidth={1.5} />;
                              })()}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-medium text-foreground mb-1 truncate">
                                {lesson.title}
                              </h4>
                              <p className="text-xs text-muted-foreground font-light line-clamp-2">
                                {lesson.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

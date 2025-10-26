import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import FriendCard from "@/components/FriendCard";
import { Lightbulb, X, BookOpen, Music, Mic, HandMetal, Hash, BookMarked, UtensilsCrossed, MapPin, Users, ShoppingBag, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  icon_emoji: string;
}

interface Friend {
  id: string;
  name: string;
  personality: string;
  avatar_emoji: string;
  description: string;
}

interface RoadmapNode {
  id: string;
  title: string;
  icon: LucideIcon;
  route?: string;
  scenarioId?: string;
}

// Get category icon for scenarios
const getCategoryIcon = (category: string): LucideIcon => {
  const iconMap: { [key: string]: LucideIcon } = {
    "food": UtensilsCrossed,
    "travel": MapPin,
    "social": Users,
    "shopping": ShoppingBag,
    "entertainment": Sparkles,
    "education": BookOpen
  };
  return iconMap[category] || Sparkles;
};

const coreFoundations: RoadmapNode[] = [
  {
    id: "pinyin-tones",
    title: "Pinyin & Tones",
    icon: Music,
    route: "/pinyin-tones",
  },
  {
    id: "pronunciation",
    title: "Pronunciation",
    icon: Mic,
    route: "/pronunciation",
  },
  {
    id: "greetings",
    title: "Greetings",
    icon: HandMetal,
    route: "/greetings",
  },
  {
    id: "numbers",
    title: "Numbers",
    icon: Hash,
    route: "/numbers",
  },
  {
    id: "daily-words",
    title: "Daily Words",
    icon: BookMarked,
    route: "/daily-words",
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [roadmapNodes, setRoadmapNodes] = useState<RoadmapNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipOpen, setTipOpen] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [scenariosRes, friendsRes] = await Promise.all([
          supabase.from("scenarios").select("*").limit(3),
          supabase.from("ai_friends").select("*").limit(2),
        ]);

        if (scenariosRes.data) {
          setScenarios(scenariosRes.data);
          
          // Build roadmap: core foundations + main lessons
          const mainLessons: RoadmapNode[] = scenariosRes.data.map(s => ({
            id: s.id,
            title: s.title,
            icon: getCategoryIcon(s.category || ''),
            scenarioId: s.id,
          }));
          
          setRoadmapNodes([...coreFoundations, ...mainLessons]);
        }
        if (friendsRes.data) setFriends(friendsRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Trigger notification from 小明 immediately when entering home page (only once)
  useEffect(() => {
    // Check if notification has already been triggered
    const hasTriggered = localStorage.getItem("cypherFirstNotification");
    if (hasTriggered) return;

    // Show notification immediately
    const showNotification = async () => {
      try {
        // Find 小明 from all friends
        const { data: allFriends } = await supabase
          .from("ai_friends")
          .select("*")
          .ilike("name", "%小明%")
          .single();

        if (allFriends) {
          console.log("Triggering notification from 小明...");
          await supabase.functions.invoke("generate-notification", {
            body: {
              friendId: allFriends.id,
              friendName: allFriends.name,
              friendPersonality: allFriends.personality,
              friendTraits: ["young", "energetic", "gamer", "student"],
            },
          });
          console.log("Notification generated!");
          // Mark as triggered
          localStorage.setItem("cypherFirstNotification", "true");
        }
      } catch (error) {
        console.error("Error generating notification:", error);
      }
    };

    showNotification();
  }, []);

  const handleRoadmapClick = (node: RoadmapNode) => {
    if (node.route) {
      navigate(node.route);
    } else if (node.scenarioId) {
      navigate(`/chat?scenario=${node.scenarioId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Floating Lightbulb Icon */}
      <button
        onClick={() => setTipOpen(true)}
        className="fixed top-32 right-8 z-40 p-3 glass gradient-edge rounded-full shadow-glow hover:scale-110 transition-all duration-300 animate-float"
        style={{ 
          transform: 'rotate(12deg)',
          animationDuration: '3s'
        }}
        aria-label="Cultural Tip"
      >
        <Lightbulb className="h-6 w-6 text-primary" />
      </button>

      {/* Sliding Tip Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-96 z-50 transition-transform duration-500 ease-out ${
          tipOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full p-6 flex items-start justify-center pt-32">
          <Card className="w-full glass gradient-edge border-none shadow-glow animate-fade-in">
            <div className="p-6 space-y-4">
              {/* Close Button */}
              <button
                onClick={() => setTipOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-accent/10 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>

              {/* Tip Content */}
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-foreground">Cultural Tip</h3>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    <span className="chinese-text">"你吃了吗?"</span> (Nǐ chī le ma?) means "Have you eaten?" but it's actually
                    a common greeting, like asking "How are you?" in English!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Overlay */}
      {tipOpen && (
        <div 
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setTipOpen(false)}
        />
      )}

      <div className="max-w-5xl mx-auto p-6 space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center space-y-6 pt-16">
          <h1 className="text-5xl font-light tracking-tight text-foreground">
            <span className="chinese-text">你好! </span>
            <span className="text-muted-foreground text-4xl">(Nǐ hǎo!)</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Ready to practice your Chinese today?
          </p>
        </div>

        {/* Review Introduction Box */}
        <div className="flex justify-center animate-fade-in">
          <Card
            onClick={() => navigate("/intro")}
            className="glass gradient-edge border-none shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02] cursor-pointer group max-w-md w-full"
          >
            <div className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-soft transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                  Review the Introduction
                </h3>
                <p className="text-sm text-muted-foreground font-light">
                  Recap of the very basics.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Horizontal Roadmap */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light text-foreground">Your Learning Path</h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/scenarios")}
              className="text-sm font-light hover:scale-105 transition-all"
            >
              See all →
            </Button>
          </div>

          {loading ? (
            <div className="h-40 glass animate-pulse rounded-3xl" />
          ) : (
            <div className="relative">
              <div className="relative px-8 py-12">
                {/* Only show first 6 nodes */}
                {(() => {
                  const maxVisibleNodes = 6;
                  const visibleNodes = roadmapNodes.slice(0, maxVisibleNodes);

                  return (
                    <>
                      {/* Smooth curved connecting paths */}
                      <svg 
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        style={{ height: '200px' }}
                      >
                        <defs>
                          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                            <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                          </linearGradient>
                          <filter id="pathGlow">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        {visibleNodes.map((_, idx) => {
                          const startX = idx * 140 + 70;
                          const endX = (idx + 1) * 140 + 70;
                          const isUp = idx % 2 === 0;
                          const startY = isUp ? 85 : 115;
                          const endY = !isUp ? 85 : 115;
                          
                          // Smooth S-curve using cubic Bezier
                          const controlX1 = startX + (endX - startX) * 0.3;
                          const controlY1 = startY;
                          const controlX2 = startX + (endX - startX) * 0.7;
                          const controlY2 = endY;
                          
                          return (
                            <g key={`path-${idx}`}>
                              {/* Glow layer underneath */}
                              <path
                                d={`M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`}
                                stroke="url(#pathGradient)"
                                strokeWidth="3"
                                fill="none"
                                filter="url(#pathGlow)"
                                opacity="0.4"
                              />
                              {/* Main path */}
                              <path
                                d={`M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`}
                                stroke="url(#pathGradient)"
                                strokeWidth="2"
                                fill="none"
                                className="animate-pulse"
                                style={{ animationDuration: "4s", animationDelay: `${idx * 0.2}s` }}
                              />
                            </g>
                          );
                        })}
                      </svg>

                      {/* Roadmap Nodes */}
                      <div className="relative flex items-start gap-4">
                        {visibleNodes.map((node, idx) => {
                          const isUp = idx % 2 === 0;
                          const isHovered = hoveredNode === node.id;
                          
                          return (
                            <div 
                              key={node.id}
                              className="flex flex-col items-center animate-fade-in"
                              style={{ 
                                animationDelay: `${idx * 0.1}s`,
                                paddingTop: isUp ? '0' : '30px',
                                minWidth: '140px'
                              }}
                            >
                              {/* Node Circle */}
                              <button
                                onClick={() => handleRoadmapClick(node)}
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                                className="relative group"
                              >
                                {/* Glow effect */}
                                <div className={cn(
                                  "absolute inset-0 rounded-full transition-all duration-500 blur-xl",
                                  "bg-gradient-to-br from-primary/30 via-accent/30 to-primary/20",
                                  isHovered && "scale-150 opacity-100",
                                  !isHovered && "scale-100 opacity-40"
                                )} />
                                
                                {/* Circle */}
                                <div className={cn(
                                  "relative w-16 h-16 rounded-full glass",
                                  "border-2 border-primary/30",
                                  "flex items-center justify-center",
                                  "shadow-soft transition-all duration-300",
                                  "hover:scale-110 hover:shadow-glow hover:border-primary/60",
                                  isHovered && "scale-110 shadow-glow border-primary/60"
                                )}>
                                  <node.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                                </div>
                              </button>
                              
                              {/* Node Title */}
                              <p className={cn(
                                "text-xs font-medium text-foreground text-center mt-3 max-w-[100px] transition-all duration-300",
                                isHovered && "text-primary scale-105"
                              )}>
                                {node.title}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* AI Friends */}
        <div className="space-y-6 pb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light text-foreground">Your AI Friends</h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/friends")}
              className="text-sm font-light hover:scale-105 transition-all"
            >
              See all →
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {loading ? (
              <>
                <div className="h-36 glass animate-pulse rounded-3xl" />
                <div className="h-36 glass animate-pulse rounded-3xl" />
              </>
            ) : (
              friends.map((friend, idx) => (
                <div key={friend.id} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <FriendCard
                    friend={friend}
                    onClick={() => navigate(`/chat?friend=${friend.id}`)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
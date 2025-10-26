import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, MapPin, Users, ShoppingBag, Sparkles, BookOpen } from "lucide-react";

interface ScenarioCardProps {
  scenario: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    category: string;
    icon_emoji: string;
  };
  onClick: () => void;
}

const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: any } = {
    "food": UtensilsCrossed,
    "travel": MapPin,
    "social": Users,
    "shopping": ShoppingBag,
    "entertainment": Sparkles,
    "education": BookOpen
  };
  return iconMap[category] || Sparkles;
};

const ScenarioCard = ({ scenario, onClick }: ScenarioCardProps) => {
  const IconComponent = getCategoryIcon(scenario.category);
  
  const difficultyColors: Record<string, string> = {
    beginner: "bg-primary/10 text-primary border-primary/20",
    intermediate: "bg-accent/10 text-accent-foreground border-accent/20",
    advanced: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Card
      onClick={onClick}
      className="glass gradient-edge p-6 cursor-pointer border-none shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 animate-scale-in group"
    >
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <IconComponent className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </div>
          <div 
            className="absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
            style={{ background: "var(--gradient-glow)" }}
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-base text-foreground group-hover:text-primary transition-colors">
              {scenario.title}
            </h3>
            <Badge
              variant="outline"
              className={`text-xs font-light gradient-edge ${
                difficultyColors[scenario.difficulty] || difficultyColors.beginner
              }`}
            >
              {scenario.difficulty}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed font-light">
            {scenario.description}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ScenarioCard;
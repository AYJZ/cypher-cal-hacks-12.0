import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Briefcase, Coffee } from "lucide-react";

interface FriendCardProps {
  friend: {
    id: string;
    name: string;
    personality: string;
    avatar_emoji: string;
    description: string;
  };
  onClick: () => void;
}

const getIconForFriend = (friendId: string) => {
  const iconMap: { [key: string]: any } = {
    "42040749-3d4c-4e71-9e4b-c62f7b6acbb3": Gamepad2, // Xiaoming
    "022411bc-0a00-4b4a-83e6-6ef3993c77b4": Coffee,   // Yawen
    "5c3f9264-5b28-4f77-aa21-66c58db500d5": Briefcase // David
  };
  return iconMap[friendId] || Gamepad2;
};

const FriendCard = ({ friend, onClick }: FriendCardProps) => {
  const IconComponent = getIconForFriend(friend.id);
  
  return (
    <Card
      onClick={onClick}
      className="glass gradient-edge p-5 cursor-pointer border-none shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02] animate-scale-in group"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <IconComponent className="w-7 h-7 text-primary" strokeWidth={1.5} />
          </div>
          <div 
            className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
            style={{ background: "var(--gradient-glow)" }}
          />
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-base text-foreground group-hover:text-primary transition-colors">
              {friend.name}
            </h3>
            <Badge
              variant="outline"
              className="text-xs font-light capitalize gradient-edge bg-accent/10 text-accent-foreground border-none"
            >
              {friend.personality}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-light line-clamp-2">
            {friend.description}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default FriendCard;
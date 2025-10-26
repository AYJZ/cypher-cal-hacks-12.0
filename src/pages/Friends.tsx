import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import FriendCard from "@/components/FriendCard";
import { ArrowLeft } from "lucide-react";
import { aiFriends } from "@/data/ai-friends";

interface Friend {
  id: string;
  name: string;
  personality: string;
  avatar_emoji: string;
  description: string;
}

const Friends = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        // First try to load from database
        const { data, error } = await supabase.from("ai_friends").select("*");
        
        if (data && data.length > 0) {
          setFriends(data);
        } else {
          // If no data in database or error, use local data
          console.log("Using local AI friends data");
          const localFriends = aiFriends.map(friend => ({
            id: friend.id,
            name: friend.name,
            personality: friend.personality,
            avatar_emoji: friend.avatar_emoji,
            description: friend.bio
          }));
          setFriends(localFriends);
          
          // Try to insert local data into database for future use
          if (!error) {
            await supabase.from("ai_friends").insert(localFriends);
          }
        }
      } catch (error) {
        console.error("Error loading friends:", error);
        // Fallback to local data
        const localFriends = aiFriends.map(friend => ({
          id: friend.id,
          name: friend.name,
          personality: friend.personality,
          avatar_emoji: friend.avatar_emoji,
          description: friend.bio
        }));
        setFriends(localFriends);
      } finally {
        setLoading(false);
      }
    };

    loadFriends();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="max-w-5xl mx-auto p-6 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="relative text-center space-y-4 pt-8 animate-fade-in">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/home")}
            className="absolute left-0 top-8 btn-3d hover:scale-110 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-bold text-foreground">Your AI Friends</h1>
          <p className="text-muted-foreground font-light">Chat and practice with your language buddies</p>
        </div>

        {/* Friends Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-8">
          {loading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-36 glass animate-pulse rounded-3xl" />
              ))}
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
  );
};

export default Friends;
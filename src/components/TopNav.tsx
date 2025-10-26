import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Moon, Sun, BookOpen, MessageCircle, Mic, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { NotificationBell } from "./NotificationBell";

const menuItems = [
  { title: "Pinyin", url: "/pinyin", icon: Mic, enabled: true },
  { title: "Learn", url: "/scenarios", icon: BookOpen, enabled: true },
  { title: "Friends", url: "/friends", icon: MessageCircle, enabled: true },
];

export const TopNav = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [primaryLang] = useState("English");
  const [learningLang, setLearningLang] = useState("Chinese");
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setUserProfile(data);
            setLearningLang(data.target_language || "Chinese");
          }
        });
    }
  }, [user]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-border/50 backdrop-blur-xl">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <NavLink 
          to="/home"
          className="h-10 px-6 gradient-edge rounded-2xl flex items-center justify-center shadow-soft hover:scale-105 transition-transform"
        >
          <span className="font-medium text-xl tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Cypher
          </span>
        </NavLink>

        {/* Center: Empty space for symmetry */}
        <div className="flex-1" />

        {/* Right: Navigation Items + Theme Toggle */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            {menuItems.map((item) => {
              const content = (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild={item.enabled}
                  disabled={!item.enabled}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-light btn-3d ${
                    !item.enabled && "opacity-40 cursor-not-allowed"
                  }`}
                >
                  {item.enabled ? (
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-2 ${
                          isActive
                            ? "text-primary"
                            : "text-foreground hover:text-primary"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  ) : (
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.title}</span>
                    </div>
                  )}
                </Button>
              );

              return !item.enabled ? (
                <Tooltip key={item.title}>
                  <TooltipTrigger asChild>{content}</TooltipTrigger>
                  <TooltipContent className="glass">
                    <p className="text-xs">Coming soon</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div key={item.title}>{content}</div>
              );
            })}
          </TooltipProvider>

          <div className="h-6 w-px bg-border/50 mx-2" />

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full btn-3d transition-all duration-300"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Notification Bell - Only show if logged in */}
          {user && <NotificationBell />}

          {/* Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full btn-3d transition-all duration-300"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-80 p-0 glass border-border/50 bg-background shadow-glow z-[100] animate-fade-in overflow-hidden"
              align="end"
            >
              <div className="gradient-edge rounded-xl">
                <div className="p-5 space-y-4">
                  {/* Profile Section - Only show if logged in */}
                  {user && (
                    <>
                      <div className="flex items-center gap-3 px-3 py-4 rounded-lg bg-card/30 border border-border/30">
                        {/* Profile Avatar */}
                        <div className="relative h-12 w-12 rounded-full overflow-visible flex-shrink-0">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-70 blur-sm animate-pulse" style={{ animationDuration: "3s" }} />
                          <Avatar className="h-12 w-12 relative border-2 border-background">
                            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || "User"} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                              {user.email?.[0].toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        
                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
                          {userProfile && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Learning {userProfile.target_language}
                            </p>
                          )}
                        </div>
                      </div>

                      <DropdownMenuSeparator className="bg-border/20" />
                    </>
                  )}

                  {/* Language Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-light px-1">
                      <Globe className="h-3.5 w-3.5" />
                      <span>Languages</span>
                    </div>
                    
                    {/* Mother Tongue */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground px-1">Mother Tongue</label>
                      <div className="px-3 py-2.5 rounded-lg bg-card/30 border border-border/30">
                        <p className="text-sm font-medium text-foreground">
                          {primaryLang}
                        </p>
                      </div>
                    </div>

                    {/* Learning Language */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground px-1">Learning Language</label>
                      <div className="px-3 py-2.5 rounded-lg bg-card/30 border border-border/30">
                        <p className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          {learningLang === "Chinese" ? "中文 Chinese" : learningLang}
                        </p>
                      </div>
                    </div>

                    {/* Change Language Button */}
                    <Button
                      onClick={() => navigate("/start")}
                      variant="ghost"
                      className="w-full h-10 justify-start px-3 hover:bg-card/50 transition-all duration-300 font-light"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Change Languages
                    </Button>
                  </div>

                  {/* Logout Button - Only show if logged in */}
                  {user && (
                    <>
                      <DropdownMenuSeparator className="bg-border/20" />
                      <Button
                        onClick={signOut}
                        variant="destructive"
                        className="w-full h-10 font-medium shadow-soft hover:shadow-glow transition-all duration-300"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Log Out
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

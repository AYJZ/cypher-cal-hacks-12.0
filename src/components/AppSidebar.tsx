import { BookOpen, MessageCircle, Mic } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { title: "Pinyin", url: "/pinyin", icon: Mic, enabled: true },
  { title: "Learn", url: "/scenarios", icon: BookOpen, enabled: true },
  { title: "Friends", url: "/friends", icon: MessageCircle, enabled: true },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border/50 glass backdrop-blur-xl">
      <SidebarContent>
        <div className="p-6 border-b border-border/30">
          <div className="h-12 gradient-edge rounded-2xl flex items-center justify-center shadow-soft">
            <span className="font-medium text-xl tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Cypher
            </span>
          </div>
        </div>

        <SidebarGroup className="mt-6 px-3">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <TooltipProvider>
                {menuItems.map((item) => {
                  const content = (
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-light btn-3d ${
                            isActive
                              ? "gradient-edge text-foreground shadow-glow scale-105"
                              : "hover:scale-102 text-sidebar-foreground"
                          } ${!item.enabled && "opacity-40 cursor-not-allowed"}`
                        }
                        onClick={(e) => !item.enabled && e.preventDefault()}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  );

                  return (
                    <SidebarMenuItem key={item.title}>
                      {!item.enabled ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{content}</TooltipTrigger>
                          <TooltipContent side="right" className="glass">
                            <p className="text-xs">Coming soon</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        content
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </TooltipProvider>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

import { ReactNode } from "react";
import { TopNav } from "./TopNav";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <TopNav />
      <main className="flex-1 pt-16">{children}</main>
    </div>
  );
}

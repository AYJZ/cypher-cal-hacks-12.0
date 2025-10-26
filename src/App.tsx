import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Intro from "./pages/Intro";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Scenarios from "./pages/Scenarios";
import Pinyin from "./pages/Pinyin";
import PinyinTones from "./pages/PinyinTones";
import Pronunciation from "./pages/Pronunciation";
import Greetings from "./pages/Greetings";
import GreetingsQuiz from "./pages/GreetingsQuiz";
import Numbers from "./pages/Numbers";
import DailyWords from "./pages/DailyWords";
import Friends from "./pages/Friends";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/AppLayout";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/start" element={<Onboarding />} />
              <Route path="/intro" element={<Intro />} />
              <Route path="/home" element={<AppLayout><Home /></AppLayout>} />
              <Route path="/chat" element={<AppLayout><Chat /></AppLayout>} />
              <Route path="/scenarios" element={<AppLayout><Scenarios /></AppLayout>} />
              <Route path="/pinyin" element={<Pinyin />} />
              <Route path="/pinyin-tones" element={<PinyinTones />} />
              <Route path="/pronunciation" element={<Pronunciation />} />
              <Route path="/greetings" element={<Greetings />} />
              <Route path="/greetings-quiz" element={<GreetingsQuiz />} />
              <Route path="/numbers" element={<Numbers />} />
              <Route path="/daily-words" element={<DailyWords />} />
              <Route path="/friends" element={<AppLayout><Friends /></AppLayout>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

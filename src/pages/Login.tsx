import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const { user, loading, signInWithGoogle, signInAsGuest } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate("/home");
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error("Failed to sign in with Google");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="animate-pulse text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md p-8 glass gradient-edge shadow-glow animate-fade-in">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="h-16 px-8 gradient-edge rounded-2xl flex items-center justify-center shadow-soft">
              <span className="font-medium text-3xl tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Cypher
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Welcome to Cypher.
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to save your progress and continue your journey.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full h-12 bg-white hover:bg-white/90 text-gray-900 font-medium shadow-glow hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              onClick={signInAsGuest}
              variant="outline"
              className="w-full h-12 gradient-edge bg-card/50 hover:bg-card text-foreground font-light"
            >
              Continue as Guest
            </Button>
          </div>

          <p className="text-xs text-muted-foreground pt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </Card>
      
    </div>
  );
}

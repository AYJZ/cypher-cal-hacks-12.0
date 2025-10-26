import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LevelMap } from "@/components/LevelMap";

const Scenarios = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
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
          <h1 className="text-4xl font-bold text-foreground">Learn Chinese</h1>
          <p className="text-muted-foreground font-light">Follow the path and unlock new lessons</p>
        </div>

        {/* Level Map */}
        <LevelMap />
      </div>
    </div>
  );
};

export default Scenarios;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X, Sparkles, ArrowRight, Sun, Briefcase, Moon, UtensilsCrossed, HandMetal, MessageCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: number;
  question: string;
  icon: LucideIcon;
  options: {
    text: string;
    pinyin?: string;
    isCorrect: boolean;
  }[];
  explanation?: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "It's 6 AM. You meet your teacher on the street. What should you say?",
    icon: Sun,
    options: [
      { text: "早上好！", pinyin: "zǎoshang hǎo", isCorrect: true },
      { text: "晚上好！", pinyin: "wǎnshang hǎo", isCorrect: false },
      { text: "你吃了吗？", pinyin: "nǐ chī le ma", isCorrect: false },
      { text: "再见！", pinyin: "zàijiàn", isCorrect: false },
    ],
    explanation: "早上好 (Good morning) is the appropriate greeting in the morning hours."
  },
  {
    id: 2,
    question: "Which greeting is most formal?",
    icon: Briefcase,
    options: [
      { text: "您好！", pinyin: "nín hǎo", isCorrect: true },
      { text: "嗨！", pinyin: "hāi", isCorrect: false },
      { text: "嘿！", pinyin: "hēi", isCorrect: false },
      { text: "哈喽～", pinyin: "hāló", isCorrect: false },
    ],
    explanation: "您好 uses the formal 'you' (您) and is the most respectful greeting."
  },
  {
    id: 3,
    question: "It's 8 PM. You're leaving a business dinner. What do you say?",
    icon: Moon,
    options: [
      { text: "早上好", pinyin: "zǎoshang hǎo", isCorrect: false },
      { text: "拜拜～", pinyin: "bàibài", isCorrect: false },
      { text: "再见", pinyin: "zàijiàn", isCorrect: true },
      { text: "嘿", pinyin: "hēi", isCorrect: false },
    ],
    explanation: "再见 (goodbye) is formal and appropriate for business settings."
  },
  {
    id: 4,
    question: "Someone greets you with '你吃了吗？' — what's the correct response?",
    icon: UtensilsCrossed,
    options: [
      { text: "我吃了，谢谢！", pinyin: "wǒ chī le, xièxie", isCorrect: true },
      { text: "不吃！", pinyin: "bù chī", isCorrect: false },
      { text: "你好！", pinyin: "nǐ hǎo", isCorrect: false },
      { text: "再见！", pinyin: "zàijiàn", isCorrect: false },
    ],
    explanation: "'Have you eaten?' is a common greeting. Respond naturally with '我吃了，谢谢' (I've eaten, thanks)."
  },
  {
    id: 5,
    question: "Your friend is leaving. Which is the most casual way to say goodbye?",
    icon: HandMetal,
    options: [
      { text: "再见", pinyin: "zàijiàn", isCorrect: false },
      { text: "您慢走", pinyin: "nín màn zǒu", isCorrect: false },
      { text: "拜拜～", pinyin: "bàibài", isCorrect: true },
      { text: "晚安", pinyin: "wǎn'ān", isCorrect: false },
    ],
    explanation: "拜拜 (bye-bye) is borrowed from English and very casual among friends."
  },
  {
    id: 6,
    question: "In Chinese culture, what does '你吃了吗？' actually mean when used as a greeting?",
    icon: MessageCircle,
    options: [
      { text: "Do you want to eat together?", isCorrect: false },
      { text: "How are you? (showing care)", isCorrect: true },
      { text: "What did you eat?", isCorrect: false },
      { text: "Are you hungry?", isCorrect: false },
    ],
    explanation: "This phrase literally means 'Have you eaten?' but functions as 'How are you?' — showing care and concern."
  },
];

export default function GreetingsQuiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showQuizIntro, setShowQuizIntro] = useState(true);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  useEffect(() => {
    // Show intro popup for 2 seconds
    const timer = setTimeout(() => setShowQuizIntro(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAnswer = (optionIndex: number) => {
    if (feedback) return; // Prevent multiple clicks

    setSelectedOption(optionIndex);
    const correct = quizQuestions[currentQuestion].options[optionIndex].isCorrect;
    setFeedback(correct ? "correct" : "incorrect");

    if (correct) {
      setScore(score + 1);
    }

    // Move to next after delay
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setFeedback(null);
        setSelectedOption(null);
      } else {
        setShowSummary(true);
      }
    }, 2000);
  };

  if (showQuizIntro) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center animate-fade-in">
        <div className="text-center space-y-4 glass gradient-edge p-12 rounded-3xl shadow-glow">
          <Sparkles className="h-16 w-16 text-primary mx-auto animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Quiz Time!
          </h1>
          <p className="text-muted-foreground">Test your greeting knowledge</p>
        </div>
      </div>
    );
  }

  if (showSummary) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-6 space-y-8 animate-fade-in">
          {/* Summary Card */}
          <div className="glass gradient-edge p-8 rounded-3xl shadow-glow text-center space-y-6">
            <div className={cn(
              "w-24 h-24 rounded-full mx-auto flex items-center justify-center",
              passed ? "bg-green-500/20" : "bg-orange-500/20"
            )}>
              {passed ? (
                <Check className="h-12 w-12 text-green-500" />
              ) : (
                <Sparkles className="h-12 w-12 text-orange-500" />
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                {passed ? "Excellent Work! 🎉" : "Good Effort! 💪"}
              </h2>
              <p className="text-muted-foreground">
                {passed 
                  ? "You've mastered the greetings!" 
                  : "Review the lesson and try again"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {score}/{quizQuestions.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {percentage}% correct
              </div>
            </div>

            {passed ? (
              <div className="space-y-4 pt-4">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-foreground">
                    ✅ You've unlocked the next lesson!
                  </p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => { window.scrollTo(0, 0); navigate("/numbers"); }}
                  className="w-full shadow-glow group"
                >
                  Continue to Numbers
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => { window.scrollTo(0, 0); navigate("/greetings"); }}
                  className="w-full"
                >
                  Review Lesson
                </Button>
                <Button 
                  size="lg" 
                  onClick={() => {
                    setCurrentQuestion(0);
                    setScore(0);
                    setShowSummary(false);
                    setFeedback(null);
                    setSelectedOption(null);
                  }}
                  className="w-full shadow-glow"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-6 space-y-8">
        {/* Progress Bar */}
        <div className="space-y-2 animate-fade-in">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question Card */}
        <div className="glass gradient-edge p-8 rounded-3xl shadow-soft space-y-6 animate-fade-in">
          {/* Icon */}
          <div className="flex justify-center">
            <question.icon className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>

          {/* Question Text */}
          <h2 className="text-2xl font-medium text-foreground text-center">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 pt-4">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = option.isCorrect;
              const showResult = feedback !== null;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={feedback !== null}
                  className={cn(
                    "w-full p-5 rounded-xl text-left transition-all duration-300",
                    "glass gradient-edge border-2",
                    !showResult && "hover:scale-[1.02] hover:shadow-glow",
                    showResult && isSelected && isCorrect && "bg-green-500/20 border-green-500 scale-[1.02] shadow-glow animate-scale-in",
                    showResult && isSelected && !isCorrect && "bg-red-500/20 border-red-500 animate-shake",
                    showResult && !isSelected && isCorrect && "bg-green-500/10 border-green-500/50",
                    feedback && "cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-xl font-semibold text-foreground">
                        {option.text}
                      </div>
                      {option.pinyin && (
                        <div className="text-sm text-primary">
                          {option.pinyin}
                        </div>
                      )}
                    </div>
                    {showResult && isSelected && (
                      isCorrect ? (
                        <Check className="h-6 w-6 text-green-500" />
                      ) : (
                        <X className="h-6 w-6 text-red-500" />
                      )
                    )}
                    {showResult && !isSelected && isCorrect && (
                      <Check className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {feedback && question.explanation && (
            <div className={cn(
              "p-4 rounded-xl animate-fade-in flex items-start gap-3",
              feedback === "correct" ? "bg-green-500/10 border border-green-500/20" : "bg-orange-500/10 border border-orange-500/20"
            )}>
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
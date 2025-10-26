import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Send, ArrowLeft, Gamepad2, Briefcase, Coffee, Sparkles } from "lucide-react";
import ChatBubble from "@/components/ChatBubble";
import { getAIFriend } from "@/data/ai-friends";

interface MessageSegment {
  chinese: string;
  pinyin: string;
  english: string;
}

interface Message {
  role: "user" | "assistant";
  content: string | { segments: MessageSegment[] };
}

// Get personalized greeting based on personality - asks contextual questions
const getPersonalizedGreeting = (personality: string, name: string): Message => {
  const greetings = {
    playful: {
      segments: [
        { chinese: "哟！", pinyin: "Yō!", english: "Yo! " },
        { chinese: `我是${name}，`, pinyin: `Wǒ shì ${name},`, english: `I'm ${name}, ` },
        { chinese: "你呢？", pinyin: "nǐ ne?", english: "and you? " },
        { chinese: "叫什么名字？", pinyin: "Jiào shénme míngzì?", english: "What's your name? " },
        { chinese: "今天过得咋样？", pinyin: "Jīntiān guò de zǎyàng?", english: "How's it going today? " },
        { chinese: "最近有啥好玩的吗？", pinyin: "Zuìjìn yǒu shá hǎowán de ma?", english: "Anything fun lately?" }
      ]
    },
    friendly: {
      segments: [
        { chinese: "你好！", pinyin: "Nǐ hǎo!", english: "Hello! " },
        { chinese: `我是${name}，`, pinyin: `Wǒ shì ${name},`, english: `I'm ${name}, ` },
        { chinese: "很高兴认识你！", pinyin: "Hěn gāoxìng rènshi nǐ!", english: "Nice to meet you! " },
        { chinese: "你叫什么名字呀？", pinyin: "Nǐ jiào shénme míngzì ya?", english: "What's your name? " },
        { chinese: "今天过得好吗？", pinyin: "Jīntiān guò de hǎo ma?", english: "How's your day?" }
      ]
    },
    professional: {
      segments: [
        { chinese: "您好。", pinyin: "Nín hǎo.", english: "Hello. " },
        { chinese: `我是${name}。`, pinyin: `Wǒ shì ${name}.`, english: `I am ${name}. ` },
        { chinese: "请问您怎么称呼？", pinyin: "Qǐngwèn nín zěnme chēnghu?", english: "May I ask your name? " },
        { chinese: "最近工作或学习进展如何？", pinyin: "Zuìjìn gōngzuò huò xuéxí jìnzhǎn rúhé?", english: "How is your work or studies going?" }
      ]
    },
    humorous: {
      segments: [
        { chinese: "哈喽！", pinyin: "Hāló!", english: "Hello! " },
        { chinese: `我是${name}，`, pinyin: `Wǒ shì ${name},`, english: `I'm ${name}, ` },
        { chinese: "你呢？", pinyin: "nǐ ne?", english: "and you? " },
        { chinese: "今天有啥搞笑的事吗？", pinyin: "Jīntiān yǒu shá gǎoxiào de shì ma?", english: "Anything funny happen today? " },
        { chinese: "想听个笑话吗？", pinyin: "Xiǎng tīng gè xiàohuà ma?", english: "Want to hear a joke?" }
      ]
    },
    teacher: {
      segments: [
        { chinese: "同学你好！", pinyin: "Tóngxué nǐ hǎo!", english: "Hello, student! " },
        { chinese: `我是${name}老师。`, pinyin: `Wǒ shì ${name} lǎoshī.`, english: `I'm teacher ${name}. ` },
        { chinese: "你叫什么名字？", pinyin: "Nǐ jiào shénme míngzì?", english: "What's your name? " },
        { chinese: "最近学习怎么样？", pinyin: "Zuìjìn xuéxí zěnme yàng?", english: "How are your studies? " },
        { chinese: "今天想练习什么？", pinyin: "Jīntiān xiǎng liànxí shénme?", english: "What shall we practice today?" }
      ]
    },
    curious: {
      segments: [
        { chinese: "你好！", pinyin: "Nǐ hǎo!", english: "Hello! " },
        { chinese: `我叫${name}，`, pinyin: `Wǒ jiào ${name},`, english: `I'm ${name}, ` },
        { chinese: "你呢？", pinyin: "nǐ ne?", english: "and you? " },
        { chinese: "你为什么想学中文啊？", pinyin: "Nǐ wèishénme xiǎng xué Zhōngwén a?", english: "Why do you want to learn Chinese? " },
        { chinese: "很好奇你的故事！", pinyin: "Hěn hàoqí nǐ de gùshi!", english: "I'm curious about your story!" }
      ]
    }
  };

  return {
    role: "assistant",
    content: greetings[personality] || greetings.friendly
  };
};

const Chat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<any>({});
  const [friendVoice, setFriendVoice] = useState<string>("zh-CN-XiaoxiaoNeural");
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scenarioId = searchParams.get("scenario");
  const friendId = searchParams.get("friend");

  const getIconForContext = () => {
    if (friendId) {
      const iconMap: { [key: string]: any } = {
        "42040749-3d4c-4e71-9e4b-c62f7b6acbb3": Gamepad2,
        "022411bc-0a00-4b4a-83e6-6ef3993c77b4": Coffee,
        "5c3f9264-5b28-4f77-aa21-66c58db500d5": Briefcase
      };
      return iconMap[friendId] || Gamepad2;
    }
    return Sparkles;
  };

  const ContextIcon = getIconForContext();

  useEffect(() => {
    const loadContext = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (scenarioId) {
          const { data } = await supabase
            .from("scenarios")
            .select("*")
            .eq("id", scenarioId)
            .single();
          
          if (data) {
            setContext(data);
            // Trigger initial contextual greeting
            const greetingRequest = async () => {
              try {
                const { data: greetingData, error: greetingError } = await supabase.functions.invoke("chat", {
                  body: {
                    messages: [{ role: "user", content: "[START_SCENARIO]" }],
                    scenario: data.title,
                    scenarioContext: data.context,
                  },
                });

                if (!greetingError && greetingData?.message) {
                  setMessages([{
                    role: "assistant",
                    content: greetingData.message
                  }]);
                }
              } catch (e) {
                console.error("Error loading initial greeting:", e);
              }
            };
            greetingRequest();
          }
        } else if (friendId) {
          const { data } = await supabase
            .from("ai_friends")
            .select("*")
            .eq("id", friendId)
            .single();
          
          if (data) {
            setContext(data);
            
            // Get friend personality from our data
            const friendData = getAIFriend(friendId);
            if (friendData) {
              const { getVoiceId } = await import('@/lib/azure-speech');
              setFriendVoice(getVoiceId(friendData.voiceKey));
              setContext(prev => ({ ...prev, ...friendData }));
            }
            
            // Load conversation state (name knowledge)
            let conversationState = null;
            if (user) {
              const { data: stateData } = await supabase
                .from("conversation_state")
                .select("*")
                .eq("user_id", user.id)
                .eq("friend_id", friendId)
                .single();
              
              conversationState = stateData;
              
              // If no conversation state exists, create one
              if (!stateData) {
                await supabase
                  .from("conversation_state")
                  .insert({
                    user_id: user.id,
                    friend_id: friendId,
                    knows_user_name: false
                  });
              }
            }
            
            // Load conversation history
            if (user) {
              // TEMPORARILY DISABLED: Skip history loading - always start fresh
              const history = null; // Force no history
              
              if (history && history.length > 0) {
                // This block won't run now
                const historicalMessages = history.map(msg => ({
                  role: msg.role as "user" | "assistant",
                  content: msg.role === "assistant" && msg.chinese_text 
                    ? {
                        segments: [{
                          chinese: msg.chinese_text || "",
                          pinyin: msg.pinyin_text || "",
                          english: msg.english_text || ""
                        }]
                      }
                    : msg.content
                }));
                
                // Ensure bot ALWAYS greets first - if no assistant message at start, add greeting
                if (historicalMessages[0]?.role !== 'assistant') {
                  const greeting = getPersonalizedGreeting(
                    friendData?.personality || 'friendly',
                    friendData?.name.split(' ')[0] || '朋友'
                  );
                  setMessages([greeting, ...historicalMessages]);
                } else {
                  setMessages(historicalMessages);
                }
              } else {
                // No history - bot greets and waits for user to start conversation
                const greeting = getPersonalizedGreeting(
                  friendData?.personality || 'friendly',
                  friendData?.name.split(' ')[0] || '朋友'
                );
                setMessages([greeting]);
              }
            }
          }
        }

        // Load user purpose
        if (user) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("purpose")
            .eq("user_id", user.id)
            .single();
          
          if (profile) {
            setContext((prev: any) => ({ ...prev, userPurpose: profile.purpose }));
          }
        } else {
          const purpose = localStorage.getItem("cypherPurpose");
          if (purpose) {
            setContext((prev: any) => ({ ...prev, userPurpose: purpose }));
          }
        }
      } catch (error) {
        console.error("Error loading context:", error);
      }
    };

    loadContext();
  }, [scenarioId, friendId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Get conversation state for name knowledge
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData.user;
      let knowsUserName = false;
      let userName = null;
      
      if (currentUser && friendId) {
        const { data: stateData } = await supabase
          .from("conversation_state")
          .select("*")
          .eq("user_id", currentUser.id)
          .eq("friend_id", friendId)
          .single();
        
        if (stateData) {
          knowsUserName = stateData.knows_user_name;
          userName = stateData.user_name;
        }
      }
      
      // Include conversation history for context (last 15 messages)
      const conversationHistory = messages.slice(-15);
      
      console.log('Sending message to chat function with', conversationHistory.length, 'messages in history');
      
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [...conversationHistory, userMessage],
          scenario: context.title,
          scenarioContext: context.context,
          friendPersonality: context.personality,
          friendTraits: context.traits,
          friendSpeakingStyle: context.speaking_style,
          friendName: context.name,
          friendBio: context.bio || context.characterRole,
          knowsUserName,
          userName,
        },
      });
      
      // Check if the user introduced themselves in this message
      if (!knowsUserName && typeof input === 'string' && currentUser && friendId) {
        const nameIntroPatterns = [
          /我叫(\p{L}+)/u,
          /我是(\p{L}+)/u,
          /叫我(\p{L}+)/u,
          /名字是(\p{L}+)/u,
          /My name is (\w+)/i,
          /I'm (\w+)/i,
          /Call me (\w+)/i
        ];
        
        for (const pattern of nameIntroPatterns) {
          const match = input.match(pattern);
          if (match && match[1]) {
            const detectedName = match[1].trim();
            await supabase
              .from("conversation_state")
              .update({
                knows_user_name: true,
                user_name: detectedName
              })
              .eq("user_id", currentUser.id)
              .eq("friend_id", friendId);
            console.log('Updated conversation state with name:', detectedName);
            break;
          }
        }
      }

      if (error) {
        console.error('Edge function invocation error:', error);
        throw error;
      }

      if (data.error) {
        console.error('Chat function returned error:', data.error);
        
        // Show user-friendly error messages
        let errorMessage = data.error;
        if (data.error.includes('Rate limit')) {
          errorMessage = "⚠️ Too many requests. Please wait a moment and try again.";
        } else if (data.error.includes('Payment required')) {
          errorMessage = "⚠️ AI credits depleted. Please contact support.";
        } else {
          errorMessage = "⚠️ Connection issue. Please try again.";
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        
        // Remove the user message since the AI didn't respond
        setMessages((prev) => prev.slice(0, -1));
        setInput(input); // Restore the input
        return;
      }

      console.log('Received AI response:', data.message);

      const aiMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages((prev) => [...prev, aiMessage]);

      // If in a scenario, auto-complete lesson after a few exchanges
      if (scenarioId && !lessonCompleted) {
        const totalMessages = [...messages, userMessage, aiMessage];
        const userCount = totalMessages.filter(m => m.role === 'user').length;
        const assistantCount = totalMessages.filter(m => m.role === 'assistant').length;
        if (userCount >= 3 && assistantCount >= 3) {
          setLessonCompleted(true);
          toast({ title: "Lesson completed", description: "Great work! You've finished this conversation." });
        }
      }

      // Extract text for saving to database
      const contentForDb = typeof data.message === "object" 
        ? {
            chinese: data.message.segments.map((s: MessageSegment) => s.chinese).join(""),
            pinyin: data.message.segments.map((s: MessageSegment) => s.pinyin).join(" "),
            english: data.message.segments.map((s: MessageSegment) => s.english).join("")
          }
        : { chinese: data.message, pinyin: "", english: data.message };

      // Save to chat history if authenticated
      const { data: authDataSave } = await supabase.auth.getUser();
      if (authDataSave.user) {
        await supabase.from("chat_history").insert([
          {
            user_id: authDataSave.user.id,
            friend_id: friendId,
            scenario_type: scenarioId,
            role: "user",
            content: userMessage.content as string,
          },
          {
            user_id: authDataSave.user.id,
            friend_id: friendId,
            scenario_type: scenarioId,
            role: "assistant",
            content: typeof aiMessage.content === "string" ? aiMessage.content : JSON.stringify(aiMessage.content),
            chinese_text: contentForDb.chinese,
            pinyin_text: contentForDb.pinyin,
            english_text: contentForDb.english,
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      console.error("Error details:", error);
      
      // Remove the user message since sending failed
      setMessages((prev) => prev.slice(0, -1));
      setInput(input); // Restore the user's input
      
      toast({
        title: "Connection Error",
        description: "⚠️ Failed to send message. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <div className="glass border-b border-border/30 p-5 flex items-center gap-4 shadow-soft backdrop-blur-xl">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/home")}
          className="hover:bg-accent/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-pulse-glow">
              <ContextIcon className="w-6 h-6 text-primary animate-float" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <h2 className="font-medium text-base text-foreground">
              {context.title || context.name}
            </h2>
            {context.personality && (
              <p className="text-xs text-muted-foreground capitalize font-light">
                {context.personality}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <ChatBubble 
              key={index} 
              message={message} 
              voiceName={message.role === "assistant" ? friendVoice : undefined}
            />
          ))}
          {loading && (
            <div className="flex justify-start animate-fade-up">
              <Card className="p-4 glass border-none shadow-soft">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-float" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-float" style={{ animationDelay: "300ms" }} />
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-float" style={{ animationDelay: "600ms" }} />
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="glass border-t border-border/30 p-5 backdrop-blur-xl shadow-soft">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 h-12 glass border-none shadow-soft focus:shadow-float transition-all font-light"
          />
          <Button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            size="lg"
            className="h-12 px-6 bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 hover:scale-105 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
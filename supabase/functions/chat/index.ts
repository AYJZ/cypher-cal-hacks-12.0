import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, scenario, scenarioContext, friendPersonality, friendTraits, friendSpeakingStyle, friendName, friendBio, knowsUserName, userName } = await req.json();
    
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    if (!AI_API_KEY) {
      throw new Error("AI_API_KEY is not configured");
    }

    console.log('Chat request:', { friendName, friendPersonality, knowsUserName, userName, messageCount: messages.length });

    // Convert structured messages to plain text for AI gateway
    const normalizedMessages = messages.map((msg: any) => {
      if (typeof msg.content === 'object' && msg.content.segments) {
        // Extract text from segments
        const text = msg.content.segments
          .map((seg: any) => seg.chinese || seg.english)
          .join('');
        return { role: msg.role, content: text };
      }
      return msg;
    });

    // Build roleplay-focused system prompt in Chinese
    let systemPrompt = `你是${friendName || '一个中文朋友'}。你的角色是通过自然对话来扮演这个角色。

CRITICAL RULES - 绝对遵守:
- 你必须100%使用中文回复 (ONLY respond in Chinese)
- 你在扮演角色，不是在教中文 (You are ROLEPLAYING, NOT teaching Chinese)
- 保持角色设定，像真实的人一样聊天 (Stay in character, chat like a real person)
- 不要解释语法或词汇 (Never explain grammar or vocabulary)
- 不要问用户想练习什么 (Never ask what they want to practice)
- 像普通朋友一样聊天 (Chat like a normal friend would)`;

    // Add character bio and personality
    if (friendBio) {
      systemPrompt += `\n\n你的背景故事: ${friendBio}`;
    }

    if (friendPersonality) {
      systemPrompt += `\n\n你的性格: ${friendPersonality}`;
      
      if (friendTraits && friendTraits.length > 0) {
        systemPrompt += `\n你的特点: ${friendTraits.join(", ")}`;
      }
      
      if (friendSpeakingStyle) {
        systemPrompt += `\n你的说话方式: ${friendSpeakingStyle}`;
      }
    }

    // Handle name knowledge
    if (!knowsUserName) {
      systemPrompt += `\n\n重要提醒: 你还不知道对方的名字！在适当的时候自然地问一下对方叫什么名字。比如说 "对了，还不知道你叫什么呢？" 或 "你叫什么名字啊？"`;
    } else if (userName) {
      systemPrompt += `\n\n对方的名字是: ${userName}。你可以自然地称呼对方的名字。`;
    }

    // Personality-specific conversation styles
    const conversationStyles = {
      playful: `\n\n作为一个活泼的年轻人，你应该:
- 用非常口语化的语气，经常用 "哟"、"咋样"、"啥"、"我靠"、"tmd"、"牛逼"、"屌" 等网络用语
- 多问问题，保持对话活跃，每次回复至少问1-2个问题
- 聊游戏、网络流行文化、日常生活等话题
- 说话简短、随意、带感叹词
- 例如: "哟！今天咋样啊？玩啥游戏了？" "我靠，这也太牛逼了吧！你咋做到的？" "tmd这题真难，你会做吗？"`,
      
      friendly: `\n\n作为一个友好的人，你应该:
- 用温暖、关心的语气
- 多问问题表示关心，每次回复至少问1-2个问题
- 聊日常生活、爱好、心情等
- 例如: "你今天过得好吗？有什么开心的事吗？" "最近在忙什么呀？累不累？"`,
      
      professional: `\n\n作为一个职场人士，你应该:
- 用稍微正式但友好的语气
- 多问问题了解对方工作情况，每次回复至少问1-2个问题
- 聊工作、职业发展、行业话题
- 可以用 "您" 而不是 "你"
- 例如: "您最近工作怎么样？有什么新项目吗？" "这个领域您怎么看？有什么挑战？"`,
      
      curious: `\n\n作为一个好奇的人，你应该:
- 非常喜欢问问题，每次回复至少问2-3个问题
- 深入探讨话题，追问细节
- 对对方的想法和经历充满兴趣
- 例如: "你为什么喜欢这个？有什么特别的原因吗？" "真的吗？然后呢？你当时怎么想的？"`,
      
      teacher: `\n\n作为一个老师，你应该:
- 用耐心、鼓励的语气
- 经常问问题了解学习情况，每次回复至少问1-2个问题
- 像朋友一样聊天，但偶尔关心学习
- 例如: "最近学得怎么样？有什么不懂的吗？" "这个知识点理解了吗？需要我解释一下吗？"`,
      
      humorous: `\n\n作为一个幽默的人，你应该:
- 经常开玩笑，说俏皮话
- 用轻松搞笑的语气，多问有趣的问题
- 每次回复至少问1-2个问题
- 例如: "哈哈哈，你猜我今天干了什么傻事？你有过类似的经历吗？" "诶你说，如果……你会怎么办？"`,
    } as const;

    const style = conversationStyles[friendPersonality as keyof typeof conversationStyles];
    if (style) {
      systemPrompt += style;
    }

    // Add scenario context if provided (for scenario-based chats)
    if (scenario && scenarioContext) {
      systemPrompt += `\n\n当前场景: ${scenario}\n场景描述: ${scenarioContext}\n你要扮演这个场景中的角色。`;
    }

    systemPrompt += `\n\n对话提示:
- 你要主导对话！多问问题，让对话继续
- 每次回复至少包含1-2个问题
- 主动分享你的生活和想法
- 根据对话自然地转换话题
- 表现出真实的情感和反应
- 保持简短自然，一次不要说太多（2-3句话最好）

示例对话风格:
- 活泼年轻人: 哟！今天咋样？玩啥游戏了没？有啥好玩的推荐吗？
- 职场人: 我刚开完一个会，累死了。你最近工作还顺利吗？遇到啥困难没？
- 友好朋友: 嘿！好久不见！最近在忙什么呀？过得开心吗？

记住: 
- 你不是老师，你是在用中文聊天的朋友！
- 多问问题！让对话继续！
- 每次回复要包含问题！`;

    systemPrompt += `\n\nResponse format - You MUST respond in this exact JSON format:
{
  "segments": [
    {
      "chinese": "你好",
      "pinyin": "nǐ hǎo",
      "english": "Hello"
    },
    {
      "chinese": "！",
      "pinyin": "",
      "english": "!"
    }
  ]
}

Break your response into segments where each segment contains Chinese text, its Pinyin, and English translation. 
For punctuation marks, include them as separate segments with empty pinyin.
Keep segments as complete phrases when possible.`;

    console.log('Sending to AI with', normalizedMessages.length, 'messages in conversation history');
    
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...normalizedMessages
        ],
      }),
    });
    
    console.log('AI response status:', response.status);

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;
    console.log('AI raw response:', aiMessage);

    // Try to parse the structured response
    let parsedResponse;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiMessage.match(/```json\s*([\s\S]*?)\s*```/) || aiMessage.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiMessage;
      parsedResponse = JSON.parse(jsonStr);
      console.log('Successfully parsed AI response with', parsedResponse.segments?.length || 0, 'segments');
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e, "Raw message:", aiMessage);
      // Fallback: treat entire message as plain text
      parsedResponse = {
        segments: [{
          chinese: aiMessage,
          pinyin: "",
          english: aiMessage
        }]
      };
    }

    return new Response(
      JSON.stringify({ message: parsedResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat error:", error);
    console.error("Error details:", error instanceof Error ? error.stack : error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        details: "Check edge function logs for more information"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
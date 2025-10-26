import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { friendId, friendName, friendPersonality, friendTraits } = await req.json();
    
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!AI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log('Generating notification for friend:', friendName);

    // Define personality-based notification templates
    const notificationPrompts = {
      playful: [
        "作为一个活泼的高中生，你想主动发消息给朋友聊天。可能是分享学校发生的趣事，或者问对方要不要一起玩游戏。",
        "你刚考完试，想跟朋友分享一下，或者抱怨一下考试有多难。",
        "你发现了一个很酷的东西（游戏、视频、音乐等），迫不及待想分享给朋友。"
      ],
      professional: [
        "作为一个职场人士，你想问朋友一个问题，可能是关于工作或者某个专业话题。",
        "你今天工作遇到了有趣的事情，想跟朋友分享一下。",
        "你想约朋友周末见面喝咖啡聊聊天。"
      ],
      friendly: [
        "你想主动问候朋友，关心一下对方最近怎么样。",
        "你刚看到或经历了什么有趣的事，想跟朋友分享。",
        "你在想念朋友，想发个消息看看对方在做什么。"
      ],
      curious: [
        "你突然想到一个有趣的问题，想问问朋友的看法。",
        "你对朋友的某件事很好奇，想主动问一下。",
        "你想跟朋友深入讨论某个话题。"
      ],
      teacher: [
        "你想关心一下学生最近的学习情况。",
        "你有一个有趣的知识想分享给学生。",
        "你想鼓励学生，发个温暖的消息。"
      ],
      humorous: [
        "你想到了一个好笑的事情，迫不及待想告诉朋友。",
        "你想开个玩笑，逗朋友开心。",
        "你遇到了什么搞笑的事，想分享给朋友。"
      ]
    } as const;

    const prompts = notificationPrompts[friendPersonality as keyof typeof notificationPrompts] || notificationPrompts.friendly;
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    const systemPrompt = `你是${friendName}，${friendPersonality === 'playful' ? '一个活泼的高中生' : friendPersonality === 'professional' ? '一个职场人士' : friendPersonality === 'friendly' ? '一个友好的朋友' : '一个好奇的人'}。

${randomPrompt}

要求:
- 只用中文
- 保持简短，1-2句话
- 要自然，像真实朋友发的消息
- 不要解释或教学
- 根据你的性格说话
${friendTraits ? `\n你的特点: ${friendTraits.join(", ")}` : ''}

直接生成消息内容，不要加任何解释。`;

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
          { role: "user", content: "生成消息" }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices[0].message.content.trim();
    
    console.log('Generated notification:', message);

    // Get all users to send notifications to (you can modify this logic)
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error listing users:', usersError);
      return new Response(
        JSON.stringify({ error: "Failed to get users" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert notification for each user
    const notifications = users.users.map(user => ({
      user_id: user.id,
      friend_id: friendId,
      message: message,
      is_read: false
    }));

    const { error: insertError } = await supabase
      .from('notifications')
      .insert(notifications);

    if (insertError) {
      console.error('Error inserting notifications:', insertError);
      throw insertError;
    }

    console.log(`Created ${notifications.length} notifications`);

    return new Response(
      JSON.stringify({ success: true, message, count: notifications.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Notification generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
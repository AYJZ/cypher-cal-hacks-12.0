-- Run this SQL in your Supabase SQL Editor to update AI friends
-- Go to: Supabase Dashboard > SQL Editor > New Query

-- First, delete existing AI friends to avoid duplicates
DELETE FROM public.ai_friends;

-- Insert all 5 AI friends with correct IDs and data
INSERT INTO public.ai_friends (id, name, personality, avatar_emoji, description) VALUES
  ('1', '小美 (Xiaomei)', 'friendly', '😊', 'Your cheerful language partner who loves to chat'),
  ('2', '李明 (Li Ming)', 'professional', '👨‍💼', 'A business professional who helps with formal Chinese'),
  ('3', '阿辉 (Ahui)', 'humorous', '😄', 'The jokester who makes learning fun with humor'),
  ('4', '王老师 (Teacher Wang)', 'teacher', '👩‍🏫', 'A patient teacher who explains everything clearly'),
  ('5', '大卫 (David)', 'curious', '🤔', 'An inquisitive friend who asks great questions and loves learning');

-- Verify the update
SELECT * FROM public.ai_friends ORDER BY id;

-- Delete existing AI friends to start fresh
DELETE FROM public.ai_friends;

-- Insert all 5 AI friends with correct data matching our local definitions
INSERT INTO public.ai_friends (id, name, personality, avatar_emoji, description) VALUES
  ('1', '小美 (Xiaomei)', 'friendly', '😊', 'Your cheerful language partner who loves to chat'),
  ('2', '李明 (Li Ming)', 'professional', '👨‍💼', 'A business professional who helps with formal Chinese'),
  ('3', '阿辉 (Ahui)', 'humorous', '😄', 'The jokester who makes learning fun with humor'),
  ('4', '王老师 (Teacher Wang)', 'teacher', '👩‍🏫', 'A patient teacher who explains everything clearly'),
  ('5', '大卫 (David)', 'curious', '🤔', 'An inquisitive friend who asks great questions and loves learning');

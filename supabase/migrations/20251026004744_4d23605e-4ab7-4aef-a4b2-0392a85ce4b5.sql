-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  purpose TEXT CHECK (purpose IN ('travel', 'professional', 'social', 'study')),
  current_level TEXT DEFAULT 'beginner',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create AI friends table
CREATE TABLE public.ai_friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  personality TEXT NOT NULL,
  avatar_emoji TEXT DEFAULT '😊',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ai_friends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view AI friends"
  ON public.ai_friends FOR SELECT
  USING (true);

-- Insert default AI friends
INSERT INTO public.ai_friends (name, personality, avatar_emoji, description) VALUES
  ('小明 (Xiaoming)', 'playful', '🎮', 'A fun-loving college student who loves gaming and casual chat'),
  ('雅雯 (Yawen)', 'professional', '💼', 'A businesswoman who enjoys formal conversations and cultural exchange'),
  ('大卫 (David)', 'curious', '🤔', 'An inquisitive friend who asks great questions and loves learning');

-- Create chat history table
CREATE TABLE public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  friend_id UUID REFERENCES public.ai_friends(id),
  scenario_type TEXT,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  chinese_text TEXT,
  english_text TEXT,
  pinyin_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat history"
  ON public.chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
  ON public.chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create scenarios table
CREATE TABLE public.scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT,
  icon_emoji TEXT DEFAULT '💬',
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view scenarios"
  ON public.scenarios FOR SELECT
  USING (true);

-- Insert default scenarios
INSERT INTO public.scenarios (title, description, difficulty, category, icon_emoji, context) VALUES
  ('Ordering Bubble Tea', 'Learn to order your favorite drink at a bubble tea shop', 'beginner', 'food', '🧋', 'You are at a popular bubble tea shop in Taiwan'),
  ('Asking for Directions', 'Navigate the streets by asking locals for help', 'beginner', 'travel', '🗺️', 'You need to find your way to a famous tourist spot'),
  ('Meeting New Friends', 'Introduce yourself and make small talk', 'beginner', 'social', '👋', 'You are at a social gathering with Chinese-speaking friends'),
  ('Business Meeting', 'Engage in professional conversation and etiquette', 'intermediate', 'professional', '💼', 'You are attending a formal business meeting');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
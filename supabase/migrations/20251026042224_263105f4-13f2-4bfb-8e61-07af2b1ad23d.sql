-- Add native language and target language columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS native_language text,
ADD COLUMN IF NOT EXISTS target_language text;
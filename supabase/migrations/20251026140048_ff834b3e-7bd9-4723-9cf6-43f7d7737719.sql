-- Create notifications table for AI friend messages
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  friend_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Create conversation_state table to track conversation metadata like whether AI knows user's name
CREATE TABLE IF NOT EXISTS public.conversation_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  friend_id UUID NOT NULL,
  knows_user_name BOOLEAN NOT NULL DEFAULT false,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Enable RLS on conversation_state
ALTER TABLE public.conversation_state ENABLE ROW LEVEL SECURITY;

-- Users can view their own conversation states
CREATE POLICY "Users can view their own conversation state"
ON public.conversation_state
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own conversation states
CREATE POLICY "Users can insert their own conversation state"
ON public.conversation_state
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own conversation states
CREATE POLICY "Users can update their own conversation state"
ON public.conversation_state
FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger to update updated_at on conversation_state
CREATE TRIGGER update_conversation_state_updated_at
BEFORE UPDATE ON public.conversation_state
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- DuoMingo application data. Neon Auth owns the separate neon_auth schema.
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id text PRIMARY KEY,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id text PRIMARY KEY,
  xp integer NOT NULL DEFAULT 0 CHECK (xp >= 0),
  completed_lessons jsonb NOT NULL DEFAULT '[]'::jsonb,
  learned_phrases jsonb NOT NULL DEFAULT '[]'::jsonb,
  streak_days integer NOT NULL DEFAULT 0 CHECK (streak_days >= 0),
  last_active_date date,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_progress_updated_at_idx
  ON public.user_progress(updated_at DESC);

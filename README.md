# 🦩 DuoMingo

**Languages for the thoroughly fed up.**

A humour-led, multilingual language-learning PWA for useful everyday phrases, sarcasm, swearing and cultural context. Built with React + Vite, deployed on Vercel, powered by Neon Postgres and Neon Managed Auth.

## Features
- French, British English, Spanish and German starter courses
- Pronunciation guides, literal translations, natural meanings and context notes
- Quiz, XP, lesson completion and phrasebook
- Optional email/password accounts with Neon Managed Auth
- Cloud progress sync through an authenticated Vercel API and Neon Postgres
- Local progress remains available without an account
- Installable PWA with offline shell caching and automatic service-worker updates

## Local setup
1. Copy .env.example to .env.local.
2. Fill in the Neon values from the project settings. Never commit .env.local.
3. Run npm install and npm run dev.

Required variables:
- DATABASE_URL: Neon pooled connection string, server only
- NEON_AUTH_JWKS_URL: Neon Auth JWKS endpoint, server only
- VITE_NEON_AUTH_URL: public Neon Auth endpoint

## Database
The API uses public.user_progress with user_id, xp, completed_lessons, learned_phrases and updated_at. The table is provisioned in the DuoMingo Neon project.

## Deploy
Vercel project: duomingo. Build command: npm run build. Output directory: dist. Set the three environment variables for Production, Preview and Development.

The GitHub Pages workflow remains available as a fallback build. It sets GITHUB_PAGES=true to retain the /DuoMingo/ asset base.

## Language content note
Regional slang and profanity vary. Phrases should be labelled by register and context. Invented insults are marked as invented rather than presented as established idioms. BSL is a distinct language with its own grammar and regional variation; its course will be authored from verified learning materials rather than guessed signs.

Made with questionable intent. 🦩

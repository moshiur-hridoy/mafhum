# মাফহুম — Quran learning webapp

মাফহুম একটি নতুন, web-first Quran vocabulary learning product। লক্ষ্য: Duolingo-এর মতো short lesson, visible progress এবং rewarding practice loop দিয়ে কুরআনের high-frequency Arabic শব্দ শেখানো।

এই project পুরনো `learning-quran` repository থেকে আলাদা এবং নিজস্ব Git repository হিসেবে শুরু হয়েছে। UI-তে familiar learning-product patterns ব্যবহার করা হয়েছে—clear path, XP, streak, hearts, daily goal—কিন্তু visual language নিজস্ব রাখা হয়েছে।

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

তারপর `http://localhost:3000` খুলুন। Supabase keys না দিলেও local prototype চলবে; progress আপাতত Redux + LocalStorage-এ থাকবে।

## Supabase setup

1. Supabase-এ নতুন project তৈরি করুন।
2. `.env.local`-এ `VITE_SUPABASE_URL` এবং `VITE_SUPABASE_ANON_KEY` বসান।
3. Supabase SQL Editor-এ [`supabase/schema.sql`](supabase/schema.sql) রান করুন।
4. পরের ধাপে auth ও progress sync client-এ connect করা হবে।

## Product foundation

- React + TypeScript + Vite
- Redux Toolkit for learning state
- Supabase client and RLS-ready schema
- Local-first progress fallback
- Responsive premium dashboard
- Lesson path, XP, streak, hearts, daily goal
- Arabic typography and Bengali-first copy

## Next build slices

1. Supabase Auth এবং cross-device progress sync
2. Full ১২৫-word canonical curriculum import
3. Review queue এবং spaced repetition
4. Multiple exercise types, audio এবং verse context
5. Achievements, leaderboard এবং analytics

import { supabase } from './supabase';
import type { ProgressState } from '../store';

export async function syncProgress(progress: ProgressState) {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('user_progress').upsert({
    user_id: user.id,
    xp: progress.xp,
    streak: progress.streak,
    hearts: progress.hearts,
    completed_lessons: progress.completedLessons,
    daily_answers: progress.dailyAnswers,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
}

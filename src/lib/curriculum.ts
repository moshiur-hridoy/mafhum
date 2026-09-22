import { lessons as localLessons } from '../data/course';
import { supabase } from './supabase';
import type { Lesson, Word } from '../types';

export async function loadLessons(): Promise<Lesson[]> {
  if (!supabase) return localLessons;
  const [{ data: lessonRows, error: lessonError }, { data: linkRows, error: linkError }, { data: wordRows, error: wordError }] = await Promise.all([
    supabase.from('lessons').select('id, number, title, subtitle').order('number'),
    supabase.from('lesson_words').select('lesson_id, word_id, position').order('position'),
    supabase.from('words').select('id, arabic, transliteration, meaning, bengali_meaning').order('id'),
  ]);
  if (lessonError || linkError || wordError || !lessonRows?.length || !wordRows?.length) return localLessons;

  const words = new Map(wordRows.map((word) => [word.id, {
    id: word.id,
    arabic: word.arabic,
    transliteration: word.transliteration,
    meaning: word.meaning,
    bengaliMeaning: word.bengali_meaning,
  } satisfies Word]));
  const links = new Map<string, { word_id: string; position: number }[]>();
  linkRows?.forEach((link) => links.set(link.lesson_id, [...(links.get(link.lesson_id) || []), link]));
  return lessonRows.map((lesson) => ({
    id: lesson.id,
    number: lesson.number,
    title: lesson.title,
    subtitle: lesson.subtitle,
    status: lesson.number === 1 ? 'current' : 'locked',
    words: (links.get(lesson.id) || []).sort((a, b) => a.position - b.position).map((link) => words.get(link.word_id)).filter((word): word is Word => Boolean(word)),
  }));
}

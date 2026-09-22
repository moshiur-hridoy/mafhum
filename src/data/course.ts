import type { Lesson } from '../types';
import rawCourse from './course.json';

const splitMeaning = (value: string) => {
  const match = value.match(/^(.*?)\s*\((.*)\)$/);
  return { meaning: match?.[1] || value, bengaliMeaning: match?.[2] || value };
};

export const lessons: Lesson[] = rawCourse.lessons.map((lesson) => ({
  id: `foundations-${String(lesson.id).padStart(2, '0')}`,
  number: lesson.id,
  title: lesson.title,
  subtitle: lesson.day,
  status: lesson.id === 1 ? 'current' : 'locked',
  words: lesson.words.map((word) => ({
    id: `word-${word.id}`,
    arabic: word.arabic,
    transliteration: word.spelling,
    ...splitMeaning(word.correct_meaning),
  })),
}));

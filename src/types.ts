export interface Word {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  bengaliMeaning: string;
  example?: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  status: 'completed' | 'current' | 'locked';
  words: Word[];
}

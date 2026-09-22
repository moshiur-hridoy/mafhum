import type { Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    id: 'foundations-01', number: 1, title: 'শুরু করি', subtitle: 'কুরআনের পরিচিত শব্দ', status: 'current',
    words: [
      { id: 'word-1', arabic: 'اللَّه', transliteration: 'Allah', meaning: 'God', bengaliMeaning: 'আল্লাহ' },
      { id: 'word-2', arabic: 'رَبّ', transliteration: 'Rabb', meaning: 'Lord', bengaliMeaning: 'প্রভু' },
      { id: 'word-3', arabic: 'رَحْمَة', transliteration: 'Rahmah', meaning: 'Mercy', bengaliMeaning: 'রহমত' },
      { id: 'word-4', arabic: 'كِتَاب', transliteration: 'Kitaab', meaning: 'Book', bengaliMeaning: 'কিতাব' },
      { id: 'word-5', arabic: 'نَاس', transliteration: 'Naas', meaning: 'People', bengaliMeaning: 'মানুষ' },
    ],
  },
  { id: 'foundations-02', number: 2, title: 'সম্পর্ক', subtitle: 'আল্লাহ ও বান্দা', status: 'locked', words: [] },
  { id: 'foundations-03', number: 3, title: 'দিকনির্দেশনা', subtitle: 'সঠিক পথের শব্দ', status: 'locked', words: [] },
  { id: 'foundations-04', number: 4, title: 'বিশ্বাস', subtitle: 'ঈমানের ভিত্তি', status: 'locked', words: [] },
  { id: 'foundations-05', number: 5, title: 'জীবন', subtitle: 'দুনিয়া ও আখিরাত', status: 'locked', words: [] },
];

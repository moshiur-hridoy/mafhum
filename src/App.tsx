import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Flame, Heart, Lock, Sparkles, Trophy, Zap } from 'lucide-react';
import { useAppDispatch, useAppSelector } from './hooks';
import { answerQuestion, completeLesson, restoreHearts } from './store';
import { lessons as localLessons } from './data/course';
import { loadLessons } from './lib/curriculum';
import type { Lesson } from './types';

type View = 'home' | 'practice' | 'complete';
type Feedback = { correct: boolean; answer: string } | null;

const lessonDescription = (lesson: Lesson) => lesson.number === 1
  ? 'কুরআনের সবচেয়ে পরিচিত শব্দ দিয়ে আপনার শেখার যাত্রা শুরু করুন।'
  : 'আজকের পাঁচটি শব্দকে বিভিন্নভাবে practice করে মনে রাখুন।';

function StreakCard({ streak }: { streak: number }) {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return <section className="streak-card">
    <div className="streak-head"><div><span className="overline">চলতি streak</span><strong>{streak}<Zap size={24} fill="currentColor" /></strong></div><div className="streak-energy"><span><Zap size={13} fill="currentColor" /></span><span><Zap size={13} fill="currentColor" /></span></div></div>
    <div className="week-row">{days.map((day, index) => <div key={`${day}-${index}`} className={`week-day ${index === 0 ? 'today' : ''}`}><span>{index === 0 ? <Zap size={15} fill="currentColor" /> : <Zap size={14} />}</span><small>{day}</small></div>)}</div>
  </section>;
}

function LessonOverview({ lesson }: { lesson: Lesson }) {
  return <section className="lesson-overview">
    <div className="lesson-visual"><div className="visual-glow" /><BookOpen size={60} strokeWidth={1.4} /><span className="visual-sparkle sparkle-one">✦</span><span className="visual-sparkle sparkle-two">✦</span></div>
    <div className="lesson-copy"><span className="overline">Lesson {String(lesson.number).padStart(2, '0')}</span><h1>{lesson.title}</h1><p>{lessonDescription(lesson)}</p></div>
  </section>;
}

function LessonPath({ lessons, selectedId, completedIds, onSelect, onStart }: { lessons: Lesson[]; selectedId: string; completedIds: string[]; onSelect: (lesson: Lesson, status: Lesson['status']) => void; onStart: (lesson: Lesson) => void }) {
  const completed = new Set(completedIds);
  return <section className="path-panel"><div className="path-heading"><div><span className="overline">Basic course</span><h2>কুরআনের ১২৫টি শব্দ</h2></div><span className="path-count">{completedIds.length} / 25</span></div><div className="path-list">{lessons.map((lesson, index) => { const status: Lesson['status'] = completed.has(lesson.id) ? 'completed' : index === 0 || completed.has(lessons[index - 1].id) ? 'current' : 'locked'; return <div key={lesson.id} className={`path-item ${status} ${selectedId === lesson.id ? 'selected' : ''}`} aria-disabled={status === 'locked'} onClick={() => status !== 'locked' && onSelect({ ...lesson, status }, status)}><span className="path-node">{status === 'completed' ? <Check size={16} /> : status === 'locked' ? <Lock size={14} /> : lesson.number}</span><span className="path-copy"><small>LESSON {String(lesson.number).padStart(2, '0')} · {lesson.words.length} শব্দ</small><strong>{lesson.title}</strong><em>{lesson.subtitle}</em></span>{status === 'current' && <button type="button" className="path-start" onClick={(event) => { event.stopPropagation(); onStart({ ...lesson, status }); }}>শুরু করুন <ArrowRight size={15} /></button>}<ChevronRight size={17} className="path-arrow" /></div>; })}</div></section>;
}

function Practice({ lesson, wordIndex, selected, onAnswer, onContinue, onExit }: { lesson: Lesson; wordIndex: number; selected: Feedback; onAnswer: (answer: string) => void; onContinue: () => void; onExit: () => void }) {
  const word = lesson.words[wordIndex];
  const options = useMemo(() => [word.bengaliMeaning, ...lesson.words.filter((item) => item.id !== word.id).slice(0, 2).map((item) => item.bengaliMeaning)].sort(() => Math.random() - 0.5), [lesson, word]);
  return <section className="practice-screen"><button className="back-link" onClick={onExit}><ArrowLeft size={16} /> শেখার পথে ফিরুন</button><div className="practice-heading"><div><span className="overline">{lesson.title}</span><h1>শব্দটির অর্থ কী?</h1></div><strong>{wordIndex + 1} / {lesson.words.length}</strong></div><div className="practice-progress"><span style={{ width: `${(wordIndex / lesson.words.length) * 100}%` }} /></div><div className="practice-card"><span className="exercise-pill">অর্থ মিলান</span><div className="practice-word"><strong>{word.arabic}</strong><span>{word.transliteration}</span></div><div className="answer-grid">{options.map((option) => <button key={option} className={selected ? option === word.bengaliMeaning ? 'correct' : option === selected.answer ? 'wrong' : '' : ''} disabled={Boolean(selected)} onClick={() => onAnswer(option)}>{option}</button>)}</div>{selected && <div className={`answer-feedback ${selected.correct ? 'success' : 'error'}`}>{selected.correct ? 'সঠিক উত্তর! +10 XP' : `সঠিক উত্তর: ${word.bengaliMeaning}`}</div>}<button className="primary-button continue-button" hidden={!selected} onClick={onContinue}>পরের শব্দ <ArrowRight size={17} /></button></div></section>;
}

function Complete({ correct, total, streak, onBack }: { correct: number; total: number; streak: number; onBack: () => void }) {
  return <section className="complete-screen"><div className="complete-card"><div className="complete-icon"><Trophy size={32} /></div><span className="overline">Lesson complete</span><h1>মাশাআল্লাহ! দারুণ করেছেন।</h1><p>আজকের পাঁচটি শব্দ আপনার শেখার পথে যোগ হয়েছে।</p><div className="result-grid"><div><strong>{correct}/{total}</strong><small>সঠিক</small></div><div><strong>+{correct * 10 + 25}</strong><small>XP earned</small></div><div><strong>{streak}</strong><small>দিন streak</small></div></div><button className="primary-button" onClick={onBack}>শেখার পথে ফিরুন <ArrowRight size={17} /></button></div></section>;
}

export default function App() {
  const dispatch = useAppDispatch();
  const progress = useAppSelector((state) => state.progress);
  const [lessons, setLessons] = useState(localLessons);
  const [selectedLessonId, setSelectedLessonId] = useState(localLessons[0].id);
  const [view, setView] = useState<View>('home');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Feedback>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => { loadLessons().then((loaded) => { setLessons(loaded); setSelectedLessonId((current) => loaded.some((lesson) => lesson.id === current) ? current : loaded[0].id); }); }, []);

  const completed = new Set(progress.completedLessons);
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) || lessons[0];

  const startLesson = (lesson: Lesson) => {
    if (!lesson.words.length || lesson.status === 'locked') return;
    setActiveLesson(lesson); setWordIndex(0); setSelectedAnswer(null); setCorrectAnswers(0); setView('practice'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const chooseAnswer = (answer: string) => { if (selectedAnswer || !activeLesson) return; const correct = answer === activeLesson.words[wordIndex].bengaliMeaning; setSelectedAnswer({ correct, answer }); setCorrectAnswers((value) => value + (correct ? 1 : 0)); dispatch(answerQuestion({ correct })); };
  const continuePractice = () => { if (!activeLesson) return; if (wordIndex === activeLesson.words.length - 1) { dispatch(completeLesson(activeLesson.id)); setSelectedLessonId(activeLesson.id); setView('complete'); } else { setWordIndex((value) => value + 1); setSelectedAnswer(null); } };
  const backToHome = () => { const next = lessons.find((lesson, index) => !completed.has(lesson.id) && (index === 0 || completed.has(lessons[index - 1].id))); if (next) setSelectedLessonId(next.id); setView('home'); };

  return <div className="app-frame"><header className="topbar"><div className="topbar-inner"><div className="logo-lockup"><div className="logo-mark">م</div><div><strong>মাফহুম</strong><span>Quran, made clear.</span></div></div><div className="top-course"><span>Basic</span><small>Foundation course</small></div><div className="header-stats"><span className="stat-streak"><Flame size={17} fill="currentColor" /> {progress.streak}</span><span className="stat-xp"><Sparkles size={17} fill="currentColor" /> {progress.xp} XP</span><span className="stat-hearts"><Heart size={17} fill="currentColor" /> {progress.hearts}</span></div></div></header><main className="page-wrap">{view === 'home' && <div className="dashboard-grid"><div className="left-column"><StreakCard streak={progress.streak} /><LessonOverview lesson={selectedLesson} /></div><LessonPath lessons={lessons} selectedId={selectedLesson.id} completedIds={progress.completedLessons} onSelect={(lesson) => { setSelectedLessonId(lesson.id); }} onStart={startLesson} /></div>}{view === 'practice' && activeLesson && <Practice lesson={activeLesson} wordIndex={wordIndex} selected={selectedAnswer} onAnswer={chooseAnswer} onContinue={continuePractice} onExit={backToHome} />}{view === 'complete' && <Complete correct={correctAnswers} total={activeLesson?.words.length || 5} streak={progress.streak} onBack={backToHome} />}</main>{progress.hearts === 0 && <button className="hearts-empty" onClick={() => dispatch(restoreHearts())}><Heart size={16} /> হার্ট আবার পূরণ করুন</button>}</div>;
}

import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronRight, Flame, Heart, Lock, Menu, Play, Sparkles, Trophy, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from './hooks';
import { answerQuestion, completeLesson, restoreHearts } from './store';
import { lessons as localLessons } from './data/course';
import { loadLessons } from './lib/curriculum';
import type { Lesson } from './types';

type View = 'home' | 'practice' | 'complete';

function App() {
  const dispatch = useAppDispatch();
  const progress = useAppSelector((state) => state.progress);
  const [courseLessons, setCourseLessons] = useState(localLessons);
  const [view, setView] = useState<View>('home');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { loadLessons().then(setCourseLessons); }, []);

  const lessons = courseLessons;

  const currentWord = activeLesson?.words[wordIndex];
  const options = useMemo(() => {
    if (!activeLesson || !currentWord) return [];
    return [currentWord.bengaliMeaning, ...activeLesson.words.filter((word) => word.id !== currentWord.id).slice(0, 2).map((word) => word.bengaliMeaning)].sort(() => Math.random() - 0.5);
  }, [activeLesson, currentWord]);

  const startLesson = (lesson: Lesson) => {
    if (lesson.status === 'locked' || !lesson.words.length) return;
    setActiveLesson(lesson); setWordIndex(0); setSelected(null); setCorrectAnswers(0); setView('practice'); setMenuOpen(false);
  };

  const chooseAnswer = (answer: string) => {
    if (selected || !currentWord) return;
    const correct = answer === currentWord.bengaliMeaning;
    setSelected(answer); setCorrectAnswers((value) => value + (correct ? 1 : 0)); dispatch(answerQuestion({ correct }));
  };

  const continuePractice = () => {
    if (!activeLesson) return;
    if (wordIndex === activeLesson.words.length - 1) { dispatch(completeLesson(activeLesson.id)); setView('complete'); }
    else { setWordIndex((value) => value + 1); setSelected(null); }
  };

  const completed = new Set(progress.completedLessons);
  const getStatus = (lesson: Lesson, index: number): Lesson['status'] => completed.has(lesson.id) ? 'completed' : index === 0 || completed.has(lessons[index - 1].id) ? 'current' : 'locked';

  return <div className="app-frame">
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={20} /></button>
      <div className="logo-lockup"><div className="logo-mark">م</div><div><strong>মাফহুম</strong><span>Quran, made clear.</span></div></div>
      <nav className="side-nav"><button className={view === 'home' ? 'active' : ''} onClick={() => { setView('home'); setMenuOpen(false); }}><BookOpen size={19} /> শেখার পথ</button><button onClick={() => setView('home')}><Sparkles size={19} /> রিভিউ</button><button onClick={() => setView('home')}><Trophy size={19} /> অর্জন</button></nav>
      <div className="side-tip"><Sparkles size={19} /><strong>আজ একটু শিখুন</strong><p>প্রতিদিন ৫টি শব্দ। ছোট অভ্যাসেই বড় বোঝাপড়া।</p></div>
      <div className="side-footer"><span className="avatar">M</span><div><strong>আপনার যাত্রা</strong><small>Foundation course</small></div><ChevronRight size={16} /></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={22} /></button><div className="mobile-brand"><div className="logo-mark">م</div><strong>মাফহুম</strong></div><div className="topbar-spacer" /><div className="header-stats"><span><Flame size={17} fill="currentColor" /> {progress.streak}</span><span><Sparkles size={17} fill="currentColor" /> {progress.xp} XP</span><span><Heart size={17} fill="currentColor" /> {progress.hearts}</span></div></header>

      <div className="page-wrap">
        {view === 'home' && <>
          <section className="welcome-row"><div><p className="kicker">আসসালামু আলাইকুম 👋</p><h1>আজ কুরআনের ভাষায়<br /><em>আরও একটু এগিয়ে যান।</em></h1><p className="lead">প্রতিদিনের ছোট lesson-এ কুরআনের সবচেয়ে ব্যবহৃত শব্দগুলো মনে রাখুন—সহজে, আনন্দে।</p><button className="primary-button" onClick={() => { const next = lessons.find((lesson, index) => getStatus(lesson, index) === 'current'); if (next) startLesson(next); }}>আজকের lesson <Play size={17} fill="currentColor" /></button></div><div className="welcome-art"><div className="art-glow" /><div className="crescent">☾</div><span className="art-star star-a">✦</span><span className="art-star star-b">✦</span><div className="arch-shape"><span>اقْرَأْ</span></div></div></section>
          <section className="summary-grid"><div className="summary-card progress-summary"><div className="summary-icon purple"><BookOpen size={20} /></div><div><span>কোর্স অগ্রগতি</span><strong>{progress.completedLessons.length} <small>/ 25 lesson</small></strong></div><div className="mini-progress"><span style={{ width: `${(progress.completedLessons.length / 25) * 100}%` }} /></div></div><div className="summary-card"><div className="summary-icon orange"><Flame size={20} /></div><div><span>চলতি streak</span><strong>{progress.streak} <small>দিন</small></strong></div><p>ধরে রাখুন!</p></div><div className="summary-card"><div className="summary-icon yellow"><Trophy size={20} /></div><div><span>মোট XP</span><strong>{progress.xp}</strong></div><p>দারুণ শুরু ✨</p></div></section>
          <div className="section-head"><div><p className="kicker">আপনার course</p><h2>শেখার পথ</h2></div><span className="course-count">১২৫টি শব্দ · ২৫ lesson</span></div>
          <section className="course-card"><div className="course-header"><div className="course-badge">01</div><div><p className="kicker">Foundation course</p><h3>কুরআনের প্রয়োজনীয় শব্দ</h3><span>শুরু থেকে ধীরে ধীরে fluency</span></div><div className="course-percent">{Math.round((progress.completedLessons.length / 25) * 100)}%</div></div><div className="course-line" /> <div className="lesson-path">{lessons.map((lesson, index) => { const status = getStatus(lesson, index); return <button key={lesson.id} className={`lesson-node ${status}`} disabled={status === 'locked'} onClick={() => startLesson({ ...lesson, status })}><span className="node-number">{status === 'completed' ? '✓' : status === 'locked' ? <Lock size={15} /> : lesson.number}</span><strong>{lesson.title}</strong><small>{lesson.subtitle}</small>{status === 'current' && <span className="start-label">শুরু করুন <ChevronRight size={13} /></span>}</button>; })}</div></section>
          <section className="bottom-grid"><div className="daily-card"><div className="daily-top"><div><p className="kicker">আজকের লক্ষ্য</p><h3>৫টি উত্তর দিন</h3></div><span className="goal-number">{Math.min(5, progress.dailyAnswers)}<small>/5</small></span></div><div className="goal-track"><span style={{ width: `${Math.min(100, progress.dailyAnswers * 20)}%` }} /></div><p>আরও একটু practice করলেই আজকের goal complete হবে।</p></div><div className="quote-card"><Sparkles size={20} /><p>“যে ব্যক্তি কুরআন শেখে এবং শেখায়, সে-ই উত্তম।”</p><small>— সহীহ বুখারী</small></div></section>
        </>}

        {view === 'practice' && activeLesson && currentWord && <section className="practice-screen"><button className="back-link" onClick={() => setView('home')}>← শেখার পথে ফিরুন</button><div className="practice-meta"><span>{activeLesson.title}</span><strong>{wordIndex + 1} / {activeLesson.words.length}</strong></div><div className="practice-track"><span style={{ width: `${(wordIndex / activeLesson.words.length) * 100}%` }} /></div><div className="practice-card"><span className="exercise-label">অর্থ মিলান</span><h1>এই শব্দটির অর্থ কী?</h1><div className="word-display"><strong>{currentWord.arabic}</strong><span>{currentWord.transliteration}</span></div><div className="answer-grid">{options.map((option) => <button key={option} className={selected ? option === currentWord.bengaliMeaning ? 'correct' : option === selected ? 'wrong' : '' : ''} disabled={Boolean(selected)} onClick={() => chooseAnswer(option)}>{option}</button>)}</div>{selected && <div className={`answer-feedback ${selected === currentWord.bengaliMeaning ? 'success' : 'error'}`}>{selected === currentWord.bengaliMeaning ? 'সঠিক উত্তর! +10 XP ✨' : `সঠিক উত্তর: ${currentWord.bengaliMeaning}`}</div>}<button className="primary-button continue-button" hidden={!selected} onClick={continuePractice}>পরেরটি <ChevronRight size={17} /></button></div></section>}

        {view === 'complete' && <section className="complete-screen"><div className="complete-card"><div className="complete-orb"><Sparkles size={32} /></div><p className="kicker">Lesson complete</p><h1>মাশাআল্লাহ! দারুণ করেছেন।</h1><p>আজকের lesson আপনার শেখার পথে যোগ হয়েছে।</p><div className="result-row"><div><strong>{correctAnswers}/{activeLesson?.words.length}</strong><span>সঠিক</span></div><div><strong>+{correctAnswers * 10 + 25}</strong><span>XP earned</span></div><div><strong>{progress.streak}</strong><span>দিন streak</span></div></div><button className="primary-button" onClick={() => setView('home')}>শেখার পথে ফিরুন <ChevronRight size={17} /></button></div></section>}
      </div>
    </main>
    {progress.hearts === 0 && <button className="hearts-empty" onClick={() => dispatch(restoreHearts())}><Heart size={17} /> হার্ট শেষ — আবার পূরণ করুন</button>}
  </div>;
}

export default App;

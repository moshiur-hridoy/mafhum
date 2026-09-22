import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { syncProgress } from './lib/progressSync';

export interface ProgressState {
  xp: number;
  streak: number;
  hearts: number;
  completedLessons: string[];
  dailyAnswers: number;
}

const saved = JSON.parse(localStorage.getItem('mafhum-progress') || 'null') as Partial<ProgressState> | null;
const initialState: ProgressState = {
  xp: saved?.xp ?? 0,
  streak: saved?.streak ?? 1,
  hearts: saved?.hearts ?? 5,
  completedLessons: saved?.completedLessons ?? [],
  dailyAnswers: saved?.dailyAnswers ?? 0,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    answerQuestion(state, action: PayloadAction<{ correct: boolean }>) {
      state.dailyAnswers += 1;
      if (action.payload.correct) state.xp += 10;
      else state.hearts = Math.max(0, state.hearts - 1);
    },
    completeLesson(state, action: PayloadAction<string>) {
      if (!state.completedLessons.includes(action.payload)) {
        state.completedLessons.push(action.payload);
        state.xp += 25;
      }
    },
    restoreHearts(state) { state.hearts = 5; },
  },
});

export const { answerQuestion, completeLesson, restoreHearts } = progressSlice.actions;
export const store = configureStore({ reducer: { progress: progressSlice.reducer } });
store.subscribe(() => {
  const progress = store.getState().progress;
  localStorage.setItem('mafhum-progress', JSON.stringify(progress));
  void syncProgress(progress);
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

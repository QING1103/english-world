
export enum View {
  MAP = 'map',
  WORD_DETAIL = 'word_detail',
  CHALLENGE = 'challenge',
  WORD_BOOK = 'word_book',
  LEADERBOARD = 'leaderboard',
  PROFILE = 'profile',
  LETTER_GAME = 'letter_game',
  SETTINGS = 'settings'
}

export interface Word {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  grammar: string;
  grammarTags: string[];
  sentenceEn: string;
  sentenceCn: string;
  sceneCn: string;
  imageUrl: string;
  mnemonic?: string;
  level: string;
  progress: number;
  status: 'new' | 'learning' | 'mastered';
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpMax: number;
  stars: number;
  achievements: number;
  learnedWords: number;
  rank: number;
}

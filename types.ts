
export interface Lesson {
  id: string;
  title: string;
  videoId: string;
}

export interface Level {
  id: string;
  level: number;
  title: string;
  lessons: Lesson[];
  badge: {
      name: string;
      icon: string;
  };
}

export interface Topic {
  id: string;
  title: string;
  levels: Level[];
  epicBadge: {
      name: string;
      icon: string;
  };
}

export interface Theme {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  certificate: {
      name: string;
      icon: string;
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface UserProgress {
  [lessonId: string]: 'completed';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'totalLessons' | 'dailyLessons' | 'points' | 'level';
  target: number;
  color: string; // CSS class for background color when unlocked
}
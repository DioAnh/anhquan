
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserProgress } from '../types';
import { THEMES, USER_LEVELS } from '../constants';

const USER_PROGRESS_KEY = 'userLifeSkillsProgress';
const USER_STREAK_KEY = 'userLifeSkillsStreak';
const USER_AVATAR_KEY = 'userLifeSkillsAvatar';
const USER_DAILY_QUIZ_KEY = 'userLifeSkillsDailyQuiz';
const USER_DAILY_LESSON_TRACKER_KEY = 'userLifeSkillsDailyLessonTracker';
const USER_BONUS_POINTS_KEY = 'userLifeSkillsBonusPoints'; // New key for accumulated bonus points

export interface UserStats {
  points: number;
  streak: number;
  badgesCount: number;
  lessonsCompletedToday: number;
  currentLevel: {
    level: number;
    title: string;
    icon: string;
    minPoints: number;
  };
  nextLevel: {
    level: number;
    title: string;
    icon: string;
    minPoints: number;
  } | null;
}

interface UserProgressContextType {
  progress: UserProgress;
  stats: UserStats;
  avatarUrl: string | null;
  dailyQuizCompletedDate: string | null;
  completeLesson: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isLessonUnlocked: (lessonId: string, topicId: string, levelId: string) => boolean;
  resetProgress: () => void;
  updateAvatar: (url: string | null) => void;
  completeDailyQuiz: () => void;
  addBonusPoints: (amount: number) => void;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

// Helper to calculate streak
const calculateStreak = () => {
    try {
        const stored = localStorage.getItem(USER_STREAK_KEY);
        const data = stored ? JSON.parse(stored) : { lastLogin: null, streak: 0 };
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (data.lastLogin === today) {
            return data.streak;
        } else if (data.lastLogin === yesterday) {
            const newStreak = data.streak + 1;
            localStorage.setItem(USER_STREAK_KEY, JSON.stringify({ lastLogin: today, streak: newStreak }));
            return newStreak;
        } else {
            // Reset streak if missed a day, or first time (start at 1)
            localStorage.setItem(USER_STREAK_KEY, JSON.stringify({ lastLogin: today, streak: 1 }));
            return 1;
        }
    } catch (e) {
        return 1;
    }
};

const getLevelInfo = (points: number) => {
    let current = USER_LEVELS[0];
    let next = USER_LEVELS[1] || null;

    for (let i = 0; i < USER_LEVELS.length; i++) {
        if (points >= USER_LEVELS[i].minPoints) {
            current = USER_LEVELS[i];
            next = USER_LEVELS[i+1] || null;
        } else {
            break;
        }
    }
    return { current, next };
}

export const UserProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<UserProgress>({});
  const [stats, setStats] = useState<UserStats>({ 
      points: 0, 
      streak: 1, 
      badgesCount: 0, 
      lessonsCompletedToday: 0,
      currentLevel: USER_LEVELS[0],
      nextLevel: USER_LEVELS[1]
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [dailyQuizCompletedDate, setDailyQuizCompletedDate] = useState<string | null>(null);
  const [bonusPoints, setBonusPoints] = useState(0); // Track extra points from daily quiz & games
  const [lessonsToday, setLessonsToday] = useState(0);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(USER_PROGRESS_KEY);
      const parsedProgress = savedProgress ? JSON.parse(savedProgress) : {};
      setProgress(parsedProgress);
      
      const savedAvatar = localStorage.getItem(USER_AVATAR_KEY);
      if (savedAvatar) setAvatarUrl(savedAvatar);

      const savedDailyQuiz = localStorage.getItem(USER_DAILY_QUIZ_KEY);
      const parsedDailyQuiz = savedDailyQuiz ? JSON.parse(savedDailyQuiz) : { date: null };
      setDailyQuizCompletedDate(parsedDailyQuiz.date);
      
      // Load Bonus Points (Try new key first, fall back to legacy structure inside dailyQuiz)
      const savedBonus = localStorage.getItem(USER_BONUS_POINTS_KEY);
      if (savedBonus) {
          setBonusPoints(parseInt(savedBonus, 10));
      } else if (parsedDailyQuiz.totalBonus) {
          // Migration from old structure
          setBonusPoints(parsedDailyQuiz.totalBonus);
          localStorage.setItem(USER_BONUS_POINTS_KEY, parsedDailyQuiz.totalBonus.toString());
      }
      
      // Load Daily Lesson Tracker
      const savedDailyTracker = localStorage.getItem(USER_DAILY_LESSON_TRACKER_KEY);
      const today = new Date().toDateString();
      if (savedDailyTracker) {
          const tracker = JSON.parse(savedDailyTracker);
          if (tracker.date === today) {
              setLessonsToday(tracker.count);
          } else {
              // Reset if different day
              setLessonsToday(0);
              localStorage.setItem(USER_DAILY_LESSON_TRACKER_KEY, JSON.stringify({ date: today, count: 0 }));
          }
      } else {
          setLessonsToday(0);
      }


      // Calculate Stats
      const streak = calculateStreak();
      
      // Calculate Points: 100 pts per lesson + Bonus Points
      const completedCount = Object.keys(parsedProgress).length;
      const points = (completedCount * 100) + (savedBonus ? parseInt(savedBonus, 10) : (parsedDailyQuiz.totalBonus || 0));

      // Calculate Badges (Levels + Topics + Themes completed)
      let badges = 0;
      THEMES.forEach(theme => {
          // Check Theme completion
          let themeCompleted = true;
          theme.topics.forEach(topic => {
               // Check Topic completion
               let topicCompleted = true;
               topic.levels.forEach(level => {
                   // Check Level completion
                   const levelCompleted = level.lessons.every(l => parsedProgress[l.id] === 'completed');
                   if (levelCompleted) badges++;
                   else topicCompleted = false;
               });
               if (topicCompleted) badges++; // Epic badge
               else themeCompleted = false;
          });
          if (themeCompleted) badges++; // Certificate
      });

      const { current, next } = getLevelInfo(points);

      setStats({
          points,
          streak,
          badgesCount: badges,
          lessonsCompletedToday: lessonsToday, // will be updated in next effect if loaded differently
          currentLevel: current,
          nextLevel: next
      });

    } catch (error) {
      console.error("Could not load user progress from localStorage", error);
    }
  }, []); // Run once on mount to load/calc

  // Re-calculate stats when progress or bonus points changes
  useEffect(() => {
      const completedCount = Object.keys(progress).length;
      const points = (completedCount * 100) + bonusPoints;
      
      let badges = 0;
      THEMES.forEach(theme => {
          let themeCompleted = true;
          theme.topics.forEach(topic => {
               let topicCompleted = true;
               topic.levels.forEach(level => {
                   const levelCompleted = level.lessons.every(l => progress[l.id] === 'completed');
                   if (levelCompleted) badges++;
                   else topicCompleted = false;
               });
               if (topicCompleted) badges++;
               else themeCompleted = false;
          });
          if (themeCompleted) badges++;
      });

      const { current, next } = getLevelInfo(points);

      setStats(prev => ({
          ...prev,
          points,
          badgesCount: badges,
          lessonsCompletedToday: lessonsToday,
          currentLevel: current,
          nextLevel: next
      }));

  }, [progress, bonusPoints, lessonsToday]);

  const saveProgress = useCallback((newProgress: UserProgress) => {
    try {
      localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error("Could not save user progress to localStorage", error);
    }
  }, []);

  const updateAvatar = useCallback((url: string | null) => {
      setAvatarUrl(url);
      if (url) {
          localStorage.setItem(USER_AVATAR_KEY, url);
      } else {
          localStorage.removeItem(USER_AVATAR_KEY);
      }
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    const newProgress = { ...progress, [lessonId]: 'completed' as const };
    saveProgress(newProgress);

    // Update Daily Tracker
    const today = new Date().toDateString();
    const newDailyCount = lessonsToday + 1;
    setLessonsToday(newDailyCount);
    localStorage.setItem(USER_DAILY_LESSON_TRACKER_KEY, JSON.stringify({ date: today, count: newDailyCount }));

  }, [progress, saveProgress, lessonsToday]);
  
  const addBonusPoints = useCallback((amount: number) => {
      setBonusPoints(prev => {
          const newPoints = prev + amount;
          localStorage.setItem(USER_BONUS_POINTS_KEY, newPoints.toString());
          return newPoints;
      });
  }, []);

  const completeDailyQuiz = useCallback(() => {
      const today = new Date().toDateString();
      setDailyQuizCompletedDate(today);
      
      // Save date only (points now handled separately)
      localStorage.setItem(USER_DAILY_QUIZ_KEY, JSON.stringify({
          date: today
      }));
      
      addBonusPoints(5); // +5 Points for Daily Quiz
  }, [addBonusPoints]);

  const isLessonCompleted = useCallback((lessonId: string) => {
    return progress[lessonId] === 'completed';
  }, [progress]);

  const isLessonUnlocked = useCallback((lessonId: string, topicId: string, levelId: string) => {
    const theme = THEMES.find(t => t.topics.some(tp => tp.id === topicId));
    if (!theme) return false;
    const topic = theme.topics.find(tp => tp.id === topicId);
    if (!topic) return false;
    const level = topic.levels.find(l => l.id === levelId);
    if (!level) return false;

    const lessonIndex = level.lessons.findIndex(l => l.id === lessonId);
    if (lessonIndex === 0) return true; // First lesson is always unlocked
    
    const previousLesson = level.lessons[lessonIndex - 1];
    return isLessonCompleted(previousLesson.id);
  }, [isLessonCompleted]);

  const resetProgress = useCallback(() => {
    saveProgress({});
    localStorage.removeItem(USER_AVATAR_KEY);
    localStorage.removeItem(USER_DAILY_QUIZ_KEY);
    localStorage.removeItem(USER_DAILY_LESSON_TRACKER_KEY);
    localStorage.removeItem(USER_BONUS_POINTS_KEY);
    setAvatarUrl(null);
    setDailyQuizCompletedDate(null);
    setBonusPoints(0);
    setLessonsToday(0);
    setStats({ 
        points: 0, 
        streak: 1, 
        badgesCount: 0, 
        lessonsCompletedToday: 0,
        currentLevel: USER_LEVELS[0],
        nextLevel: USER_LEVELS[1]
    });
  }, [saveProgress]);

  return React.createElement(
    UserProgressContext.Provider,
    {
      value: { 
        progress, 
        stats, 
        avatarUrl, 
        dailyQuizCompletedDate,
        completeLesson, 
        isLessonCompleted, 
        isLessonUnlocked, 
        resetProgress, 
        updateAvatar,
        completeDailyQuiz,
        addBonusPoints
      }
    },
    children
  );
};

export const useUserProgress = (): UserProgressContextType => {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};

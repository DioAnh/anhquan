
import React, { useState, useEffect } from 'react';
import { Lesson, QuizQuestion, Topic, Theme } from '../types';
import { generateSummary, generateQuiz } from '../services/geminiService';
import { useUserProgress } from '../hooks/useUserProgress';
import YouTubePlayer from './YouTubePlayer';
import Quiz from './Quiz';
import RewardModal from './RewardModal';

type LessonState = 'watching' | 'summarizing' | 'summary_ready' | 'quizzing' | 'quiz_passed' | 'quiz_failed';
type RewardType = 'badge' | 'epic-badge' | 'certificate' | null;

interface LessonPlayerProps {
  lesson: Lesson;
  topic: Topic;
  theme: Theme;
  onComplete: (lesson: Lesson) => void;
}

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center p-16 bg-white/80 rounded-[3rem] border-[6px] border-white shadow-lg backdrop-blur-sm">
        <div className="relative w-28 h-28 mb-8">
             <div className="absolute top-0 left-0 w-full h-full border-[10px] border-purple-100 rounded-full"></div>
             <div className="absolute top-0 left-0 w-full h-full border-[10px] border-purple-500 rounded-full animate-spin border-t-transparent"></div>
             <div className="absolute inset-0 flex items-center justify-center text-5xl animate-bounce">🤖</div>
        </div>
        <p className="text-purple-600 font-black text-2xl animate-pulse text-center leading-snug">
            Bạn Robot đang học bài... <br/>
            <span className="text-lg text-purple-400 font-bold">Bé đợi xíu xiu nhé!</span>
        </p>
    </div>
);

const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson, topic, theme, onComplete }) => {
  const [lessonState, setLessonState] = useState<LessonState>('watching');
  const [summary, setSummary] = useState<string>('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const { completeLesson, isLessonCompleted } = useUserProgress();
  const [showReward, setShowReward] = useState<RewardType>(null);
  const [rewardName, setRewardName] = useState('');

  useEffect(() => {
    setLessonState('watching');
    setSummary('');
    setQuizQuestions([]);
  }, [lesson]);

  const handleFinishedWatching = async () => {
    setLessonState('summarizing');
    const generatedSummary = await generateSummary(lesson.title);
    setSummary(generatedSummary);
    setLessonState('summary_ready');
  };

  const handleStartQuiz = async () => {
    setLessonState('quizzing');
    const questions = await generateQuiz(summary);
    setQuizQuestions(questions);
  };

  const checkAndGrantRewards = () => {
    const currentLevel = topic.levels.find(l => l.lessons.some(l => l.id === lesson.id));
    if (currentLevel) {
        const allLessonsInLevelCompleted = currentLevel.lessons.every(l => isLessonCompleted(l.id));
        if (allLessonsInLevelCompleted) {
            setShowReward('badge');
            setRewardName(currentLevel.badge.name);
            return;
        }
    }
    
    const allLessonsInTopicCompleted = topic.levels.flatMap(l => l.lessons).every(l => isLessonCompleted(l.id));
    if (allLessonsInTopicCompleted) {
        setShowReward('epic-badge');
        setRewardName(topic.epicBadge.name);
        return;
    }

    const allLessonsInThemeCompleted = theme.topics.flatMap(t => t.levels.flatMap(l => l.lessons)).every(l => isLessonCompleted(l.id));
    if (allLessonsInThemeCompleted) {
        setShowReward('certificate');
        setRewardName(theme.certificate.name);
    }
  }

  const handleQuizComplete = (passed: boolean) => {
    if (passed) {
      if (!isLessonCompleted(lesson.id)) {
        completeLesson(lesson.id);
      }
      setLessonState('quiz_passed');
      setTimeout(checkAndGrantRewards, 100);
    } else {
      setLessonState('quiz_failed');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto pb-24">
       <RewardModal
        isOpen={showReward !== null}
        onClose={() => setShowReward(null)}
        type={showReward}
        name={rewardName}
      />
      <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border-[8px] border-white">
        
        {/* Title Bar */}
        <div className="bg-blue-50 p-6 sm:p-10 border-b-[6px] border-white flex items-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mr-6 border-2 border-blue-100 text-4xl">
                📺
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-800 leading-tight">{lesson.title}</h2>
        </div>

        <div className="p-6 sm:p-10 bg-blue-50/30 min-h-[400px]">
            {lessonState === 'watching' && (
            <div className="space-y-10 animate-fade-in">
                <div className="border-[8px] border-white rounded-[2rem] overflow-hidden shadow-2xl bg-black relative">
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-white rounded-full z-10"></div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full z-10"></div>
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white rounded-full z-10"></div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full z-10"></div>
                    <YouTubePlayer videoId={lesson.videoId} />
                </div>
                <button
                onClick={handleFinishedWatching}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black text-2xl py-6 px-8 rounded-[2rem] shadow-[0_10px_0_rgb(20,150,100)] active:shadow-none active:translate-y-2 transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center border-4 border-green-300/50"
                >
                <span className="mr-3 text-3xl">✅</span> Bé xem xong rồi!
                </button>
            </div>
            )}

            {(lessonState === 'summarizing' || (lessonState === 'quizzing' && quizQuestions.length === 0)) && (
            <div className="h-full flex items-center justify-center py-12">
                <LoadingSpinner/>
            </div>
            )}
            
            {lessonState === 'summary_ready' && (
            <div className="animate-slide-up">
                <div className="bg-white p-8 sm:p-10 rounded-[3rem] border-[6px] border-yellow-200 shadow-xl relative">
                    <div className="absolute -top-8 -left-6 w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center border-4 border-white shadow-md text-4xl transform -rotate-12">📝</div>
                    <h3 className="font-extrabold text-2xl text-yellow-700 mb-6 ml-8 uppercase tracking-wide">Bài học hôm nay</h3>
                    <p className="text-gray-600 text-xl leading-loose font-medium bg-yellow-50 p-6 rounded-3xl border-2 border-dashed border-yellow-200">
                        {summary}
                    </p>
                </div>
                <button
                onClick={handleStartQuiz}
                className="mt-10 w-full bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-2xl py-6 px-8 rounded-[2rem] shadow-[0_10px_0_rgb(60,80,180)] active:shadow-none active:translate-y-2 transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center border-4 border-blue-300/50"
                >
                <span className="mr-3 text-3xl">🎮</span> Chơi đố vui nào!
                </button>
            </div>
            )}

            {quizQuestions.length > 0 && (lessonState === 'quizzing' || lessonState === 'quiz_failed') && (
                <div className="animate-slide-up">
                    {lessonState === 'quiz_failed' && (
                        <div className="mb-8 p-6 bg-red-100 text-red-500 rounded-[2rem] border-[4px] border-red-200 flex items-center animate-shake shadow-md">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-4xl mr-4 border-2 border-red-100">🥺</div>
                            <div>
                                <p className="font-extrabold text-xl">Chưa chính xác rồi!</p>
                                <p className="font-bold opacity-80">Bé thử lại lần nữa nhé, cố lên!</p>
                            </div>
                        </div>
                    )}
                    <Quiz 
                        questions={quizQuestions} 
                        onComplete={handleQuizComplete} 
                        key={lesson.id + quizQuestions.length}
                        parentAdvice="Ba mẹ hãy cùng bé nhớ lại các chi tiết trong video vừa xem. Đừng vội gợi ý đáp án, hãy hỏi 'Con nhớ đoạn nào trong video nói về điều này không?' để rèn luyện trí nhớ cho bé."
                    />
                </div>
            )}

            {lessonState === 'quiz_passed' && (
            <div className="py-16 text-center animate-zoom-in">
                <div className="text-9xl mb-6 animate-bounce filter drop-shadow-xl">🎉</div>
                <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 mb-4">Hoan hô!</h3>
                <p className="text-2xl text-gray-500 font-bold mb-12">Bé trả lời đúng hết rồi, giỏi quá đi mất!</p>
                <button
                    onClick={() => onComplete(lesson)}
                    className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-black text-2xl py-5 px-12 rounded-full shadow-[0_15px_40px_rgba(168,85,247,0.4)] transform hover:scale-110 transition-all duration-300 border-4 border-white"
                >
                    🎁 Bài học tiếp theo ➜
                </button>
            </div>
            )}
        </div>
      </div>
      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .animate-zoom-in { animation: zoomIn 0.5s ease-out forwards; }
        @keyframes zoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default LessonPlayer;

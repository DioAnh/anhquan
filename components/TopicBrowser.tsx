import React, { useState } from 'react';
import { Topic, Lesson, Level } from '../types';
import { useUserProgress } from '../hooks/useUserProgress';
import { LockIcon } from './IconComponents';
import FlipCardModule from './FlipCardModule';

interface TopicBrowserProps {
  topic: Topic;
  themeColor: any;
  onSelectLesson: (lesson: Lesson) => void;
}

interface LevelCardProps {
    level: Level;
    topicId: string;
    themeColor: any;
    onSelectLesson: (lesson: Lesson) => void;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, topicId, themeColor, onSelectLesson }) => {
    const { isLessonUnlocked, isLessonCompleted } = useUserProgress();
    
    const totalLessons = level.lessons.length;
    const completedLessons = level.lessons.filter(l => isLessonCompleted(l.id)).length;
    const isLevelCompleted = totalLessons > 0 && completedLessons === totalLessons;

    return (
        <div className="bg-white/80 backdrop-blur border-[5px] border-white rounded-[3rem] shadow-[0_15px_35px_rgba(0,0,0,0.1)] p-6 sm:p-8 mb-10 relative overflow-visible">
            {/* Decorative Badge Floating */}
            <div className={`absolute -top-6 -right-6 w-20 h-20 bg-yellow-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl transform rotate-12 z-20 transition-transform duration-500 ${isLevelCompleted ? 'scale-110 rotate-0' : 'grayscale opacity-70'}`}>
                {level.badge.icon === 'Badge' ? '🏅' : '⭐'}
            </div>

            <div className="flex flex-col mb-8 relative z-10">
                <span className={`self-start inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase ${themeColor.bg} ${themeColor.text} mb-2 shadow-sm`}>
                    Cấp độ {level.level}
                </span>
                <h3 className="text-3xl font-extrabold text-gray-800">{level.title}</h3>
                <p className="text-gray-400 font-bold mt-1">{level.badge.name}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 relative z-10">
                {level.lessons.map((lesson, index) => {
                    const unlocked = isLessonUnlocked(lesson.id, topicId, level.id);
                    const completed = isLessonCompleted(lesson.id);

                    return (
                        <button
                            key={lesson.id}
                            onClick={() => unlocked && onSelectLesson(lesson)}
                            disabled={!unlocked}
                            className={`w-full group text-left p-4 sm:p-5 rounded-[2rem] flex items-center justify-between transition-all duration-200 transform border-b-[6px] active:border-b-0 active:translate-y-[6px] ${
                                unlocked
                                ? `bg-white border-gray-100 hover:border-${themeColor.border.split('-')[1]}-200 shadow-sm hover:bg-${themeColor.bg.split('-')[1]}-50 cursor-pointer`
                                : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed opacity-80 shadow-inner'
                            }`}
                        >
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black mr-5 shadow-sm transition-colors ${
                                    completed ? 'bg-green-400 text-white' : 
                                    unlocked ? `${themeColor.bg} ${themeColor.text}` : 'bg-gray-200 text-gray-400'
                                }`}>
                                    {completed ? '✓' : index + 1}
                                </div>
                                <span className={`font-bold text-lg sm:text-xl ${unlocked ? 'text-gray-700 group-hover:text-gray-900' : 'text-gray-400'}`}>{lesson.title}</span>
                            </div>
                            
                            <div className="ml-4 transform group-hover:scale-110 transition-transform">
                                {completed ? (
                                    <div className="bg-green-100 text-green-500 p-2 rounded-full">
                                       <span className="text-xl">🌟</span>
                                    </div>
                                ) : unlocked ? (
                                    <div className={`bg-white ${themeColor.text} p-3 rounded-full border-2 ${themeColor.border} shadow-sm`}>
                                        <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                ) : (
                                    <div className="opacity-50">
                                        <LockIcon />
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const TopicBrowser: React.FC<TopicBrowserProps> = ({ topic, themeColor, onSelectLesson }) => {
  const [showFlipCards, setShowFlipCards] = useState(false);

  if (showFlipCards) {
    return (
      <FlipCardModule
        topic={topic.title}
        onComplete={() => setShowFlipCards(false)}
        themeColor={themeColor}
      />
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto pb-24">
        {/* Flip Card Learning Module Button */}
        <div className="mb-8 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-[3rem] p-6 sm:p-8 border-[6px] border-white shadow-[0_15px_40px_rgba(168,85,247,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/30 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg mr-6 border-4 border-white text-5xl">
                        🎴
                    </div>
                    <div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
                            Học với Thẻ Lật
                        </h3>
                        <p className="text-gray-600 font-bold text-lg">
                            Ôn tập kiến thức một cách vui vẻ!
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowFlipCards(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-xl py-5 px-10 rounded-[2rem] shadow-[0_10px_0_rgb(168,85,247)] active:shadow-none active:translate-y-2 transition-all duration-200 transform hover:-translate-y-1 flex items-center border-4 border-white whitespace-nowrap"
                >
                    <span className="mr-3 text-2xl">🎴</span>
                    Bắt đầu học
                </button>
            </div>
        </div>

        {/* Lessons */}
        {topic.levels.map(level => (
            <LevelCard key={level.id} level={level} topicId={topic.id} themeColor={themeColor} onSelectLesson={onSelectLesson} />
        ))}
    </div>
  );
};

export default TopicBrowser;
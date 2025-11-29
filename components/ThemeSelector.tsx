import React from 'react';
import { Theme, Topic } from '../types';
import { useUserProgress } from '../hooks/useUserProgress';

interface ThemeSelectorProps {
  theme: Theme;
  themeColor: any;
  onSelectTopic: (topic: Topic) => void;
}

interface TopicCardProps {
    topic: Topic;
    themeColor: any;
    onSelectTopic: (topic: Topic) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, themeColor, onSelectTopic }) => {
    const { progress } = useUserProgress();
    const totalLessons = topic.levels.reduce((sum, level) => sum + level.lessons.length, 0);
    const completedLessons = topic.levels.flatMap(l => l.lessons).filter(lesson => progress[lesson.id] === 'completed').length;
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    const isCompleted = completedLessons === totalLessons && totalLessons > 0;

    return (
        <div 
            onClick={() => onSelectTopic(topic)}
            className="group relative bg-white rounded-[2.5rem] border-[5px] border-white shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transform hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
        >
            {/* Background decorative circle */}
            <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full ${themeColor.bg} opacity-30 group-hover:scale-150 transition-transform duration-700`}></div>

            <div className={`p-8 flex-grow flex flex-col items-center text-center relative z-10 ${isCompleted ? 'bg-yellow-50/50' : ''}`}>
                <div className={`w-24 h-24 mb-6 rounded-full ${themeColor.bg} border-4 border-white shadow-md flex items-center justify-center text-5xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300`}>
                   {isCompleted ? '🏆' : '🎯'}
                </div>
                
                <h3 className="text-2xl font-extrabold text-gray-700 mb-3 group-hover:text-pink-500 transition-colors px-2 leading-tight">{topic.title}</h3>
                
                <div className={`transition-all duration-500 mt-auto ${isCompleted ? 'opacity-100 scale-100' : 'opacity-0 scale-50 h-0'}`}>
                    <div className="flex items-center text-yellow-600 font-black bg-yellow-100 px-4 py-2 rounded-full text-sm border-2 border-yellow-200 shadow-sm transform -rotate-2">
                        <span className="mr-2 text-lg">🌟</span> HOÀN THÀNH!
                    </div>
                </div>
                 {!isCompleted && <p className="text-gray-400 font-bold text-sm mt-auto bg-gray-100 px-3 py-1 rounded-full">Còn {totalLessons - completedLessons} bài nữa thôi!</p>}
            </div>

            {/* Candy Progress Bar */}
            <div className="p-5 bg-gray-50 border-t-2 border-gray-100">
                <div className="flex justify-between text-xs font-black text-gray-400 uppercase mb-2 tracking-wider">
                    <span>Tiến độ</span>
                    <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-white rounded-full h-6 border-2 border-gray-100 shadow-inner p-1">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${themeColor.gradient} relative overflow-hidden`} 
                        style={{ width: `${Math.max(progressPercentage, 5)}%` }}
                    >
                       {/* Striped animation overlay */}
                       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes-light.png')] opacity-30"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, themeColor, onSelectTopic }) => {
  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {theme.topics.map(topic => (
          <TopicCard key={topic.id} topic={topic} themeColor={themeColor} onSelectTopic={onSelectTopic} />
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
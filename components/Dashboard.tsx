
import React, { useState, useRef, useEffect } from 'react';
import { useUserProgress } from '../hooks/useUserProgress';
import { generateAvatar, generateDailyChallenge } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { USER_LEVELS, ACHIEVEMENTS } from '../constants';
import Quiz from './Quiz';
import ChallengeGame from './ChallengeGame';

interface DashboardProps {
    userName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userName }) => {
    const { stats, progress, avatarUrl, updateAvatar, dailyQuizCompletedDate, completeDailyQuiz } = useUserProgress();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Modals
    const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
    const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
    const [isChallengeOpen, setIsChallengeOpen] = useState(false);
    
    // Daily Quiz States
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [quizLoading, setQuizLoading] = useState(false);
    const [dailyQuestion, setDailyQuestion] = useState<QuizQuestion | null>(null);
    const [quizResult, setQuizResult] = useState<'success' | 'fail' | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleGenerateAvatar = async () => {
        setIsMenuOpen(false);
        setIsGenerating(true);
        const newAvatar = await generateAvatar();
        if (newAvatar) {
            updateAvatar(newAvatar);
        }
        setIsGenerating(false);
    };

    const handleDeleteAvatar = () => {
        setIsMenuOpen(false);
        updateAvatar(null);
    };

    // Daily Quiz Logic
    const isDailyQuizDone = dailyQuizCompletedDate === new Date().toDateString();

    const handleOpenDailyQuiz = async () => {
        if (isDailyQuizDone) return;
        setIsQuizModalOpen(true);
        setQuizLoading(true);
        setQuizResult(null);
        
        const question = await generateDailyChallenge();
        setDailyQuestion(question);
        setQuizLoading(false);
    };

    const handleDailyQuizComplete = (passed: boolean) => {
        if (passed) {
            completeDailyQuiz();
            setQuizResult('success');
            setTimeout(() => {
                setIsQuizModalOpen(false);
                setDailyQuestion(null);
            }, 3000); // Close after 3 seconds of celebration
        } else {
            setQuizResult('fail');
             // Optionally allow retry or just close
        }
    };
    
    // Helper to check achievement status
    const isAchievementUnlocked = (achievement: typeof ACHIEVEMENTS[0]) => {
        switch(achievement.type) {
            case 'streak':
                return stats.streak >= achievement.target;
            case 'totalLessons':
                return Object.keys(progress).length >= achievement.target;
            case 'dailyLessons':
                return stats.lessonsCompletedToday >= achievement.target;
            case 'points':
                return stats.points >= achievement.target;
            case 'level':
                return stats.currentLevel.level >= achievement.target;
            default:
                return false;
        }
    };

    // Helper to get color style for badges
    const getBadgeStyle = (colorClass: string, unlocked: boolean) => {
        if (!unlocked) return 'bg-gray-200 border-gray-300 text-gray-400 grayscale';
        
        // Extract color name (e.g., 'blue' from 'bg-blue-100')
        const colorName = colorClass.split('-')[1];
        return `bg-gradient-to-br from-${colorName}-100 to-${colorName}-200 border-${colorName}-400 text-${colorName}-600 shadow-lg`;
    };
    
    const getTextArtStyle = (colorClass: string, unlocked: boolean) => {
        if (!unlocked) return 'text-gray-400';
         const colorName = colorClass.split('-')[1];
         return `text-transparent bg-clip-text bg-gradient-to-b from-${colorName}-500 to-${colorName}-700 drop-shadow-sm`;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 mb-10 space-y-8">
            {/* --- TOP SECTION: USER PROFILE --- */}
            {/* Increased Z-Index to 50 to ensure dropdown appears above daily challenge banner */}
            <div className="relative bg-white/60 backdrop-blur-xl border-[5px] border-white rounded-[3.5rem] p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col md:flex-row items-center gap-6 md:gap-10 overflow-visible hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-shadow duration-300 z-50">
                
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-100 to-transparent opacity-50 rounded-bl-full -z-10 overflow-hidden rounded-[3rem]"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-100 to-transparent opacity-50 rounded-tr-full -z-10 overflow-hidden rounded-[3rem]"></div>

                {/* Avatar Section */}
                <div className="flex-shrink-0 relative group z-30" ref={menuRef}>
                    <div 
                        onClick={() => !isGenerating && setIsMenuOpen(!isMenuOpen)}
                        className={`w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full border-[6px] border-white shadow-lg flex items-center justify-center transform transition-all duration-300 relative z-10 overflow-hidden cursor-pointer ${isGenerating ? 'animate-pulse' : 'group-hover:scale-105 group-hover:rotate-3'}`}
                    >
                         {isGenerating ? (
                             <div className="text-4xl animate-spin">🪄</div>
                         ) : avatarUrl ? (
                             <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
                         ) : (
                             <span className="text-7xl sm:text-8xl filter drop-shadow-md animate-bounce-slow">🧑‍🚀</span>
                         )}
                         
                         {!isGenerating && (
                             <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <span className="text-white text-2xl">✏️</span>
                             </div>
                         )}
                    </div>

                    <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full border-4 border-white shadow-sm z-20 animate-pulse-slow pointer-events-none">
                        LV.{stats.currentLevel.level}
                    </div>

                    {isMenuOpen && !isGenerating && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-2 min-w-[200px] animate-pop-in z-50 flex flex-col gap-2">
                             <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-purple-100 rotate-45"></div>
                             
                             <button 
                                onClick={handleGenerateAvatar}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 text-purple-600 font-bold transition-colors text-left"
                            >
                                <span className="text-xl">✨</span>
                                <div>
                                    <p>Tạo Avatar mới</p>
                                    <p className="text-xs font-normal text-purple-400">Phép thuật biến hình</p>
                                </div>
                             </button>

                             <button 
                                onClick={handleDeleteAvatar}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 font-bold transition-colors text-left"
                            >
                                <span className="text-xl">↩️</span>
                                <div>
                                    <p>Về mặc định</p>
                                </div>
                             </button>
                        </div>
                    )}
                </div>

                {/* Welcome & Info */}
                <div className="flex-1 text-center md:text-left z-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-700 mb-3">
                        Xin chào, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-[length:200%_auto] animate-gradient-x">{userName}</span>!
                    </h2>
                    
                    <button 
                        onClick={() => setIsLevelModalOpen(true)}
                        className="inline-block relative overflow-hidden bg-white/80 border-2 border-purple-200 rounded-2xl px-4 py-2 shadow-sm mb-4 group cursor-pointer hover:border-purple-400 hover:scale-105 transition-all"
                    >
                        <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shine pointer-events-none"></div>
                        <span className="text-purple-600 font-bold uppercase tracking-wider text-sm sm:text-base relative z-10 flex items-center gap-2">
                           <span>{stats.currentLevel.icon}</span>
                            Danh hiệu: <span className="text-purple-800 font-black">{stats.currentLevel.title}</span>
                            <span className="text-xs bg-purple-100 px-2 py-0.5 rounded-full ml-1"></span>
                        </span>
                    </button>

                </div>

                {/* Stats Grid */}
                <div className="flex gap-4 sm:gap-6 w-full md:w-auto justify-center md:justify-end z-10">
                    <div className="flex flex-col items-center bg-white p-4 rounded-[2rem] border-4 border-orange-100 min-w-[90px] shadow-sm transform hover:-translate-y-2 transition-transform duration-300">
                        <div className="text-3xl mb-1 animate-pulse">🔥</div>
                        <span className="text-2xl font-black text-orange-500">{stats.streak}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">Ngày</span>
                    </div>

                    <div className="flex flex-col items-center bg-white p-4 rounded-[2rem] border-4 border-yellow-100 min-w-[90px] shadow-sm transform hover:-translate-y-2 transition-transform duration-300 delay-75">
                        <div className="text-3xl mb-1 animate-spin-slow">⭐</div>
                        <span className="text-2xl font-black text-yellow-500">{stats.points}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">Điểm</span>
                    </div>

                    <div 
                        onClick={() => setIsAchievementModalOpen(true)}
                        className="flex flex-col items-center bg-white p-4 rounded-[2rem] border-4 border-blue-100 min-w-[90px] shadow-sm transform hover:-translate-y-2 transition-transform duration-300 delay-150 cursor-pointer hover:bg-blue-50 group"
                    >
                        <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🏅</div>
                        <span className="text-2xl font-black text-blue-500">{ACHIEVEMENTS.filter(a => isAchievementUnlocked(a)).length}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">Huy hiệu</span>
                    </div>
                </div>
            </div>

            {/* --- DAILY QUIZ BANNER --- */}
            <div 
                onClick={handleOpenDailyQuiz}
                className={`
                    relative rounded-[3rem] p-6 sm:p-8 cursor-pointer overflow-hidden border-[6px] transition-all duration-300
                    ${isDailyQuizDone 
                        ? 'bg-gradient-to-r from-emerald-100 to-green-50 border-white hover:border-emerald-200' 
                        : 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 border-white hover:scale-[1.02] shadow-[0_15px_30px_rgba(168,85,247,0.4)]'
                    }
                `}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between relative z-10">
                    <div className="flex items-center gap-6 mb-4 sm:mb-0">
                        <div className={`
                            w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md border-4 border-white
                            ${isDailyQuizDone ? 'bg-emerald-200' : 'bg-white animate-bounce-slow'}
                        `}>
                            {isDailyQuizDone ? '✅' : '🎁'}
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className={`text-2xl sm:text-3xl font-black mb-1 ${isDailyQuizDone ? 'text-emerald-700' : 'text-white'}`}>
                                {isDailyQuizDone ? 'Thử thách Hoàn thành!' : 'Thử thách Mỗi ngày'}
                            </h3>
                            {isDailyQuizDone && (
                                <p className="font-bold text-lg text-emerald-500">
                                    Tuyệt vời! Bé hãy quay lại vào ngày mai nhé.
                                </p>
                            )}
                        </div>
                    </div>
                    
                    {!isDailyQuizDone && (
                        <button className="bg-white text-fuchsia-600 font-black px-8 py-3 rounded-full text-xl shadow-lg border-4 border-fuchsia-200 transform hover:scale-110 active:scale-95 transition-all">
                            Chơi ngay ▶
                        </button>
                    )}
                </div>
            </div>

            {/* --- CHALLENGE ZONE --- */}
            <div>
                <div className="flex items-center justify-between mb-6 px-4">
                    <h2 className="text-2xl font-black text-gray-700">Góc Thử Thách 🧩</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Situation Puzzle Card */}
                    <div 
                        onClick={() => setIsChallengeOpen(true)}
                        className="group relative bg-white rounded-[2.5rem] p-6 border-[5px] border-white shadow-lg cursor-pointer hover:-translate-y-2 transition-transform duration-300 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200 rounded-bl-[4rem] -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-md text-white mb-4 transform rotate-3 group-hover:rotate-12 transition-transform">
                                🖼️
                            </div>
                            <h3 className="text-xl font-extrabold text-gray-800 mb-2">Thám tử Tình huống</h3>
                            <p className="text-gray-500 font-bold text-sm mb-4 flex-1">
                                Nhìn hình đoán chuyện và giải quyết vấn đề cùng các bạn thú nhé!
                            </p>
                            <button className="bg-indigo-50 text-indigo-600 font-bold py-2 px-4 rounded-xl w-fit group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                Chơi ngay ➜
                            </button>
                        </div>
                    </div>

                    {/* Placeholder for future games */}
                    <div className="relative bg-gray-50 rounded-[2.5rem] p-6 border-[5px] border-transparent border-dashed border-gray-200 flex flex-col items-center justify-center text-center opacity-70">
                        <div className="text-4xl mb-2 grayscale">🎮</div>
                        <h3 className="text-lg font-bold text-gray-400">Sắp ra mắt</h3>
                        <p className="text-xs text-gray-400 font-semibold">Nhiều trò chơi thú vị đang được ấp ủ...</p>
                    </div>
                </div>
            </div>

            {/* --- ACHIEVEMENT MODAL (REDESIGNED) --- */}
            {isAchievementModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setIsAchievementModalOpen(false)}></div>
                    <div className="relative w-full max-w-5xl bg-white rounded-[3rem] p-8 max-h-[90vh] overflow-hidden flex flex-col border-[8px] border-white shadow-2xl animate-pop-in">
                        <button 
                            onClick={() => setIsAchievementModalOpen(false)}
                            className="absolute top-6 right-6 bg-gray-100 hover:bg-gray-200 text-gray-500 w-12 h-12 rounded-full font-bold text-xl shadow-sm z-50 transition-colors"
                        >
                            ✕
                        </button>
                        
                        <div className="text-center mb-8 flex-shrink-0">
                            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-2">
                                Bộ Sưu Tập Huy Hiệu 🏅
                            </h2>
                            <p className="text-gray-500 font-bold text-lg">Sưu tập trọn bộ huy hiệu siêu ngầu nào!</p>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 sm:gap-8 pb-8">
                                {ACHIEVEMENTS.map((achievement, index) => {
                                    const isUnlocked = isAchievementUnlocked(achievement);
                                    const badgeStyle = getBadgeStyle(achievement.color, isUnlocked);
                                    const textStyle = getTextArtStyle(achievement.color, isUnlocked);
                                    
                                    // Fix tooltip clipping for first row (indices 0-4)
                                    // Tooltips for first row appear BELOW the item. Others appear ABOVE.
                                    const isFirstRow = index < 5; 

                                    return (
                                        <div 
                                            key={achievement.id}
                                            className="group relative flex flex-col items-center cursor-pointer transition-all duration-300"
                                        >
                                            {/* Tooltip on Hover */}
                                            <div className={`absolute ${isFirstRow ? 'top-full mt-4' : 'bottom-full mb-4'} opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gray-800 text-white text-xs font-bold px-3 py-2 rounded-xl z-50 pointer-events-none transform ${isFirstRow ? '-translate-y-2' : 'translate-y-2'} group-hover:translate-y-0 w-32 text-center shadow-lg`}>
                                                {achievement.description}
                                                {/* Arrow */}
                                                <div className={`absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 ${isFirstRow ? '-top-1' : '-bottom-1'}`}></div>
                                            </div>

                                            {/* Badge Token */}
                                            <div className={`
                                                w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-4xl sm:text-5xl border-[5px] transition-all duration-300 relative
                                                ${badgeStyle}
                                                ${isUnlocked ? 'group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-xl' : 'opacity-80'}
                                            `}>
                                                <span className={isUnlocked ? 'filter drop-shadow-md' : 'opacity-50'}>
                                                    {achievement.icon}
                                                </span>
                                                
                                                {/* Lock Overlay */}
                                                {!isUnlocked && (
                                                    <div className="absolute inset-0 bg-black/10 rounded-full flex items-center justify-center">
                                                        <span className="text-2xl opacity-60">🔒</span>
                                                    </div>
                                                )}
                                                
                                                {/* Shine Effect for Unlocked */}
                                                {isUnlocked && (
                                                    <div className="absolute top-2 left-2 w-6 h-3 bg-white/40 rounded-full transform -rotate-45 filter blur-[1px]"></div>
                                                )}
                                            </div>

                                            {/* Text Artwork */}
                                            <h3 className={`mt-3 text-center text-xs sm:text-sm font-black leading-tight px-1 transition-all duration-300 ${textStyle} ${isUnlocked ? 'group-hover:scale-105' : ''}`}>
                                                {achievement.title}
                                            </h3>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- LEVEL ROADMAP MODAL --- */}
            {isLevelModalOpen && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                     <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setIsLevelModalOpen(false)}></div>
                     <div className="relative w-full max-w-4xl bg-white rounded-[3rem] p-8 max-h-[90vh] overflow-hidden flex flex-col border-[8px] border-white shadow-2xl animate-pop-in">
                        <button 
                            onClick={() => setIsLevelModalOpen(false)}
                            className="absolute top-6 right-6 bg-gray-100 hover:bg-gray-200 text-gray-500 w-12 h-12 rounded-full font-bold text-xl shadow-sm z-50 transition-colors"
                        >
                            ✕
                        </button>
                        
                        <div className="text-center mb-6 flex-shrink-0">
                            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                                Lộ Trình Thăng Hạng 🏆
                            </h2>
                            <p className="text-gray-500 font-bold mt-2">Cùng chinh phục đỉnh cao chiến binh nhé!</p>
                            {stats.nextLevel && (
                                <div className="mt-4 inline-block bg-yellow-50 px-6 py-2 rounded-full border border-yellow-200 text-yellow-700 font-bold">
                                    Cần thêm <span className="text-xl">{stats.nextLevel.minPoints - stats.points}</span> điểm để lên hạng tiếp theo! 🚀
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-4 py-4 px-2">
                                {USER_LEVELS.map((level, index) => {
                                    const isUnlocked = stats.points >= level.minPoints;
                                    const isCurrent = stats.currentLevel.level === level.level;
                                    const isNext = stats.nextLevel?.level === level.level;

                                    return (
                                        <div 
                                            key={level.level}
                                            className={`relative flex items-center p-4 rounded-[2rem] border-[4px] transition-all duration-300 ${
                                                isCurrent 
                                                    ? 'bg-purple-50 border-purple-400 shadow-md scale-[1.02] z-10' 
                                                    : isUnlocked 
                                                        ? 'bg-white border-green-200 opacity-80' 
                                                        : 'bg-gray-50 border-gray-100 opacity-60 grayscale'
                                            }`}
                                        >
                                            {/* Progress Line */}
                                            {index < USER_LEVELS.length - 1 && (
                                                <div className={`absolute left-[34px] top-full h-4 w-1 ${isUnlocked && stats.points >= USER_LEVELS[index+1].minPoints ? 'bg-green-300' : 'bg-gray-200'} -z-10`}></div>
                                            )}

                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl border-4 flex-shrink-0 mr-4 ${
                                                isCurrent 
                                                    ? 'bg-white border-purple-400 shadow-sm animate-pulse'
                                                    : isUnlocked 
                                                        ? 'bg-green-100 border-green-300' 
                                                        : 'bg-gray-200 border-gray-300'
                                            }`}>
                                                {level.icon}
                                            </div>
                                            
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                                    <h3 className={`text-xl font-black ${isCurrent ? 'text-purple-700' : isUnlocked ? 'text-green-700' : 'text-gray-400'}`}>
                                                        {level.title}
                                                    </h3>
                                                    <span className={`text-sm font-bold px-3 py-1 rounded-full w-fit mt-1 sm:mt-0 ${isCurrent ? 'bg-purple-200 text-purple-700' : isUnlocked ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                                                        {level.minPoints.toLocaleString()} điểm
                                                    </span>
                                                </div>
                                                {isCurrent && (
                                                    <div className="mt-2 w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                                                        <div className="bg-purple-500 h-full rounded-full animate-shine-bar" style={{ width: '100%' }}></div>
                                                    </div>
                                                )}
                                                {isNext && (
                                                     <div className="mt-2 text-xs font-bold text-gray-400 flex items-center">
                                                         🔒 Sắp mở khóa
                                                     </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                     </div>
                 </div>
            )}

            {/* --- DAILY QUIZ MODAL --- */}
            {isQuizModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsQuizModalOpen(false)}></div>
                    
                    <div className="relative w-full max-w-2xl animate-pop-in max-h-[90vh] flex flex-col">
                         {/* Close Button - Moved inside slightly for mobile view, pushed out for desktop */}
                         <button 
                            onClick={() => setIsQuizModalOpen(false)}
                            className="absolute top-2 right-2 sm:-top-4 sm:-right-4 bg-white text-gray-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-xl shadow-lg border-4 border-gray-100 z-50 hover:bg-gray-100 flex items-center justify-center"
                        >
                            ✕
                        </button>

                        <div className="overflow-y-auto custom-scrollbar rounded-[3rem] shadow-2xl">
                            {quizLoading && (
                                 <div className="bg-white rounded-[3rem] p-12 text-center border-[8px] border-white">
                                     <div className="text-6xl mb-6 animate-bounce">🤖</div>
                                     <h3 className="text-2xl font-extrabold text-purple-600 mb-2">Đang tìm câu hỏi hay...</h3>
                                     <p className="text-gray-400 font-bold">Bé đợi xíu nhé!</p>
                                 </div>
                            )}

                            {!quizLoading && dailyQuestion && quizResult !== 'success' && (
                                 <div className="bg-white rounded-[3rem] p-2 border-[8px] border-white overflow-hidden">
                                     <div className="bg-purple-50 p-4 sm:p-6 rounded-[2.5rem]">
                                         <div className="flex justify-between items-center mb-4 px-2 pt-2">
                                             <span className="bg-purple-200 text-purple-700 px-3 py-1 sm:px-4 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider">Daily Challenge</span>
                                             <span className={`font-black flex items-center gap-1 ${quizResult === 'fail' ? 'text-gray-400' : 'text-yellow-500'}`}>
                                                 <span>{quizResult === 'fail' ? '🔒' : '⭐'}</span> {quizResult === 'fail' ? '0 Điểm' : '+5 Điểm'}
                                             </span>
                                         </div>
                                         <Quiz 
                                            questions={[dailyQuestion]} 
                                            onComplete={handleDailyQuizComplete} 
                                            parentAdvice="Đây là bài học mỗi ngày để hình thành thói quen tốt. Ba mẹ hãy khuyến khích bé suy nghĩ tích cực, biến bài học thành niềm vui thay vì áp lực đúng sai nhé!"
                                         />
                                         {quizResult === 'fail' && (
                                             <p className="text-center text-red-500 font-bold mt-4 animate-shake pb-2">
                                                 Tiếc quá! Chưa đúng rồi, bé thử lại lần sau nhé!
                                             </p>
                                         )}
                                     </div>
                                 </div>
                            )}

                            {quizResult === 'success' && (
                                <div className="bg-white rounded-[3rem] p-10 text-center border-[8px] border-emerald-100 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/confetti.png')] opacity-30 animate-pulse"></div>
                                    <div className="text-8xl mb-6 animate-bounce">🎉</div>
                                    <h3 className="text-4xl font-black text-emerald-500 mb-2">Chính xác!</h3>
                                    <p className="text-2xl text-gray-600 font-bold mb-6">Bé nhận được 5 điểm thưởng</p>
                                    <div className="inline-block px-8 py-3 bg-yellow-100 text-yellow-600 rounded-full font-black text-xl border-2 border-yellow-300">
                                        Tổng điểm: {stats.points}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- CHALLENGE GAME MODAL --- */}
            {isChallengeOpen && (
                <ChallengeGame onClose={() => setIsChallengeOpen(false)} />
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e9d5ff; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }

                .animate-bounce-slow {
                    animation: bounceSlow 3s infinite;
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                .animate-gradient-x {
                    animation: gradientX 3s ease infinite;
                }
                .animate-shine {
                    animation: shine 3s infinite;
                }
                .animate-shine-bar {
                     animation: shineBar 2s infinite linear;
                     background: linear-gradient(90deg, #a855f7, #d8b4fe, #a855f7);
                     background-size: 200% 100%;
                }
                @keyframes shineBar {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .animate-float {
                     animation: float 3s ease-in-out infinite; 
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                .animate-pulse-slow {
                    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 1s ease-out forwards;
                    opacity: 0;
                }
                .animate-pop-in {
                    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes bounceSlow {
                    0%, 100% { transform: translateY(-5%); }
                    50% { transform: translateY(5%); }
                }
                @keyframes gradientX {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes shine {
                    0% { left: -100%; opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { left: 100%; opacity: 0; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;


import React, { useState, useMemo, useEffect } from 'react';
import { Theme, Topic, Lesson } from './types';
import { THEMES } from './constants';
import ThemeSelector from './components/ThemeSelector';
import TopicBrowser from './components/TopicBrowser';
import LessonPlayer from './components/LessonPlayer';
import { useUserProgress, UserProgressProvider } from './hooks/useUserProgress';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SplashScreen from './components/SplashScreen';

// Cute Header Component with Cloud shape
const Header = ({ onBack, title }: { onBack?: () => void; title: string }) => (
  <header className="sticky top-4 z-30 w-full px-4 mb-8 pointer-events-none">
    <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border-[5px] border-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-4 px-6 flex items-center justify-between mx-auto max-w-5xl transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)]">
        <div className="flex items-center flex-1 min-w-0">
            {onBack && (
            <button onClick={onBack} className="mr-4 flex-shrink-0 bg-pink-100 p-3 rounded-full hover:bg-pink-200 text-pink-500 hover:text-pink-600 transition-all transform hover:scale-110 hover:rotate-[-10deg] shadow-sm border-2 border-pink-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            )}
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-700 truncate flex-1">{title}</h1>
        </div>
        <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full ml-4 border-2 border-yellow-200 animate-bounce-slow">
            <span className="text-2xl">🐝</span>
        </div>
    </div>
  </header>
);

// Helper for theme colors with added shadow colors for the glow effect
const getThemeColor = (index: number) => {
    const colors = [
        { 
            bg: 'bg-pink-100', 
            border: 'border-pink-300', 
            text: 'text-pink-600', 
            gradient: 'from-pink-400 to-rose-400', 
            icon: '🗣️', 
            btn: 'bg-pink-500',
            shadow: 'rgba(244, 114, 182, 0.6)' // Pink glow
        },
        { 
            bg: 'bg-blue-100', 
            border: 'border-blue-300', 
            text: 'text-blue-600', 
            gradient: 'from-blue-400 to-cyan-400', 
            icon: '🎭', 
            btn: 'bg-blue-500',
            shadow: 'rgba(96, 165, 250, 0.6)' // Blue glow
        },
        { 
            bg: 'bg-yellow-100', 
            border: 'border-yellow-300', 
            text: 'text-yellow-700', 
            gradient: 'from-yellow-400 to-orange-400', 
            icon: '🧩', 
            btn: 'bg-yellow-500',
            shadow: 'rgba(250, 204, 21, 0.6)' // Yellow glow
        },
        { 
            bg: 'bg-green-100', 
            border: 'border-green-300', 
            text: 'text-green-600', 
            gradient: 'from-green-400 to-emerald-400', 
            icon: '🛡️', 
            btn: 'bg-green-500',
            shadow: 'rgba(74, 222, 128, 0.6)' // Green glow
        },
    ];
    return colors[index % colors.length];
};

const COMING_SOON_THEMES = [
    {
        id: 'cs-1',
        title: 'Kỹ năng Công dân số',
        description: 'Hiểu biết về thế giới mạng, an toàn thông tin và văn hóa ứng xử online.',
        icon: '🌐',
        color: 'bg-cyan-100'
    },
    {
        id: 'cs-2',
        title: 'Kỹ năng Sáng tạo',
        description: 'Khơi dậy trí tưởng tượng phong phú và tư duy đột phá giải quyết vấn đề.',
        icon: '🎨',
        color: 'bg-purple-100'
    },
    {
        id: 'cs-3',
        title: 'Kỹ năng Hợp tác',
        description: 'Học cách làm việc nhóm, lắng nghe và cùng nhau đạt mục tiêu chung.',
        icon: '🤝',
        color: 'bg-orange-100'
    }
];


function AppContent() {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  // State to handle the "click animation" before navigation
  const [animatingThemeId, setAnimatingThemeId] = useState<string | null>(null);
  
  const { isLessonCompleted } = useUserProgress();

  const handleSelectTheme = (theme: Theme) => {
    // Trigger animation
    setAnimatingThemeId(theme.id);
    
    // Wait for animation to finish (600ms) before changing state
    setTimeout(() => {
        setSelectedTheme(theme);
        setSelectedTopic(null);
        setSelectedLesson(null);
        setAnimatingThemeId(null);
    }, 600);
  };

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setSelectedLesson(null);
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const goBackToThemes = () => {
    setSelectedTheme(null);
    setSelectedTopic(null);
    setSelectedLesson(null);
  };

  const goBackToTopics = () => {
    setSelectedTopic(null);
    setSelectedLesson(null);
  };
  
  const goBackToLessons = () => {
      setSelectedLesson(null);
  };

  const findNextLesson = (currentLesson: Lesson) => {
    if (!selectedTopic || !selectedTheme) return null;
    let foundCurrent = false;
    for (const level of selectedTopic.levels) {
        for (const lesson of level.lessons) {
            if (foundCurrent) return lesson;
            if (lesson.id === currentLesson.id) {
                foundCurrent = true;
            }
        }
    }
    return null;
  };

  const handleLessonComplete = (completedLesson: Lesson) => {
    const nextLesson = findNextLesson(completedLesson);
    if(nextLesson && !isLessonCompleted(nextLesson.id)){
       setSelectedLesson(nextLesson);
    } else {
       setSelectedLesson(null);
    }
  };


  const currentView = useMemo(() => {
    if (selectedLesson && selectedTopic && selectedTheme) {
      return (
        <>
          <Header onBack={goBackToLessons} title={selectedTopic.title} />
          <LessonPlayer 
            lesson={selectedLesson}
            topic={selectedTopic}
            theme={selectedTheme}
            onComplete={handleLessonComplete}
          />
        </>
      );
    }
    if (selectedTopic && selectedTheme) {
      return (
        <>
          <Header onBack={goBackToTopics} title={selectedTheme.title} />
          <TopicBrowser topic={selectedTopic} themeColor={getThemeColor(THEMES.indexOf(selectedTheme))} onSelectLesson={handleSelectLesson} />
        </>
      );
    }
    if (selectedTheme) {
      return (
        <>
          <Header onBack={goBackToThemes} title="Chọn Bài Học Nhé" />
          <ThemeSelector theme={selectedTheme} themeColor={getThemeColor(THEMES.indexOf(selectedTheme))} onSelectTopic={handleSelectTopic} />
        </>
      );
    }
    const userName = localStorage.getItem('userName') || 'bé yêu';
    return (
        <>
            <Header title={`Chào mừng bé trở lại!`} />
            <Dashboard userName={userName} />
            <div className="p-4 max-w-6xl mx-auto pb-24">
                <div className="flex items-center justify-between mb-8 px-4">
                     <h2 className="text-2xl font-black text-gray-600">Khám phá thế giới</h2>
                     <span className="text-sm font-bold bg-pink-100 text-pink-500 px-3 py-1 rounded-full border border-pink-200">6 Chủ đề lớn</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    {THEMES.map((theme, index) => {
                        const style = getThemeColor(index);
                        const isAnimating = animatingThemeId === theme.id;
                        
                        return (
                        <div key={theme.id} onClick={() => !isAnimating && handleSelectTheme(theme)}
                            className={`
                                relative group bg-white rounded-[3rem] overflow-hidden cursor-pointer border-[6px] border-white
                                transition-all duration-300
                                ${isAnimating ? 'animate-pop-click z-50' : 'hover:-translate-y-4'}
                            `}
                            style={{
                                // Dynamic colored shadow on hover
                                boxShadow: isAnimating 
                                    ? `0 0 0 8px ${style.shadow}, 0 30px 60px ${style.shadow}` 
                                    : undefined,
                                // We use inline style for the hover shadow to use the dynamic color
                                ['--theme-glow' as any]: style.shadow
                            }}
                        >   
                            {/* Custom Style for Hover Glow */}
                            <style>{`
                                .group:hover {
                                    box-shadow: 0 25px 50px -12px var(--theme-glow) !important;
                                    border-color: white;
                                }
                                .animate-pop-click {
                                    animation: popClick 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                                }
                                @keyframes popClick {
                                    0% { transform: scale(1); }
                                    40% { transform: scale(1.08) rotate(2deg); }
                                    50% { transform: scale(1.08) rotate(-2deg); }
                                    100% { transform: scale(1.15); opacity: 0; }
                                }
                                @keyframes flash {
                                    0% { transform: translateX(-100%) skewX(-15deg); }
                                    100% { transform: translateX(200%) skewX(-15deg); }
                                }
                                .animate-flash {
                                    animation: flash 0.8s ease-in-out;
                                }
                            `}</style>

                            {/* Flash Effect Overlay (triggers on click) */}
                            {isAnimating && (
                                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-[2.5rem]">
                                    <div className="absolute inset-0 bg-white/50 animate-flash w-1/2 h-full blur-md"></div>
                                </div>
                            )}

                            <div className={`h-48 bg-gradient-to-br ${style.gradient} flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:brightness-110`}>
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                
                                {/* Icon Animation */}
                                <span className={`text-8xl transform transition-transform duration-500 drop-shadow-md filter ${isAnimating ? 'scale-150 rotate-12' : 'group-hover:scale-125 group-hover:rotate-6'}`}>
                                    {style.icon}
                                </span>
                            </div>

                            <div className="p-8 pt-10 relative bg-white">
                                {/* Badge decoration */}
                                <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full border-4 ${style.border} group-hover:scale-110 transition-transform duration-300`}>
                                     <div className={`w-4 h-4 rounded-full ${style.bg} ${isAnimating ? 'animate-ping' : ''}`}></div>
                                </div>

                                <h2 className={`text-3xl font-extrabold ${style.text} mb-4 text-center group-hover:scale-105 transition-transform`}>{theme.title}</h2>
                                <p className="text-gray-500 text-center font-semibold text-lg leading-relaxed mb-6">{theme.description}</p>
                                
                                <div className="flex justify-center">
                                    <button className={`
                                        px-8 py-3 rounded-2xl ${style.bg} ${style.text} font-extrabold text-lg 
                                        border-2 ${style.border}
                                        transform transition-all duration-300
                                        group-hover:scale-110 group-hover:shadow-lg
                                        ${isAnimating ? 'scale-125 bg-white' : ''}
                                    `}>
                                        {isAnimating ? 'Đi thôi! 🚀' : 'Khám phá ngay ➜'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )})}

                    {/* Coming Soon Themes */}
                    {COMING_SOON_THEMES.map((theme) => (
                        <div key={theme.id} 
                            className="relative group bg-gray-50 rounded-[3rem] overflow-hidden border-[6px] border-dashed border-gray-200 grayscale opacity-70 cursor-not-allowed hover:grayscale-0 hover:opacity-90 transition-all duration-500"
                        >
                            <div className="absolute top-6 right-6 z-20">
                                <span className="bg-gray-200 text-gray-500 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow-sm">Sắp ra mắt</span>
                            </div>

                            <div className={`h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden`}>
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"></div>
                                <span className="text-7xl opacity-50 filter blur-[1px]">
                                    {theme.icon}
                                </span>
                            </div>

                            <div className="p-8 pt-10 relative bg-white/50">
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-100 p-2 rounded-full border-4 border-gray-200">
                                     <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                                </div>

                                <h2 className="text-3xl font-extrabold text-gray-400 mb-4 text-center">{theme.title}</h2>
                                <p className="text-gray-400 text-center font-medium text-lg leading-relaxed mb-6">{theme.description}</p>
                                
                                <div className="flex justify-center">
                                    <button disabled className="px-8 py-3 rounded-2xl bg-gray-100 text-gray-400 font-bold text-lg border-2 border-gray-200 cursor-not-allowed">
                                        Đang phát triển 🚧
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
  }, [selectedTheme, selectedTopic, selectedLesson, animatingThemeId]);

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto">{currentView}</main>
    </div>
  );
}

export default function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Initial check for login status
        if (localStorage.getItem('isLoggedIn') === 'true') {
            setIsLoggedIn(true);
        }

        // Start splash screen timer - Increased to 5000ms (5 seconds)
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 5000); 

        return () => clearTimeout(timer);
    }, []);

    const handleLogin = () => {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
    };

    // Show Splash Screen first
    if (showSplash) {
        return <SplashScreen />;
    }

    // Then Login Check
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    // Finally Main App
    return (
        <UserProgressProvider>
            <AppContent />
        </UserProgressProvider>
    );
}

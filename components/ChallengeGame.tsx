
import React, { useState, useEffect, useRef } from 'react';
import { generateSituationGame, evaluateSituationAnswer, SituationGameData, EvaluationResult } from '../services/geminiService';
import { useUserProgress } from '../hooks/useUserProgress';
import ParentTip from './ParentTip';

interface ChallengeGameProps {
    onClose: () => void;
}

const ChallengeGame: React.FC<ChallengeGameProps> = ({ onClose }) => {
    const [gameState, setGameState] = useState<'loading' | 'playing' | 'evaluating' | 'result'>('loading');
    const [gameData, setGameData] = useState<SituationGameData | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [result, setResult] = useState<EvaluationResult | null>(null);

    const { addBonusPoints } = useUserProgress();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        startNewGame();
    }, []);

    // Focus textarea when entering playing state
    useEffect(() => {
        if (gameState === 'playing' && textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, [gameState]);

    const startNewGame = async () => {
        setGameState('loading');
        setResult(null);
        setUserAnswer('');
        const data = await generateSituationGame();
        if (data) {
            setGameData(data);
            setGameState('playing');
        } else {
            // Simple error handling
            setGameState('loading'); // Keep loading or show error state
            alert("Có chút trục trặc nhỏ. Bé thử lại sau nhé!");
            onClose();
        }
    };

    const handleSubmit = async () => {
        if (!userAnswer.trim() || !gameData) return;

        setGameState('evaluating');
        const evalResult = await evaluateSituationAnswer(
            gameData.situationContext, 
            gameData.question, 
            userAnswer
        );
        
        setResult(evalResult);
        
        if (evalResult.isPass) {
            addBonusPoints(2); // Award 2 points for success
        }
        
        setGameState('result');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={onClose}></div>
            
            {/* Removed overflow-hidden here to allow ParentTip popup to show fully */}
            <div className="relative w-full max-w-5xl bg-white rounded-[3rem] p-2 md:p-4 max-h-[95vh] flex flex-col border-[8px] border-white shadow-2xl animate-pop-in">
                
                {/* Parent Support Tip - Dynamic AI Powered (Pre-generated) */}
                <ParentTip 
                    staticContent={gameData?.parentGuidance || "Phụ huynh nên đưa ra câu hỏi mở, hướng dẫn con tự do đưa ra câu trả lời. Hãy để bé tự khám phá giải pháp."}
                    placement="bottom-right"
                    showAiBadge={true}
                />

                {/* Header / Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 z-30 bg-white/80 hover:bg-white text-gray-500 w-12 h-12 rounded-full font-bold text-xl shadow-md backdrop-blur-sm transition-all hover:scale-110"
                >
                    ✕
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar rounded-[2.5rem] bg-indigo-50 relative">
                    
                    {/* LOADING STATE */}
                    {gameState === 'loading' && (
                        <div className="flex flex-col items-center justify-center h-full min-h-[500px] p-8 text-center">
                            <div className="relative w-40 h-40 mb-8">
                                <div className="absolute inset-0 border-8 border-indigo-200 rounded-full animate-ping opacity-20"></div>
                                <div className="absolute inset-0 border-8 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-6xl animate-bounce">🎨</div>
                            </div>
                            <h3 className="text-3xl font-black text-indigo-600 mb-2">Bạn Thỏ Họa Sĩ đang vẽ tranh...</h3>
                            <p className="text-gray-500 font-bold text-lg animate-pulse">Bé đợi một xíu để Thỏ hoàn thành bức tranh tình huống nhé!</p>
                        </div>
                    )}

                    {/* PLAYING STATE */}
                    {gameState === 'playing' && gameData && (
                        <div className="flex flex-col lg:flex-row h-full">
                            {/* Image Section */}
                            <div className="lg:w-1/2 p-6 flex flex-col">
                                <div className="relative rounded-[2rem] overflow-hidden shadow-lg border-4 border-white flex-1 min-h-[300px] bg-gray-200 group">
                                    <img 
                                        src={gameData.imageUrl} 
                                        alt="Situation" 
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-20">
                                        <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 inline-block">Tình huống</span>
                                        <p className="text-white font-bold text-lg leading-snug drop-shadow-md">
                                            {gameData.situationContext}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Question & Interaction Section */}
                            <div className="lg:w-1/2 p-6 lg:pl-0 flex flex-col justify-center">
                                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border-[4px] border-indigo-100 flex-1 flex flex-col pt-12">
                                    <div className="mb-6">
                                        <span className="text-indigo-500 font-black text-sm uppercase tracking-wider bg-indigo-100 px-3 py-1 rounded-full">Câu hỏi</span>
                                        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 mt-3 leading-tight">
                                            {gameData.question}
                                        </h3>
                                    </div>

                                    <textarea
                                        ref={textAreaRef}
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        placeholder="Bé sẽ làm gì nào? Nhập câu trả lời vào đây nhé..."
                                        className="w-full flex-1 bg-gray-50 rounded-2xl p-5 text-lg font-medium text-gray-700 border-2 border-gray-200 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none resize-none mb-6 placeholder-gray-400"
                                    />

                                    <button
                                        onClick={handleSubmit}
                                        disabled={!userAnswer.trim()}
                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-black text-xl shadow-lg shadow-indigo-200 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center justify-center gap-3"
                                    >
                                        <span>Gửi câu trả lời</span>
                                        <span className="text-2xl">🚀</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* EVALUATING STATE */}
                    {gameState === 'evaluating' && (
                        <div className="flex flex-col items-center justify-center h-full min-h-[500px] p-8 text-center bg-white/50 backdrop-blur-sm">
                            <div className="text-8xl mb-6 animate-bounce">🦉</div>
                            <h3 className="text-3xl font-black text-gray-700 mb-2">Bác Cú Mèo Thông Thái đang đọc bài...</h3>
                            <p className="text-gray-500 font-bold">Bé hồi hộp quá đúng không? Đợi bác một chút nhé!</p>
                        </div>
                    )}

                    {/* RESULT STATE */}
                    {gameState === 'result' && result && (
                         <div className="flex flex-col items-center justify-center h-full p-6 md:p-12 text-center animate-pop-in">
                            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl border-[8px] border-white shadow-xl mb-6 ${result.isPass ? 'bg-green-100 animate-bounce' : 'bg-orange-100 animate-shake'}`}>
                                {result.isPass ? '🌟' : '💡'}
                            </div>

                            <h2 className={`text-4xl md:text-5xl font-black mb-4 ${result.isPass ? 'text-green-500' : 'text-orange-500'}`}>
                                {result.isPass ? 'Tuyệt vời!' : 'Thử lại chút nhé!'}
                            </h2>

                            <div className="bg-white rounded-[2rem] p-8 border-[4px] border-gray-100 shadow-sm max-w-2xl w-full mb-8 relative">
                                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm">
                                    <span>Điểm số: {result.score}/100</span>
                                    {result.isPass && (
                                        <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs animate-pulse">+2 Điểm Thưởng</span>
                                    )}
                                </div>
                                <p className="text-xl md:text-2xl font-bold text-gray-700 leading-relaxed">
                                    "{result.feedback}"
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={onClose}
                                    className="px-8 py-4 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-lg transition-colors"
                                >
                                    Đóng
                                </button>
                                <button
                                    onClick={startNewGame}
                                    className="px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-lg shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 flex items-center gap-2"
                                >
                                    <span>Chơi ván mới</span>
                                    <span>🎲</span>
                                </button>
                            </div>
                         </div>
                    )}
                </div>
            </div>
             <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                .animate-pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};

export default ChallengeGame;

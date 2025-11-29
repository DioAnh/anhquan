import React, { useState } from 'react';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
}

interface FlipCardProps {
  card: Flashcard;
  index: number;
  total: number;
  onFlip?: () => void;
  onPlayGame?: () => void; // Called when user clicks "Play game" button
  onNext?: () => void;
  onPrevious?: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const FlipCard: React.FC<FlipCardProps> = ({ 
  card, 
  index, 
  total, 
  onFlip, 
  onPlayGame,
  onNext, 
  onPrevious,
  canGoNext,
  canGoPrevious 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (onFlip) onFlip();
  };

  const handlePlayGame = () => {
    if (onPlayGame) {
      onPlayGame();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto perspective-1000 relative z-0">
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flip-card-inner.flipped {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          z-index: 1;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s infinite;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
      
      <div 
        className="flip-card-inner cursor-pointer relative"
        onClick={handleFlip}
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front of card */}
        <div className="flip-card-front">
          <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-[3rem] p-10 sm:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.2)] border-[8px] border-white min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden pb-24">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>
            
            {/* Card number badge */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white shadow-lg">
              <span className="text-blue-600 font-black text-lg">{index + 1} / {total}</span>
            </div>
            
            {/* Front content */}
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-6 animate-bounce-slow">📚</div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
                Câu hỏi
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-white leading-relaxed drop-shadow-md">
                {card.front}
              </p>
            </div>
            
            {/* Tap hint */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/80 text-sm font-bold animate-pulse">
              👆 Chạm để xem đáp án
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="flip-card-back">
          <div className="bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-[3rem] p-10 sm:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.2)] border-[8px] border-white min-h-[400px] flex flex-col items-center justify-between relative overflow-hidden pb-32">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>
            
            {/* Card number badge */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white shadow-lg z-20">
              <span className="text-green-600 font-black text-lg">{index + 1} / {total}</span>
            </div>
            
            {/* Back content */}
            <div className="relative z-10 text-center flex-1 flex flex-col justify-center">
              <div className="text-6xl mb-6 animate-bounce-slow">✨</div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
                Đáp án
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-white leading-relaxed drop-shadow-md px-4">
                {card.back}
              </p>
            </div>
            
            {/* Play Game Button - Fixed at bottom, outside content area */}
            {isFlipped && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[calc(100%-3rem)] z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayGame();
                  }}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-black text-xl py-4 px-8 rounded-[2rem] shadow-[0_8px_0_rgb(234,179,8)] transform hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all duration-200 border-4 border-white"
                >
                  🎮 Chơi trò chơi
                </button>
              </div>
            )}
            
            {/* Tap hint - Only show when not flipped */}
            {!isFlipped && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/80 text-sm font-bold animate-pulse">
                👆 Chạm để quay lại
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center mt-8 gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (canGoPrevious && onPrevious) {
              setIsFlipped(false);
              onPrevious();
            }
          }}
          disabled={!canGoPrevious}
          className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 font-black text-lg py-4 px-6 rounded-[2rem] shadow-lg disabled:shadow-none transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200 border-4 border-white disabled:border-gray-200"
        >
          ← Trước
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFlip();
          }}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-lg py-4 px-6 rounded-[2rem] shadow-[0_8px_0_rgb(168,85,247)] transform hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all duration-200 border-4 border-white"
        >
          {isFlipped ? '🔄 Quay lại' : '🔄 Lật thẻ'}
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (canGoNext && onNext) {
              setIsFlipped(false);
              onNext();
            }
          }}
          disabled={!canGoNext}
          className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 font-black text-lg py-4 px-6 rounded-[2rem] shadow-lg disabled:shadow-none transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200 border-4 border-white disabled:border-gray-200"
        >
          Sau →
        </button>
      </div>
    </div>
  );
};

export default FlipCard;


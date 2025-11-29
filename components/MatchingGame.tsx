import React, { useState, useEffect } from 'react';

export interface MatchingOption {
  id: string;
  text: string;
  imageUrl: string;
  isCorrect: boolean;
}

interface MatchingGameProps {
  correctTerm: string;
  correctDefinition: string;
  options: MatchingOption[];
  onComplete: (isCorrect: boolean) => void;
  onSkip?: () => void;
}

const MatchingGame: React.FC<MatchingGameProps> = ({ 
  correctTerm, 
  correctDefinition, 
  options, 
  onComplete,
  onSkip 
}) => {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const textOptions = options.map(opt => ({ id: opt.id, text: opt.text, isCorrect: opt.isCorrect }));
  const imageOptions = options.map(opt => ({ id: opt.id, imageUrl: opt.imageUrl, isCorrect: opt.isCorrect }));

  const handleTextClick = (id: string) => {
    if (matchedPairs.has(id)) return; // Already matched
    if (selectedText === id) {
      setSelectedText(null);
    } else {
      setSelectedText(id);
      if (selectedImage) {
        checkMatch(id, selectedImage);
      }
    }
  };

  const handleImageClick = (id: string) => {
    if (matchedPairs.has(id)) return; // Already matched
    if (selectedImage === id) {
      setSelectedImage(null);
    } else {
      setSelectedImage(id);
      if (selectedText) {
        checkMatch(selectedText, id);
      }
    }
  };

  const checkMatch = (textId: string, imageId: string) => {
    const textOption = textOptions.find(t => t.id === textId);
    const imageOption = imageOptions.find(i => i.id === imageId);
    
    if (textOption && imageOption && textId === imageId) {
      // Correct match - same ID means they belong together
      setMatchedPairs(prev => new Set([...prev, textId]));
      setSelectedText(null);
      setSelectedImage(null);
      
      // Check if it's the correct answer
      if (textOption.isCorrect && imageOption.isCorrect) {
        setIsCorrect(true);
        setShowResult(true);
        setTimeout(() => {
          onComplete(true);
        }, 2000);
      }
    } else {
      // Wrong match - shake animation and reset
      const wrongElement = document.querySelector(`[data-id="${textId}"], [data-id="${imageId}"]`);
      if (wrongElement) {
        wrongElement.classList.add('animate-shake');
        setTimeout(() => {
          wrongElement.classList.remove('animate-shake');
        }, 500);
      }
      setSelectedText(null);
      setSelectedImage(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes correctPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-correct {
          animation: correctPulse 0.6s ease-in-out;
        }
      `}</style>

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-[2rem] p-6 mb-6 border-[6px] border-white shadow-lg">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-2">
          🎯 Trò chơi Ghép đôi
        </h3>
        <p className="text-white/90 font-bold text-center text-lg">
          Ghép từ khóa với hình ảnh đúng nhé!
        </p>
      </div>

      {/* Success Message */}
      {showResult && isCorrect && (
        <div className="mb-6 bg-green-100 border-[4px] border-green-300 rounded-[2rem] p-6 text-center animate-correct">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-2xl font-black text-green-700">Đúng rồi! Giỏi quá!</p>
        </div>
      )}

      {/* Game Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Side - Text Options */}
        <div className="space-y-4">
          <h4 className="text-xl font-black text-gray-700 text-center mb-4">Từ khóa</h4>
          {textOptions.map((option) => {
            const isMatched = matchedPairs.has(option.id);
            const isSelected = selectedText === option.id;
            
            return (
              <button
                key={option.id}
                data-id={option.id}
                onClick={() => handleTextClick(option.id)}
                disabled={isMatched}
                className={`w-full p-6 rounded-[2rem] border-[4px] transition-all duration-200 transform ${
                  isMatched
                    ? 'bg-green-200 border-green-400 cursor-not-allowed opacity-60'
                    : isSelected
                    ? 'bg-yellow-200 border-yellow-400 shadow-lg scale-105'
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:scale-102'
                }`}
              >
                <p className={`font-bold text-lg text-center ${isMatched ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                  {option.text}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Side - Image Options */}
        <div className="space-y-4">
          <h4 className="text-xl font-black text-gray-700 text-center mb-4">Hình ảnh</h4>
          {imageOptions.map((option) => {
            const isMatched = matchedPairs.has(option.id);
            const isSelected = selectedImage === option.id;
            
            return (
              <button
                key={option.id}
                data-id={option.id}
                onClick={() => handleImageClick(option.id)}
                disabled={isMatched}
                className={`w-full rounded-[2rem] border-[4px] overflow-hidden transition-all duration-200 transform ${
                  isMatched
                    ? 'border-green-400 cursor-not-allowed opacity-60'
                    : isSelected
                    ? 'border-yellow-400 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-blue-300 hover:scale-102'
                }`}
              >
                <img 
                  src={option.imageUrl} 
                  alt="Matching option"
                  className={`w-full h-32 object-cover ${isMatched ? 'opacity-50' : ''}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-[4px] border-blue-200 rounded-[2rem] p-4 mb-6">
        <p className="text-blue-700 font-semibold text-center text-sm">
          💡 Chọn một từ khóa bên trái, sau đó chọn hình ảnh đúng bên phải để ghép đôi!
        </p>
      </div>

      {/* Skip Button */}
      {onSkip && (
        <div className="text-center">
          <button
            onClick={onSkip}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-6 py-3 rounded-full transition-all"
          >
            Bỏ qua
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchingGame;


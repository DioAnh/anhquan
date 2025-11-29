import React, { useState, useEffect } from 'react';
import { Flashcard } from './FlipCard';
import { generateFlashcards, generateMatchingGame, generateMatchingGameImages, generateDragAndDropGame, generateDragAndDropImages } from '../services/geminiService';
import FlipCard from './FlipCard';
import RewardModal from './RewardModal';
import MatchingGame, { MatchingOption } from './MatchingGame';
import DragAndDropGame, { DragItem, DropZone } from './DragAndDropGame';

interface FlipCardModuleProps {
  topic: string;
  onComplete?: () => void;
  themeColor?: {
    bg: string;
    border: string;
    text: string;
    gradient: string;
    icon: string;
    btn: string;
    shadow: string;
  };
}

type ModuleState = 'loading' | 'playing' | 'completed';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-16 bg-white/80 rounded-[3rem] border-[6px] border-white shadow-lg backdrop-blur-sm">
    <div className="relative w-28 h-28 mb-8">
      <div className="absolute top-0 left-0 w-full h-full border-[10px] border-purple-100 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-[10px] border-purple-500 rounded-full animate-spin border-t-transparent"></div>
      <div className="absolute inset-0 flex items-center justify-center text-5xl animate-bounce">🎴</div>
    </div>
    <p className="text-purple-600 font-black text-2xl animate-pulse text-center leading-snug">
      Đang tạo thẻ học cho bé... <br/>
      <span className="text-lg text-purple-400 font-bold">Chờ xíu nhé!</span>
    </p>
  </div>
);

const FlipCardModule: React.FC<FlipCardModuleProps> = ({ topic, onComplete, themeColor }) => {
  const [moduleState, setModuleState] = useState<ModuleState>('loading');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [flippedCount, setFlippedCount] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showCard, setShowCard] = useState(false);
  const [showMatchingGame, setShowMatchingGame] = useState(false);
  const [matchingGameData, setMatchingGameData] = useState<MatchingOption[] | null>(null);
  const [isLoadingMatchingGame, setIsLoadingMatchingGame] = useState(false);
  const [showDragAndDropGame, setShowDragAndDropGame] = useState(false);
  const [dragAndDropItems, setDragAndDropItems] = useState<DragItem[]>([]);
  const [dragAndDropZones, setDragAndDropZones] = useState<DropZone[]>([]);
  const [isLoadingDragAndDrop, setIsLoadingDragAndDrop] = useState(false);

  useEffect(() => {
    loadFlashcards();
  }, [topic]);

  useEffect(() => {
    // Tự động ẩn hướng dẫn sau 5 giây, sau đó hiển thị thẻ lật
    if (moduleState === 'playing') {
      const hideInstructionsTimer = setTimeout(() => {
        setShowInstructions(false);
        // Sau khi box mờ dần (1 giây), hiển thị thẻ lật
        setTimeout(() => {
          setShowCard(true);
        }, 1000);
      }, 5000);
      return () => clearTimeout(hideInstructionsTimer);
    }
  }, [moduleState]);

  const loadFlashcards = async () => {
    setModuleState('loading');
    try {
      const cards = await generateFlashcards(topic, 6);
      setFlashcards(cards);
      setModuleState('playing');
    } catch (error) {
      console.error('Error loading flashcards:', error);
      // Set default flashcards on error
      setFlashcards([
        {
          id: 'card-1',
          front: 'Khi gặp người lạ, bé nên làm gì?',
          back: 'Bé không nên đi theo người lạ và cần báo ngay cho người lớn biết!',
          category: topic
        },
        {
          id: 'card-2',
          front: 'Khi nào cần nói lời cảm ơn?',
          back: 'Khi ai đó giúp đỡ hoặc cho mình thứ gì đó, bé nên nói "Cảm ơn bạn/anh/chị" nhé!',
          category: topic
        }
      ]);
      setModuleState('playing');
    }
  };

  const handleFlip = () => {
    setFlippedCount(prev => prev + 1);
  };

  const handlePlayGame = async () => {
    // When user clicks "Play game" button, generate and show matching game
    const currentCard = flashcards[currentIndex];
    if (!currentCard) return;

    setIsLoadingMatchingGame(true);
    setShowMatchingGame(true);

    try {
      // Generate matching game data
      const gameData = await generateMatchingGame(currentCard.front, currentCard.back);
      
      if (gameData) {
        // Generate images for all prompts
        const imageUrls = await generateMatchingGameImages(gameData.imagePrompts);
        
        // Create text and image options separately, then pair them
        // Each option needs a unique ID that links text to its correct image
        const textOptions = gameData.textOptions.map((text, index) => ({
          id: `text-${index}`,
          text: text,
          correctImageIndex: index, // Link to the image at this index
          isCorrect: index === gameData.correctTextIndex
        }));

        const imageOptions = imageUrls.map((url, index) => ({
          id: `image-${index}`,
          imageUrl: url,
          correctTextIndex: index, // Link to the text at this index
          isCorrect: index === gameData.correctImageIndex
        }));

        // Shuffle both arrays
        const shuffledTexts = [...textOptions].sort(() => Math.random() - 0.5);
        const shuffledImages = [...imageOptions].sort(() => Math.random() - 0.5);
        
        // Create matching options: each text option paired with its correct image
        // But we'll use IDs to track which text matches which image
        const matchingOptions: MatchingOption[] = shuffledTexts.map((textOpt) => {
          // Find the image that matches this text (by original index)
          const matchingImage = shuffledImages.find(img => 
            img.correctTextIndex === textOptions.indexOf(textOptions.find(t => t.text === textOpt.text)!)
          ) || shuffledImages[0];
          
          return {
            id: textOpt.id, // Use text ID as the main ID
            text: textOpt.text,
            imageUrl: matchingImage.imageUrl,
            isCorrect: textOpt.isCorrect && matchingImage.isCorrect
          };
        });

        // Create 3 options: one correct pair, two wrong pairs
        // Each option has both text and image, and they're paired by ID
        const finalOptions: MatchingOption[] = [
          {
            id: 'pair-0',
            text: gameData.textOptions[0], // Correct term
            imageUrl: imageUrls[0], // Correct image (paired)
            isCorrect: true
          },
          {
            id: 'pair-1',
            text: gameData.textOptions[1], // Wrong term
            imageUrl: imageUrls[1], // Wrong image (paired)
            isCorrect: false
          },
          {
            id: 'pair-2',
            text: gameData.textOptions[2], // Wrong term
            imageUrl: imageUrls[2], // Wrong image (paired)
            isCorrect: false
          }
        ];

        // Shuffle the options so correct answer isn't always first
        const shuffled = [...finalOptions].sort(() => Math.random() - 0.5);

        setMatchingGameData(shuffled);
      }
    } catch (error) {
      console.error('Error generating matching game:', error);
      setShowMatchingGame(false);
    } finally {
      setIsLoadingMatchingGame(false);
    }
  };

  const handleMatchingGameComplete = async (isCorrect: boolean) => {
    setShowMatchingGame(false);
    setMatchingGameData(null);
    
    // After matching game, show drag and drop game
    const currentCard = flashcards[currentIndex];
    if (currentCard) {
      await loadDragAndDropGame(currentCard);
    }
  };

  const handleMatchingGameSkip = async () => {
    setShowMatchingGame(false);
    setMatchingGameData(null);
    
    // After skipping matching game, show drag and drop game
    const currentCard = flashcards[currentIndex];
    if (currentCard) {
      await loadDragAndDropGame(currentCard);
    }
  };

  const loadDragAndDropGame = async (card: Flashcard) => {
    setIsLoadingDragAndDrop(true);
    setShowDragAndDropGame(true);

    try {
      const gameData = await generateDragAndDropGame(topic, card.front, card.back);
      
      if (gameData) {
        // Generate images for items that need them
        const imageItems = gameData.items.filter(item => item.type === 'image' && item.imagePrompt);
        const imagePrompts = imageItems.map(item => item.imagePrompt!);
        const imageUrls = await generateDragAndDropImages(imagePrompts);

        // Create drag items with images
        let imageUrlIndex = 0;
        const dragItems: DragItem[] = gameData.items.map(item => ({
          id: item.id,
          content: item.content,
          type: item.type as 'text' | 'image',
          imageUrl: item.type === 'image' ? imageUrls[imageUrlIndex++] : undefined,
          isCorrect: item.isCorrect,
          dropZoneId: item.dropZoneId
        }));

        // Create drop zones
        const dropZones: DropZone[] = gameData.dropZones.map(zone => ({
          id: zone.id,
          label: zone.label,
          accepts: gameData.items.map(item => item.id), // All items can be dropped anywhere
          correctItemId: zone.correctItemId
        }));

        setDragAndDropItems(dragItems);
        setDragAndDropZones(dropZones);
      }
    } catch (error) {
      console.error('Error loading drag and drop game:', error);
      setShowDragAndDropGame(false);
    } finally {
      setIsLoadingDragAndDrop(false);
    }
  };

  const handleDragAndDropComplete = (isCorrect: boolean) => {
    setShowDragAndDropGame(false);
    setDragAndDropItems([]);
    setDragAndDropZones([]);
    // Continue to next card or show completion
  };

  const handleDragAndDropSkip = () => {
    setShowDragAndDropGame(false);
    setDragAndDropItems([]);
    setDragAndDropZones([]);
  };

  // Reset games when card changes
  useEffect(() => {
    setShowMatchingGame(false);
    setMatchingGameData(null);
    setShowDragAndDropGame(false);
    setDragAndDropItems([]);
    setDragAndDropZones([]);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed all cards
      setShowReward(true);
      setModuleState('completed');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleComplete = () => {
    setShowReward(false);
    if (onComplete) {
      onComplete();
    }
  };

  if (moduleState === 'loading') {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto pb-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (moduleState === 'completed') {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto pb-24">
        <RewardModal
          isOpen={showReward}
          onClose={handleComplete}
          type="badge"
          name="Thẻ học Thông thái"
        />
        <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border-[8px] border-white p-10 text-center">
          <div className="text-9xl mb-6 animate-bounce filter drop-shadow-xl">🎉</div>
          <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 mb-4">
            Hoàn thành!
          </h3>
          <p className="text-2xl text-gray-500 font-bold mb-8">
            Bé đã học xong tất cả {flashcards.length} thẻ học rồi! Giỏi quá! 🌟
          </p>
          <p className="text-lg text-gray-400 font-semibold mb-12">
            Bé đã lật thẻ {flippedCount} lần - rất chăm chỉ đấy!
          </p>
          <button
            onClick={handleComplete}
            className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-black text-xl py-5 px-12 rounded-full shadow-[0_15px_40px_rgba(168,85,247,0.4)] transform hover:scale-110 transition-all duration-300 border-4 border-white"
          >
            🎁 Hoàn thành
          </button>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  if (!currentCard) return null;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto pb-24">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
      {/* Header */}
      <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border-[8px] border-white mb-8">
        <div className={`bg-gradient-to-r ${themeColor?.gradient || 'from-blue-400 to-purple-400'} p-6 sm:p-10 border-b-[6px] border-white`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mr-6 border-2 border-white/50 text-4xl">
                🎴
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">
                  Học với Thẻ Lật
                </h2>
                <p className="text-white/90 font-bold text-lg">{topic}</p>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white shadow-lg">
              <span className="text-blue-600 font-black text-xl">
                {currentIndex + 1} / {flashcards.length}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-gray-100 h-4 relative overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Instructions Overlay - Hiển thị trước với background mờ */}
      {showInstructions && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
            showInstructions ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="bg-yellow-50 border-[4px] border-yellow-200 rounded-[2rem] p-8 shadow-2xl max-w-md mx-4 transform transition-all duration-1000">
            <div className="flex items-start">
              <span className="text-4xl mr-4">💡</span>
              <div>
                <h4 className="font-black text-yellow-800 text-2xl mb-4">Cách chơi:</h4>
                <ul className="text-yellow-700 font-semibold space-y-2 text-lg">
                  <li>• Chạm vào thẻ để lật và xem đáp án</li>
                  <li>• Dùng nút "Trước" / "Sau" để chuyển thẻ</li>
                  <li>• Học từng thẻ một cách cẩn thận nhé!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Matching Game - Hiển thị sau khi lật thẻ */}
      {showMatchingGame && (
        <div className="relative z-20 animate-fade-in mb-8">
          {isLoadingMatchingGame ? (
            <div className="bg-white rounded-[3rem] p-16 border-[6px] border-white shadow-lg">
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute top-0 left-0 w-full h-full border-[8px] border-purple-100 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-[8px] border-purple-500 rounded-full animate-spin border-t-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">🎨</div>
                </div>
                <p className="text-purple-600 font-black text-xl">Đang tạo trò chơi...</p>
              </div>
            </div>
          ) : matchingGameData ? (
            <MatchingGame
              correctTerm={currentCard.front}
              correctDefinition={currentCard.back}
              options={matchingGameData}
              onComplete={handleMatchingGameComplete}
              onSkip={handleMatchingGameSkip}
            />
          ) : null}
        </div>
      )}

      {/* Drag and Drop Game - Hiển thị sau khi hoàn thành matching game */}
      {showDragAndDropGame && (
        <div className="relative z-20 animate-fade-in mb-8">
          {isLoadingDragAndDrop ? (
            <div className="bg-white rounded-[3rem] p-16 border-[6px] border-white shadow-lg">
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute top-0 left-0 w-full h-full border-[8px] border-indigo-100 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-[8px] border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">🎯</div>
                </div>
                <p className="text-indigo-600 font-black text-xl">Đang tạo trò chơi kéo thả...</p>
              </div>
            </div>
          ) : dragAndDropItems.length > 0 && dragAndDropZones.length > 0 ? (
            <DragAndDropGame
              topic={topic}
              items={dragAndDropItems}
              dropZones={dragAndDropZones}
              onComplete={handleDragAndDropComplete}
              onSkip={handleDragAndDropSkip}
            />
          ) : null}
        </div>
      )}

      {/* Flip Card - Chỉ hiển thị sau khi box "Cách chơi" biến mất và không có games */}
      {showCard && !showMatchingGame && !showDragAndDropGame && (
        <div className="relative z-10 animate-fade-in">
          <FlipCard
            card={currentCard}
            index={currentIndex}
            total={flashcards.length}
            onFlip={handleFlip}
            onPlayGame={handlePlayGame}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={currentIndex < flashcards.length - 1}
            canGoPrevious={currentIndex > 0}
          />
        </div>
      )}
    </div>
  );
};

export default FlipCardModule;


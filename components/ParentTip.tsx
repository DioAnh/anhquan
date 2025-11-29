
import React, { useState, useRef, useEffect } from 'react';
import { generateParentGuidance } from '../services/geminiService';

interface ParentTipProps {
  staticContent?: string; // Original static advice
  aiContext?: {           // Dynamic context for AI generation (Optional now)
      situation: string;
      question: string;
  };
  placement?: 'top-right' | 'bottom-right';
  showAiBadge?: boolean;
}

const ParentTip: React.FC<ParentTipProps> = ({ staticContent, aiContext, placement = 'top-right', showAiBadge = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [advice, setAdvice] = useState<string>(staticContent || "");
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isBottom = placement === 'bottom-right';

  // Update advice when staticContent changes (e.g., when game loads)
  useEffect(() => {
    if (staticContent) {
        setAdvice(staticContent);
    }
  }, [staticContent]);

  // Reset state when aiContext changes (new game) if using fetch mode
  useEffect(() => {
      if (aiContext) {
          setHasFetched(false);
          if (!staticContent) setAdvice("");
      }
  }, [aiContext?.situation, aiContext?.question, staticContent]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = async () => {
      const nextState = !isOpen;
      setIsOpen(nextState);

      // Fetch AI advice if opening, have context, haven't fetched yet, AND no static content provided
      if (nextState && aiContext && !hasFetched && !staticContent) {
          setIsLoading(true);
          try {
              const generatedAdvice = await generateParentGuidance(aiContext.situation, aiContext.question);
              setAdvice(generatedAdvice);
              setHasFetched(true);
          } catch (e) {
              setAdvice("Ba mẹ hãy gợi mở để bé tự tìm ra giải pháp nhé!");
          } finally {
              setIsLoading(false);
          }
      }
  };

  const isAiContent = showAiBadge || (hasFetched && !!aiContext);

  // Helper to parse text containing **bold** syntax
  const renderFormattedText = (text: string) => {
      // Split by ** delimiter, capturing the delimiter to process it
      const parts = text.split(/(\*\*.*?\*\*)/g);
      
      return parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
              // Remove asterisks and style
              return (
                  <strong key={index} className="font-bold text-rose-600 bg-rose-50 px-1 rounded-md mx-0.5 border border-rose-100/50">
                      {part.slice(2, -2)}
                  </strong>
              );
          }
          return <span key={index}>{part}</span>;
      });
  };

  // Helper to clean raw lines
  const cleanAndSplitLines = (content: string) => {
    if (!content) return [];
    
    let text = content
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<li>/gi, '\n') // Replace html list items if any
        .replace(/<\/?[^>]+(>|$)/g, ""); // Strip other tags

    // Split by newlines or bullets (- )
    return text.split(/\n|•/).filter(line => {
        // Filter out empty lines or just bullets
        const trimmed = line.trim();
        return trimmed !== '' && trimmed !== '-' && trimmed !== '•';
    }).map(line => line.replace(/^-\s*/, '').trim()); // Remove leading dashes
  };

  const lines = cleanAndSplitLines(advice);

  return (
    <div 
      ref={containerRef} 
      className={`absolute z-40 ${isBottom ? 'bottom-6 right-6' : 'top-4 right-4'}`}
    >
      <button
        onClick={handleToggle}
        className={`
          flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 shadow-sm
          ${isOpen 
            ? 'bg-rose-100 border-rose-300 text-rose-600' 
            : 'bg-white/90 hover:bg-rose-50 border-gray-200 hover:border-rose-200 text-gray-500 hover:text-rose-500'
          }
        `}
        title="Góc phụ huynh"
      >
        <span className="text-2xl leading-none">👨‍👩‍👧</span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 w-80 sm:w-96 bg-white rounded-2xl p-6 shadow-xl border-[3px] border-rose-100 animate-pop-in z-50 ${isBottom ? 'bottom-14' : 'top-14'}`}>
            {/* Triangle arrow */}
            <div className={`absolute right-4 w-4 h-4 bg-white border-t-[3px] border-l-[3px] border-rose-100 transform ${isBottom ? '-bottom-2.5 -rotate-[135deg]' : '-top-2.5 rotate-45'}`}></div>
            
            <div className="flex items-start gap-4">
                <div className="text-3xl mt-1 animate-bounce-slow">💡</div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-black text-rose-500 uppercase tracking-wider flex items-center gap-2">
                            Lời khuyên cho Ba Mẹ
                        </h4>
                        {isAiContent && <span className="text-[10px] font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-2 py-0.5 rounded-full border border-blue-200 shadow-sm">AI Gemini</span>}
                    </div>
                    
                    {isLoading ? (
                        <div className="space-y-3 animate-pulse">
                            <div className="h-4 bg-rose-50 rounded w-3/4"></div>
                            <div className="h-4 bg-rose-50 rounded w-full"></div>
                            <div className="h-4 bg-rose-50 rounded w-5/6"></div>
                            <p className="text-xs text-rose-400 font-bold mt-2">Đang suy nghĩ gợi ý...</p>
                        </div>
                    ) : (
                        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                            <ul className="space-y-3">
                                {lines.map((line, i) => (
                                    <li key={i} className="flex items-start text-sm text-gray-600 leading-relaxed group">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-300 mt-2 mr-3 flex-shrink-0 group-hover:bg-rose-500 transition-colors"></span>
                                        <span>{renderFormattedText(line)}</span>
                                    </li>
                                ))}
                            </ul>
                            
                            {lines.length === 0 && !isLoading && (
                                <p className="text-gray-400 italic text-sm">Không có lời khuyên nào.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
      <style>{`
        .animate-pop-in { animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(${isBottom ? '10px' : '-10px'}); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-bounce-slow { animation: bounceSlow 2s infinite; }
        @keyframes bounceSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fecdd3; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default ParentTip;

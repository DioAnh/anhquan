
import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import ParentTip from './ParentTip';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (passed: boolean) => void;
  parentAdvice?: string;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete, parentAdvice }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption) {
      const newAnswers = [...answers, selectedOption];
      setAnswers(newAnswers);
      setSelectedOption(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        calculateScore(newAnswers);
        setShowResult(true);
      }
    }
  };
  
  const calculateScore = (finalAnswers: string[]) => {
      let correctCount = 0;
      finalAnswers.forEach((answer, index) => {
          if (answer === questions[index].correctAnswer) {
              correctCount++;
          }
      });
      const score = (correctCount / questions.length) * 100;
      onComplete(score > 90);
  };

  if (showResult) {
      return null;
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-sm border-[6px] border-indigo-100 relative mt-4">
      
      {/* Parent Support Tip */}
      <ParentTip 
        staticContent={parentAdvice || "Ba mẹ hãy khuyến khích bé đọc kỹ câu hỏi và tự đưa ra quyết định. Nếu bé chọn sai, hãy hỏi 'Tại sao con nghĩ vậy?' thay vì chỉ trích nhé!"} 
      />

      {/* Progress dots */}
      <div className="absolute top-6 right-8 flex space-x-2 mr-32 sm:mr-40">
        {questions.map((_, idx) => (
            <div key={idx} className={`w-3 h-3 rounded-full transition-colors ${idx === currentQuestionIndex ? 'bg-indigo-500' : idx < currentQuestionIndex ? 'bg-green-400' : 'bg-gray-200'}`}></div>
        ))}
      </div>

      <div className="mb-8 pr-12 mt-6 sm:mt-0">
        <span className="inline-block px-5 py-2 bg-indigo-100 text-indigo-600 font-black rounded-full mb-4 text-sm uppercase tracking-wider">
            Câu hỏi {currentQuestionIndex + 1} / {questions.length}
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-snug">{currentQuestion.question}</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-5">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={`w-full text-left p-5 sm:p-6 rounded-3xl border-[4px] transition-all duration-200 transform ${
              selectedOption === option
                ? 'bg-yellow-100 border-yellow-400 shadow-[0_6px_0_rgb(250,204,21)] -translate-y-1'
                : 'bg-white hover:bg-indigo-50 border-gray-100 hover:border-indigo-200 text-gray-600 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="flex items-center">
                <span className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black mr-5 text-xl transition-colors ${
                     selectedOption === option ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-100 text-gray-400'
                }`}>
                    {String.fromCharCode(65 + index)}
                </span>
                <span className={`font-bold text-xl leading-tight ${selectedOption === option ? 'text-yellow-900' : 'text-gray-600'}`}>
                    {option}
                </span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-10 flex justify-end">
        <button
            onClick={handleNextQuestion}
            disabled={!selectedOption}
            className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black text-xl py-5 px-12 rounded-[2rem] shadow-[0_8px_0_rgb(60,50,150)] disabled:shadow-none transform active:translate-y-2 active:shadow-none hover:-translate-y-1 transition-all duration-200"
        >
            {currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo ➜' : 'Hoàn thành 🎉'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;

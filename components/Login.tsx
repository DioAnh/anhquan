import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = () => {
    if (name.trim()) {
      setIsExiting(true);
      localStorage.setItem('userName', name.trim());
      setTimeout(() => {
          onLogin();
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce delay-1000"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 transform -translate-x-1/2"></div>

      <div className={`
        w-full max-w-lg bg-white/90 backdrop-blur-md border-[6px] border-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-8 md:p-12 text-center relative z-10 transition-all 
        ${isExiting ? 'animate-mist-exit pointer-events-none' : 'hover:scale-[1.02]'}
      `}>
        
        <div className="mb-6 inline-block bg-white p-6 rounded-full shadow-lg border-4 border-pink-100 transform -rotate-6 hover:rotate-6 transition-transform duration-300">
            <span className="text-7xl">🦄</span>
        </div>

        <h1 
            className="text-6xl md:text-7xl mb-4 tracking-wide text-gradient-flow"
            style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 900 }}
        >
          Hackathon
        </h1>
        <p className="text-gray-600 text-xl font-bold mb-10 leading-relaxed font-quicksand">
          Chào mừng bạn đến với<br/>ứng dụng của chúng tôi! 🌈
        </p>
        
        <div className="mb-8 relative group">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            placeholder="Tên của bạn là gì?"
            className="w-full px-8 py-6 text-2xl font-bold text-gray-700 bg-pink-50 border-[4px] border-pink-200 rounded-full focus:outline-none focus:border-pink-400 focus:bg-white placeholder-pink-300 transition-all duration-300 shadow-inner text-center font-quicksand"
            autoFocus
            disabled={isExiting}
          />
        </div>
        
        <button
          onClick={handleStart}
          disabled={!name.trim() || isExiting}
          className="w-full py-5 text-2xl font-extrabold text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-[0_8px_0_rgb(249,115,22)] hover:shadow-[0_12px_0_rgb(249,115,22)] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-4 border-orange-300/50 font-quicksand"
        >
            Bắt đầu thôi!
        </button>
      </div>

      <style>{`
        .text-gradient-flow {
            background-image: linear-gradient(
                -45deg, 
                #ff9a9e, #fecfef, #a18cd1, #8fd3f4, #84fab0, #f6d365
            );
            background-size: 400% 400%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: fluidFlow 8s ease-in-out infinite;
        }

        @keyframes fluidFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        @keyframes mistExit {
            0% { 
                opacity: 1; 
                transform: scale(1) translateY(0);
                filter: blur(0px);
            }
            100% { 
                opacity: 0; 
                transform: scale(1.5) translateY(-20px); 
                filter: blur(20px); 
            }
        }
        .animate-mist-exit {
            animation: mistExit 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .font-quicksand {
            font-family: 'Quicksand', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default Login;


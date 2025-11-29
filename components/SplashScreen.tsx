import React from 'react';

const SplashScreen: React.FC = () => {
  const floatingObjects = [
    { icon: '🌟', top: '15%', left: '10%', delay: '0s', duration: '3s' },
    { icon: '🚀', top: '20%', right: '15%', delay: '0.5s', duration: '4s' },
    { icon: '🌈', bottom: '20%', left: '20%', delay: '1s', duration: '3.5s' },
    { icon: '🦄', top: '30%', left: '50%', delay: '0.2s', duration: '3s' },
    { icon: '🍭', bottom: '30%', right: '10%', delay: '0.8s', duration: '2.5s' },
    { icon: '🎈', top: '10%', right: '30%', delay: '1.2s', duration: '4.5s' },
    { icon: '🎨', bottom: '15%', left: '40%', delay: '0.3s', duration: '3.2s' },
    { icon: '🎮', top: '40%', right: '5%', delay: '0.7s', duration: '3.8s' },
    { icon: '🧸', bottom: '40%', left: '5%', delay: '1.5s', duration: '4s' },
    { icon: '🍩', top: '5%', left: '30%', delay: '0.1s', duration: '2.8s' },
    { icon: '🍦', bottom: '10%', right: '40%', delay: '0.9s', duration: '3.6s' },
    { icon: '🧩', top: '50%', left: '10%', delay: '1.1s', duration: '3s' },
    { icon: '⚽', top: '60%', right: '20%', delay: '0.4s', duration: '2.5s' },
    { icon: '🎵', bottom: '50%', right: '5%', delay: '0.6s', duration: '3.5s' },
    { icon: '🌞', top: '5%', right: '5%', delay: '0s', duration: '5s' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-white/95 backdrop-blur-3xl">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-pink-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-white/0 to-white/90 z-10"></div>

      <div className="relative w-full h-full flex items-center justify-center z-20">
        <div className="w-full flex flex-col items-center justify-center relative animate-mist-fade">
             <h1 
                className="absolute blur-xl tracking-wide flex gap-2 opacity-40 pointer-events-none select-none"
                style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(5rem, 15vw, 10rem)', fontWeight: 900 }}
            >
                {['H', 'A', 'C', 'K', 'A', 'T', 'H', 'O', 'N'].map((char, index) => (
                    <span 
                        key={index}
                        className="animate-jelly-wave text-pink-300"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {char}
                    </span>
                ))}
             </h1>

            <h1 
                className="tracking-wide flex gap-1 sm:gap-2 drop-shadow-lg relative z-10"
                style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(5rem, 15vw, 10rem)', fontWeight: 900 }}
            >
                {['h', 'a', 'c', 'k', 'a', 't', 'h', 'o', 'n'].map((char, index) => (
                    <span 
                        key={index}
                        className="animate-jelly-wave text-gradient-flow inline-block"
                        style={{ 
                            animationDelay: `${index * 0.1}s`,
                        }}
                    >
                        {char}
                    </span>
                ))}
            </h1>
        </div>

        <div className="absolute inset-0 pointer-events-none animate-fade-out-particles">
             {floatingObjects.map((obj, idx) => (
                 <div 
                    key={idx}
                    className="absolute text-4xl sm:text-6xl animate-float-wild filter drop-shadow-md opacity-80"
                    style={{ 
                        top: obj.top, 
                        left: obj.left, 
                        right: obj.right, 
                        bottom: obj.bottom,
                        animationDelay: obj.delay,
                        animationDuration: obj.duration
                    }}
                 >
                     {obj.icon}
                 </div>
             ))}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(50px, -80px) scale(1.2); }
          66% { transform: translate(-40px, 40px) scale(0.8); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 5s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @keyframes mistFade {
            0% { 
                opacity: 0; 
                transform: scale(0.8) translateY(20px);
                filter: blur(10px);
            }
            15% { 
                opacity: 1; 
                transform: scale(1) translateY(0);
                filter: blur(0px);
            }
            75% {
                opacity: 1;
                transform: scale(1.05); 
                filter: blur(0px);
                letter-spacing: normal;
            }
            100% { 
                opacity: 0; 
                transform: scale(2.5); 
                filter: blur(30px); 
                letter-spacing: 50px; 
            }
        }
        .animate-mist-fade {
            animation: mistFade 5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes fadeOutParticles {
            0%, 80% { opacity: 1; }
            100% { opacity: 0; }
        }
        .animate-fade-out-particles {
            animation: fadeOutParticles 5s ease-out forwards;
        }

        @keyframes jellyWave {
            0%, 100% { 
                transform: translateY(0) scale(1, 1) rotate(0deg); 
            }
            30% { 
                transform: translateY(-15px) scale(1.1, 0.9) rotate(-3deg); 
            }
            60% { 
                transform: translateY(5px) scale(0.95, 1.05) rotate(3deg); 
            }
            80% {
                 transform: translateY(-5px) scale(1.02, 0.98) rotate(-1deg);
            }
        }
        .animate-jelly-wave {
            display: inline-block;
            animation: jellyWave 2s ease-in-out infinite;
            transform-origin: bottom center;
        }

        .text-gradient-flow {
            background-image: linear-gradient(
                -45deg, 
                #ff9a9e,
                #fecfef,
                #a18cd1,
                #8fd3f4,
                #84fab0,
                #f6d365
            );
            background-size: 400% 400%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: fluidFlow 8s ease-in-out infinite;
        }

        @keyframes fluidFlow {
            0% { background-position: 0% 50%; }
            25% { background-position: 50% 100%; }
            50% { background-position: 100% 50%; }
            75% { background-position: 50% 0%; }
            100% { background-position: 0% 50%; }
        }

        @keyframes floatWild {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(20px, -30px) rotate(10deg); }
            50% { transform: translate(-10px, 10px) rotate(-5deg) scale(1.1); }
            75% { transform: translate(15px, -20px) rotate(5deg); }
        }
        .animate-float-wild {
            animation: floatWild 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;


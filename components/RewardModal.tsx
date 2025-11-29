import React from 'react';
import { BadgeIcon, EpicBadgeIcon, CertificateIcon } from './IconComponents';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'badge' | 'epic-badge' | 'certificate' | null;
  name: string;
}

const RewardModal: React.FC<RewardModalProps> = ({ isOpen, onClose, type, name }) => {
  if (!isOpen) return null;

  const rewardDetails = {
    'badge': {
      title: 'Tuyệt đỉnh! Bé nhận được Huy hiệu!',
      icon: <BadgeIcon className="w-40 h-40 text-yellow-400 drop-shadow-xl filter" />,
      bg: 'bg-gradient-to-b from-yellow-100 to-orange-50',
      border: 'border-yellow-400',
      btn: 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-600/40'
    },
    'epic-badge': {
      title: 'Siêu cấp! Huy hiệu Đặc biệt cho bé!',
      icon: <EpicBadgeIcon className="w-48 h-48 text-red-500 drop-shadow-2xl filter" />,
      bg: 'bg-gradient-to-b from-red-100 to-pink-50',
      border: 'border-red-400',
      btn: 'bg-red-500 hover:bg-red-600 shadow-red-600/40'
    },
    'certificate': {
      title: 'Xuất sắc! Bé đã tốt nghiệp!',
      icon: <CertificateIcon className="w-56 h-56 text-blue-500 drop-shadow-2xl filter" />,
      bg: 'bg-gradient-to-b from-blue-100 to-indigo-50',
      border: 'border-blue-400',
      btn: 'bg-blue-500 hover:bg-blue-600 shadow-blue-600/40'
    }
  };

  const details = type ? rewardDetails[type] : null;
  if (!details) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-indigo-900/60 backdrop-blur-md transition-opacity animate-fade-in" onClick={onClose}></div>
      
      <div className={`relative bg-white rounded-[3.5rem] shadow-[0_0_100px_rgba(255,255,255,0.5)] p-8 md:p-10 max-w-md w-full text-center transform transition-all animate-pop-up border-[8px] border-white ${details.bg}`}>
        {/* Confetti Particles */}
        <div className="absolute -top-4 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-confetti-1"></div>
        <div className="absolute top-20 -right-4 w-6 h-6 bg-pink-400 rounded-sm animate-confetti-2"></div>
        <div className="absolute bottom-20 left-4 w-3 h-3 bg-blue-400 rounded-full animate-confetti-3"></div>
        <div className="absolute -bottom-2 right-12 w-5 h-5 bg-green-400 rounded-lg animate-confetti-4"></div>
        
        <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-8 px-2 leading-tight drop-shadow-sm">{details.title}</h2>
        
        <div className="my-8 flex justify-center animate-float relative">
            <div className="absolute inset-0 bg-white/30 blur-2xl rounded-full transform scale-75"></div>
            {details.icon}
        </div>
        
        <div className="bg-white/70 rounded-[2rem] p-6 mb-10 backdrop-blur-md border-2 border-white/50 shadow-sm">
            <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">PHẦN THƯỞNG</p>
            <p className="text-2xl md:text-3xl font-black text-gray-800">{name}</p>
        </div>
        
        <button
          onClick={onClose}
          className={`w-full ${details.btn} text-white font-black py-5 px-6 rounded-[2rem] text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl border-4 border-white/20`}
        >
          Tuyệt vời ông mặt trời! ☀️
        </button>
      </div>
      <style>{`
        @keyframes pop-up {
          0% { transform: scale(0.5) translateY(50px); opacity: 0; }
          50% { transform: scale(1.05) translateY(-10px); opacity: 1; }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes confetti-1 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(10px, -20px); } }
        @keyframes confetti-2 { 0%, 100% { transform: translate(0,0) rotate(0); } 50% { transform: translate(-15px, 10px) rotate(45deg); } }
        @keyframes confetti-3 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(5px, -15px); } }
        @keyframes confetti-4 { 0%, 100% { transform: translate(0,0) rotate(0); } 50% { transform: translate(-10px, -10px) rotate(-20deg); } }
        
        .animate-pop-up { animation: pop-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-confetti-1 { animation: confetti-1 2s ease-in-out infinite; }
        .animate-confetti-2 { animation: confetti-2 2.5s ease-in-out infinite; }
        .animate-confetti-3 { animation: confetti-3 1.8s ease-in-out infinite; }
        .animate-confetti-4 { animation: confetti-4 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default RewardModal;
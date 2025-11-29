import React from 'react';

interface DashboardProps {
    userName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userName }) => {
    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/60 backdrop-blur-xl border-[5px] border-white rounded-[3.5rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.08)] mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-700 mb-4">
                        Xin chào, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">{userName}</span>! 👋
                    </h2>
                    <p className="text-gray-600 font-bold text-lg">
                        Chào mừng bạn đến với Dashboard!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-[2rem] p-6 border-4 border-pink-100 shadow-lg">
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Thống kê</h3>
                        <p className="text-gray-500">Xem thống kê của bạn</p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 border-4 border-blue-100 shadow-lg">
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Mục tiêu</h3>
                        <p className="text-gray-500">Theo dõi mục tiêu</p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 border-4 border-yellow-100 shadow-lg">
                        <div className="text-4xl mb-4">🏆</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Thành tích</h3>
                        <p className="text-gray-500">Xem thành tích</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


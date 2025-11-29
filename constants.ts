
import { Theme, Achievement } from './types';

export const USER_LEVELS = [
  { level: 1, minPoints: 0, title: "Mầm Non Tập Sự", icon: "🌱" },
  { level: 2, minPoints: 50, title: "Chồi Non Ham Học", icon: "🌿" },
  { level: 3, minPoints: 150, title: "Ong Nhỏ Chăm Chỉ", icon: "🐝" },
  { level: 4, minPoints: 300, title: "Thỏ Con Nhanh Trí", icon: "🐰" },
  { level: 5, minPoints: 500, title: "Sóc Nhỏ Thông Minh", icon: "🐿️" },
  { level: 6, minPoints: 800, title: "Họa Mi Líu Lo", icon: "🐦" },
  { level: 7, minPoints: 1200, title: "Cá Heo Vui Vẻ", icon: "🐬" },
  { level: 8, minPoints: 1800, title: "Gấu Con Tốt Bụng", icon: "🐻" },
  { level: 9, minPoints: 2500, title: "Hươu Cao Cổ Thân Thiện", icon: "🦒" },
  { level: 10, minPoints: 3500, title: "Voi Con Dũng Cảm", icon: "🐘" },
  { level: 11, minPoints: 5000, title: "Thám Tử Tài Ba", icon: "🔍" },
  { level: 12, minPoints: 7000, title: "Nhà Thông Thái Nhí", icon: "🦉" },
  { level: 13, minPoints: 10000, title: "Hiệp Sĩ An Toàn", icon: "🛡️" },
  { level: 14, minPoints: 15000, title: "Phi Hành Gia Nhí", icon: "🚀" },
  { level: 15, minPoints: 25000, title: "Đội Trưởng Tương Lai", icon: "🌟" },
  { level: 16, minPoints: 40000, title: "Nhà Lãnh Đạo Nhí", icon: "👑" },
  { level: 17, minPoints: 60000, title: "Bậc Thầy Kỹ Năng", icon: "🎓" },
  { level: 18, minPoints: 80000, title: "Đại Sứ Trái Đất", icon: "🌏" },
  { level: 19, minPoints: 90000, title: "Huyền Thoại Nhí", icon: "🏆" },
  { level: 20, minPoints: 100000, title: "Chiến Binh Siêu Cấp", icon: "🦸‍♂️" },
];

export const ACHIEVEMENTS: Achievement[] = [
    // Total Lessons
    { id: 'lesson-1', title: 'Khởi đầu mới', description: 'Hoàn thành bài học đầu tiên', icon: '👶', type: 'totalLessons', target: 1, color: 'bg-blue-100 text-blue-600' },
    { id: 'lesson-5', title: 'Học sinh Chăm chỉ', description: 'Hoàn thành tổng cộng 5 bài học', icon: '📝', type: 'totalLessons', target: 5, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'lesson-10', title: 'Kiến thức Mở rộng', description: 'Hoàn thành tổng cộng 10 bài học', icon: '📚', type: 'totalLessons', target: 10, color: 'bg-purple-100 text-purple-600' },
    { id: 'lesson-20', title: 'Bách khoa Toàn thư', description: 'Hoàn thành tổng cộng 20 bài học', icon: '🧠', type: 'totalLessons', target: 20, color: 'bg-pink-100 text-pink-600' },
    { id: 'lesson-50', title: 'Chinh phục Đỉnh cao', description: 'Hoàn thành tổng cộng 50 bài học', icon: '🏔️', type: 'totalLessons', target: 50, color: 'bg-rose-100 text-rose-600' },
    
    // Daily Lessons
    { id: 'daily-3', title: 'Tốc độ Ánh sáng', description: 'Hoàn thành 3 bài học trong hôm nay', icon: '⚡', type: 'dailyLessons', target: 3, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'daily-5', title: 'Siêu nhân Học tập', description: 'Hoàn thành 5 bài học trong hôm nay', icon: '🦸', type: 'dailyLessons', target: 5, color: 'bg-orange-100 text-orange-600' },

    // Streaks
    { id: 'streak-3', title: 'Tập sự Bền bỉ', description: 'Học liên tiếp 3 ngày', icon: '🌱', type: 'streak', target: 3, color: 'bg-green-100 text-green-600' },
    { id: 'streak-7', title: 'Tuần lễ Vàng', description: 'Học liên tiếp 7 ngày', icon: '🗓️', type: 'streak', target: 7, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'streak-14', title: 'Thói quen Tốt', description: 'Học liên tiếp 14 ngày', icon: '🔥', type: 'streak', target: 14, color: 'bg-teal-100 text-teal-600' },
    { id: 'streak-30', title: 'Huyền thoại Kiên trì', description: 'Học liên tiếp 30 ngày', icon: '🏆', type: 'streak', target: 30, color: 'bg-cyan-100 text-cyan-600' },

    // Points
    { id: 'point-500', title: 'Tích tiểu thành đại', description: 'Đạt 500 điểm tích lũy', icon: '💰', type: 'points', target: 500, color: 'bg-lime-100 text-lime-600' },
    { id: 'point-1000', title: 'Triệu phú Điểm số', description: 'Đạt 1,000 điểm tích lũy', icon: '💎', type: 'points', target: 1000, color: 'bg-sky-100 text-sky-600' },
    { id: 'point-5000', title: 'Đại gia Tri thức', description: 'Đạt 5,000 điểm tích lũy', icon: '👑', type: 'points', target: 5000, color: 'bg-violet-100 text-violet-600' },
    { id: 'point-10000', title: 'Kho báu Vô tận', description: 'Đạt 10,000 điểm tích lũy', icon: '🗝️', type: 'points', target: 10000, color: 'bg-fuchsia-100 text-fuchsia-600' },

    // Levels
    { id: 'level-5', title: 'Sóc Nhỏ Thông Minh', description: 'Đạt cấp độ 5', icon: '🐿️', type: 'level', target: 5, color: 'bg-amber-100 text-amber-600' },
    { id: 'level-10', title: 'Voi Con Dũng Cảm', description: 'Đạt cấp độ 10', icon: '🐘', type: 'level', target: 10, color: 'bg-red-100 text-red-600' },
    { id: 'level-15', title: 'Đội Trưởng Tương Lai', description: 'Đạt cấp độ 15', icon: '🌟', type: 'level', target: 15, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'level-20', title: 'Chiến Binh Siêu Cấp', description: 'Đạt cấp độ 20', icon: '🦸‍♂️', type: 'level', target: 20, color: 'bg-purple-100 text-purple-600' },
];

export const THEMES: Theme[] = [
  {
    id: 'theme-1',
    title: 'Kỹ năng Giao tiếp',
    description: 'Học cách lắng nghe, chia sẻ và kết bạn với mọi người xung quanh.',
    certificate: { name: 'Chuyên gia Giao tiếp', icon: 'Certificate' },
    topics: [
      {
        id: 'topic-1-1',
        title: 'Lắng nghe & Thấu hiểu',
        epicBadge: { name: 'Bậc thầy Lắng nghe', icon: 'EpicBadge' },
        levels: [
          {
            id: 'level-1-1-1',
            level: 1,
            title: 'Nhập môn Lắng nghe',
            badge: { name: 'Tai Vàng', icon: 'Badge' },
            lessons: [
              { id: 'lesson-1-1-1-1', title: 'Tại sao phải lắng nghe?', videoId: 'QZGlLPBwjoY' },
              { id: 'lesson-1-1-1-2', title: 'Lắng nghe bằng cả tai và mắt', videoId: 'Vy2se1-bBD8' },
              { id: 'lesson-1-1-1-3', title: 'Không ngắt lời người khác', videoId: 'AJM57jqmv5g' },
              { id: 'lesson-1-1-1-4', title: 'Lễ phép trong nói chuyện với người lớn', videoId: 'bPvhZjO9VMk' },
              { id: 'lesson-1-1-1-5', title: 'Đặt câu hỏi để hiểu rõ hơn', videoId: 'S-mZ0bBs2z4' },
            ],
          },
        ],
      },
      {
        id: 'topic-1-2',
        title: 'Nói lời Cảm ơn & Xin lỗi',
        epicBadge: { name: 'Trái tim Lịch thiệp', icon: 'EpicBadge' },
        levels: [
           {
            id: 'level-1-2-1',
            level: 1,
            title: 'Lời nói diệu kỳ',
            badge: { name: 'Ngôi sao Lịch sự', icon: 'Badge' },
            lessons: [
              { id: 'lesson-1-2-1-1', title: 'Biết nói lời cảm ơn và xin lỗi', videoId: 'blMYxOPLc7Y' },
              { id: 'lesson-1-2-1-2', title: 'Khi nào nói lời cảm ơn', videoId: '-e8-jW2_Itg' },
              { id: 'lesson-1-2-1-3', title: 'Khi nào nói lời xin lỗi', videoId: 'CJ6kMIv__l0' },
              { id: 'lesson-1-2-1-4', title: 'Cách nói lời xin lỗi đúng đắn', videoId: 'uJbW2S4oXpQ' },
              { id: 'lesson-1-2-1-5', title: 'Thực hành Cảm ơn & Xin lỗi', videoId: 'r2Ofa-N4K-E' },
            ],
          },
        ]
      },
      {
        id: 'topic-1-3',
        title: 'Chia sẻ và Hợp tác',
        epicBadge: { name: 'Đồng đội Siêu sao', icon: 'EpicBadge' },
        levels: [
          {
            id: 'level-1-3-1',
            level: 1,
            title: 'Cùng nhau chung sức',
            badge: { name: 'Mảnh ghép Hoàn hảo', icon: 'Badge' },
            lessons: [
              { id: 'lesson-1-3-1-1', title: 'Bài học về sự chia sẻ', videoId: 'o9z4k4qXgSk' },
              { id: 'lesson-1-3-1-2', title: 'Làm việc nhóm thật vui', videoId: 'B2w-7a1Xy_E' },
              { id: 'lesson-1-3-1-3', title: 'Cùng nhau làm việc hiệu quả', videoId: 'uG_rXyXbS_c' },
              { id: 'lesson-1-3-1-4', title: 'Sức mạnh của tinh thần đồng đội', videoId: '5s_8pG5a7K4' },
              { id: 'lesson-1-3-1-5', title: 'Chơi cùng bạn bè', videoId: 'qH-Z4c-2g9M' },
            ],
          },
        ],
      },
       {
        id: 'topic-1-4',
        title: 'Giải quyết Xung đột',
        epicBadge: { name: 'Sứ giả Hòa bình', icon: 'EpicBadge' },
        levels: [
          {
            id: 'level-1-4-1',
            level: 1,
            title: 'Khi bạn bè cãi nhau',
            badge: { name: 'Cầu nối Yêu thương', icon: 'Badge' },
            lessons: [
              { id: 'lesson-1-4-1-1', title: 'Nói chuyện để hiểu nhau hơn', videoId: 'VNUz2g6y_OQ' },
              { id: 'lesson-1-4-1-2', title: 'Tìm cách giải quyết chung', videoId: '8-Yt0g-jJ7E' },
              { id: 'lesson-1-4-1-3', title: 'Học cách tha thứ', videoId: 'O-RgYd1s8kU' },
              { id: 'lesson-1-4-1-4', title: 'Làm hòa với bạn', videoId: 'E4xY1g4z_w' },
              { id: 'lesson-1-4-1-5', title: 'Xây dựng tình bạn bền chặt', videoId: 'wPqZ_s7t2kE' },
            ],
          },
        ],
      },
      {
        id: 'topic-1-5',
        title: 'Làm quen và Kết bạn',
        epicBadge: { name: 'Nhà ngoại giao Nhí', icon: 'EpicBadge' },
        levels: [
          {
            id: 'level-1-5-1',
            level: 1,
            title: 'Vòng tay bạn bè',
            badge: { name: 'Trái tim Rộng mở', icon: 'Badge' },
            lessons: [
              { id: 'lesson-1-5-1-1', title: 'Cách bắt đầu cuộc trò chuyện', videoId: 'b67y_g-23U' },
              { id: 'lesson-1-5-1-2', title: 'Mỉm cười và chào hỏi', videoId: 'Y4y-4e3_j8I' },
              { id: 'lesson-1-5-1-3', title: 'Tìm điểm chung với bạn', videoId: 'S-mZ0bBs2z4' },
              { id: 'lesson-1-5-1-4', title: 'Mời bạn cùng chơi', videoId: 'qH-Z4c-2g9M' },
              { id: 'lesson-1-5-1-5', title: 'Giữ gìn tình bạn', videoId: 'wPqZ_s7t2kE' },
            ],
          },
        ],
      }
    ],
  },
  {
    id: 'theme-2',
    title: 'Quản lý Cảm xúc',
    description: 'Nhận biết và điều hòa cảm xúc của bản thân một cách tích cực.',
    certificate: { name: 'Nhà thông thái Cảm xúc', icon: 'Certificate' },
    topics: [
      {
        id: 'topic-2-1',
        title: 'Nhận biết cảm xúc',
        epicBadge: { name: 'Gương mặt Cảm xúc', icon: 'EpicBadge' },
        levels: [
           {
            id: 'level-2-1-1',
            level: 1,
            title: 'Bảng màu cảm xúc',
            badge: { name: 'Người bạn Cảm xúc', icon: 'Badge' },
            lessons: [
              { id: 'lesson-2-1-1-1', title: 'Vui, Buồn, Giận, Sợ', videoId: '51lYAbCttAE' },
              { id: 'lesson-2-1-1-2', title: 'Cảm xúc tên là gì?', videoId: 'w1tfD5R1NM4' },
              { id: 'lesson-2-1-1-3', title: 'Bé Đang Cảm Thấy Thế Nào?', videoId: '51lYAbCttAE&t=2s' },
              { id: 'lesson-2-1-1-4', title: 'Kỹ năng kiềm chế sự nóng giận', videoId: 'mClBkFwKcZs' },
              { id: 'lesson-2-1-1-5', title: 'Vẽ lại cảm xúc của bạn', videoId: 'ham3o-D6g5s' },
            ],
          },
        ]
      },
      {
        id: 'topic-2-2',
        title: 'Đối phó với Cơn giận',
        epicBadge: { name: 'Chiến binh Bình tĩnh', icon: 'EpicBadge' },
        levels: [
           {
            id: 'level-2-2-1',
            level: 1,
            title: 'Hạ hỏa nào!',
            badge: { name: 'Suối nguồn Mát lạnh', icon: 'Badge' },
            lessons: [
              { id: 'lesson-2-2-1-1', title: 'Khi tớ tức giận', videoId: 'O1_EwOLRT3c' },
              { id: 'lesson-2-2-1-2', title: 'Hít thở thật sâu', videoId: 'T_i_8l0t_nQ' },
              { id: 'lesson-2-2-1-3', title: 'Đếm đến 10', videoId: '2n-Y_Yh-Y_Y' },
              { id: 'lesson-2-2-1-4', title: 'Tìm một nơi yên tĩnh', videoId: 'z-Pq8R-r_Rk' },
              { id: 'lesson-2-2-1-5', title: 'Nói ra cơn giận một cách nhẹ nhàng', videoId: 'uJbW2S4oXpQ' },
            ],
          },
        ]
      },
      {
        id: 'topic-2-3',
        title: 'Vượt qua Nỗi buồn',
        epicBadge: { name: 'Tia nắng Ấm áp', icon: 'EpicBadge' },
        levels: [
           {
            id: 'level-2-3-1',
            level: 1,
            title: 'Sau cơn mưa, trời lại sáng',
            badge: { name: 'Cầu vồng Vui vẻ', icon: 'Badge' },
            lessons: [
              { id: 'lesson-2-3-1-1', title: 'Khi tớ cảm thấy buồn', videoId: '8fI7r_h6M1c' },
              { id: 'lesson-2-3-1-2', title: 'Nói chuyện với người mình tin tưởng', videoId: 'u-3i22gX4oE' },
              { id: 'lesson-2-3-1-3', title: 'Làm điều mình thích để vui hơn', videoId: 'ham3o-D6g5s' },
              { id: 'lesson-2-3-1-4', title: 'Khóc cũng không sao cả', videoId: 'z_pD8-g-r_s' },
              { id: 'lesson-2-3-1-5', title: 'Nhớ về những kỷ niệm vui', videoId: 'e4k_y-5r_tY' },
            ],
          },
        ]
      },
      {
        id: 'topic-2-4',
        title: 'Chia sẻ cảm xúc tích cực',
        epicBadge: { name: 'Đại sứ Niềm vui', icon: 'EpicBadge' },
        levels: [
           {
            id: 'level-2-4-1',
            level: 1,
            title: 'Lan tỏa yêu thương',
            badge: { name: 'Trái tim Hạnh phúc', icon: 'Badge' },
            lessons: [
              { id: 'lesson-2-4-1-1', title: 'Niềm vui được chia sẻ', videoId: 'h-6m_y-2f_w' },
              { id: 'lesson-2-4-1-2', title: 'Khen ngợi bạn bè', videoId: 'Rybni_r6d70' },
              { id: 'lesson-2-4-1-3', title: 'Lòng biết ơn', videoId: 'lqj2I65TVDI' },
              { id: 'lesson-2-4-1-4', title: 'Tạo bất ngờ cho người thân', videoId: 'a_b_c_d_e_f' },
              { id: 'lesson-2-4-1-5', title: 'Nụ cười là một món quà', videoId: 'Y4y-4e3_j8I' },
            ],
          },
        ]
      },
    ],
  },
  {
    id: 'theme-3',
    title: 'Kỹ năng Giải quyết Vấn đề',
    description: 'Học cách suy nghĩ, tìm ra nguyên nhân và giải pháp cho các vấn đề gặp phải.',
    certificate: { name: 'Bậc thầy Xử lý Tình huống', icon: 'Certificate' },
    topics: [
      {
        id: 'topic-3-1',
        title: 'Tư duy Sáng tạo',
        epicBadge: { name: 'Nhà Sáng chế Nhí', icon: 'EpicBadge' },
        levels: [
           {
            id: 'level-3-1-1',
            level: 1,
            title: 'Những ý tưởng bất ngờ',
            badge: { name: 'Bóng đèn Sáng kiến', icon: 'Badge' },
            lessons: [
              { id: 'lesson-3-1-1-1', title: 'Vấn đề là gì?', videoId: 'Hj63Q4aJ2K4' },
              { id: 'lesson-3-1-1-2', title: 'Nghĩ khác đi một chút', videoId: 'RGuE0jT57XU' },
              { id: 'lesson-3-1-1-3', title: 'Thử nhiều cách khác nhau', videoId: '7y_nKyj6sLY' },
              { id: 'lesson-3-1-1-4', title: 'Đừng sợ mắc lỗi', videoId: 'c6gPAz4Vbco' },
              { id: 'lesson-3-1-1-5', title: 'Kết hợp những điều quen thuộc', videoId: 'p1i31x8gG6U' },
            ],
          },
        ]
      },
      {
        id: 'topic-3-2',
        title: 'Xác định Vấn đề',
        epicBadge: { name: 'Thám tử Tài ba', icon: 'EpicBadge' },
        levels: [
           {
            id: 'level-3-2-1',
            level: 1,
            title: 'Truy tìm manh mối',
            badge: { name: 'Kính lúp Thông thái', icon: 'Badge' },
            lessons: [
              { id: 'lesson-3-2-1-1', title: 'Chuyện gì đang xảy ra?', videoId: 'Hj63Q4aJ2K4' },
              { id: 'lesson-3-2-1-2', title: 'Tại sao lại có chuyện này?', videoId: 'S-mZ0bBs2z4' },
              { id: 'lesson-3-2-1-3', title: 'Vấn đề thực sự là gì?', videoId: 'RGuE0jT57XU' },
              { id: 'lesson-3-2-1-4', title: 'Phân tích nguyên nhân', videoId: 'u-3i22gX4oE' },
              { id: 'lesson-3-2-1-5', title: 'Vẽ sơ đồ vấn đề', videoId: 'p1i31x8gG6U' },
            ],
          },
        ]
      },
      {
        id: 'topic-3-3',
        title: 'Tìm kiếm Giải pháp',
        epicBadge: { name: 'Kiến trúc sư Ý tưởng', icon: 'EpicBadge' },
        levels: [
           {
            id: 'level-3-3-1',
            level: 1,
            title: 'Xây dựng kế hoạch',
            badge: { name: 'Chìa khóa Vạn năng', icon: 'Badge' },
            lessons: [
              { id: 'lesson-3-3-1-1', title: 'Nghĩ ra nhiều ý tưởng', videoId: 'RGuE0jT57XU' },
              { id: 'lesson-3-3-1-2', title: 'Hỏi ý kiến người khác', videoId: 'S-mZ0bBs2z4' },
              { id: 'lesson-3-3-1-3', title: 'Ưu và nhược điểm của mỗi cách', videoId: 'c6gPAz4Vbco' },
              { id: 'lesson-3-3-1-4', title: 'Cách nào là tốt nhất?', videoId: '7y_nKyj6sLY' },
              { id: 'lesson-3-3-1-5', title: 'Lên kế hoạch thực hiện', videoId: 'p1i31x8gG6U' },
            ],
          },
        ]
      },
      {
        id: 'topic-3-4',
        title: 'Ra quyết định',
        epicBadge: { name: 'Thuyền trưởng Can đảm', icon: 'EpicBadge' },
        levels: [
           {
            id: 'level-3-4-1',
            level: 1,
            title: 'Lựa chọn của em',
            badge: { name: 'La bàn Định hướng', icon: 'Badge' },
            lessons: [
              { id: 'lesson-3-4-1-1', title: 'Lựa chọn và kết quả', videoId: '4n-j_h_o_c_h_o_n' },
              { id: 'lesson-3-4-1-2', title: 'Suy nghĩ về hậu quả', videoId: 'c6gPAz4Vbco' },
              { id: 'lesson-3-4-1-3', title: 'Tự tin vào quyết định của mình', videoId: 'RGuE0jT57XU' },
              { id: 'lesson-3-4-1-4', title: 'Khi nào cần nhờ người lớn giúp?', videoId: 'b0-v22T-3XQ' },
              { id: 'lesson-3-4-1-5', title: 'Học từ những lựa chọn sai', videoId: '7y_nKyj6sLY' },
            ],
          },
        ]
      },
    ],
  },
  {
    id: 'theme-4',
    title: 'An toàn cho Em',
    description: 'Trang bị kiến thức để tự bảo vệ bản thân khỏi những nguy hiểm tiềm ẩn.',
    certificate: { name: 'Hiệp sĩ An toàn', icon: 'Certificate' },
    topics: [
      {
        id: 'topic-4-1',
        title: 'An toàn với người lạ',
        epicBadge: { name: 'Lá chắn Bảo vệ', icon: 'EpicBadge' },
        levels: [
           {
            id: 'level-4-1-1',
            level: 1,
            title: 'Quy tắc "Không"',
            badge: { name: 'Người bạn Cảnh giác', icon: 'Badge' },
            lessons: [
              { id: 'lesson-4-1-1-1', title: 'Người lạ là ai?', videoId: '0-ufz4qGjsU' },
              { id: 'lesson-4-1-1-2', title: 'Không đi theo người lạ', videoId: 'R1xohGqrbPM' },
              { id: 'lesson-4-1-1-3', title: 'Không nhận quà từ người lạ', videoId: 'Jg-d1g-l6oY' },
              { id: 'lesson-4-1-1-4', title: 'Hét to, nói "Không" và bỏ chạy', videoId: 'I9-42b7w-mo' },
              { id: 'lesson-4-1-1-5', title: 'Vòng tròn tin cậy của em', videoId: 'b0-v22T-3XQ' },
            ],
          },
        ]
      },
      {
        id: 'topic-4-2',
        title: 'An toàn Giao thông',
        epicBadge: { name: 'Dũng sĩ Đường phố', icon: 'EpicBadge' },
        levels: [
           {
            id: 'level-4-2-1',
            level: 1,
            title: 'Em đi qua ngã tư đường phố',
            badge: { name: 'Ngôi sao Giao thông', icon: 'Badge' },
            lessons: [
              { id: 'lesson-4-2-1-1', title: 'Đèn xanh, đèn đỏ', videoId: 'fwszY2R9wM4' },
              { id: 'lesson-4-2-1-2', title: 'Đi bộ trên vỉa hè', videoId: 'T88i-M3t_gI' },
              { id: 'lesson-4-2-1-3', title: 'Qua đường ở vạch kẻ trắng', videoId: 'tM2l-z-q2C0' },
              { id: 'lesson-4-2-1-4', title: 'Luôn đi cùng người lớn', videoId: 'V4m_C_q-s_4k' },
              { id: 'lesson-4-2-1-5', title: 'Đội mũ bảo hiểm khi đi xe đạp, xe máy', videoId: 'G5d2tH8_sJc' },
            ],
          },
        ]
      },
      {
        id: 'topic-4-3',
        title: 'An toàn trên Mạng',
        epicBadge: { name: 'Siêu anh hùng Internet', icon: 'EpicBadge' },
        levels: [
           {
            id: 'level-4-3-1',
            level: 1,
            title: 'Lướt net thông minh',
            badge: { name: 'Tấm khiên Online', icon: 'Badge' },
            lessons: [
              { id: 'lesson-4-3-1-1', title: 'Không nói chuyện với người lạ trên mạng', videoId: 'kC4b-j-7sJk' },
              { id: 'lesson-4-3-1-2', title: 'Không chia sẻ thông tin cá nhân', videoId: 'N_5-s_j_k_2_w' },
              { id: 'lesson-4-3-1-3', title: 'Hỏi bố mẹ trước khi tải về', videoId: 'S-mZ0bBs2z4' },
              { id: 'lesson-4-3-1-4', title: 'Gặp điều xấu, nói ngay với người lớn', videoId: 'I9-42b7w-mo' },
              { id: 'lesson-4-3-1-5', title: 'Thời gian sử dụng mạng hợp lý', videoId: 'z-9g-8h-7j_k' },
            ],
          },
        ]
      },
      {
        id: 'topic-4-4',
        title: 'Phòng chống Bắt nạt',
        epicBadge: { name: 'Trái tim Dũng cảm', icon: 'EpicBadge' },
        levels: [
           {
            id: 'level-4-4-1',
            level: 1,
            title: 'Bảo vệ bản thân và bạn bè',
            badge: { name: 'Vòng tay Đoàn kết', icon: 'Badge' },
            lessons: [
              { id: 'lesson-4-4-1-1', title: 'Bắt nạt là gì?', videoId: '_iG_c_z_z_x_U_w' },
              { id: 'lesson-4-4-1-2', title: 'Dũng cảm nói "Dừng lại đi!"', videoId: 'I9-42b7w-mo' },
              { id: 'lesson-4-4-1-3', title: 'Nói với thầy cô hoặc bố mẹ', videoId: 'b0-v22T-3XQ' },
              { id: 'lesson-4-4-1-4', title: 'Giúp đỡ bạn khi bị bắt nạt', videoId: 'wPqZ_s7t2kE' },
              { id: 'lesson-4-4-1-5', title: 'Mỗi chúng ta đều đặc biệt', videoId: 'c_h_u_n_g_t_a' },
            ],
          },
        ]
      },
    ],
  },
  {
    id: 'theme-5',
    title: 'Quản lý Tài chính Nhí',
    description: 'Hiểu về giá trị của tiền, cách tiết kiệm và chi tiêu thông minh ngay từ bé.',
    certificate: { name: 'Chuyên gia Tài chính Nhí', icon: 'Certificate' },
    topics: [
      {
        id: 'topic-5-1',
        title: 'Tiền là gì?',
        epicBadge: { name: 'Kho báu Kiến thức', icon: 'EpicBadge' },
        levels: [
          {
            id: 'level-5-1-1',
            level: 1,
            title: 'Bí mật của đồng tiền',
            badge: { name: 'Đồng xu Thông thái', icon: 'Badge' },
            lessons: [
              { id: 'lesson-5-1-1-1', title: 'Tiền dùng để làm gì?', videoId: 'vid_money_uses' },
              { id: 'lesson-5-1-1-2', title: 'Tiền từ đâu mà có?', videoId: 'vid_money_origin' },
              { id: 'lesson-5-1-1-3', title: 'Các mệnh giá tiền Việt Nam', videoId: 'vid_vnd_currency' },
              { id: 'lesson-5-1-1-4', title: 'Giữ gìn tiền cẩn thận', videoId: 'vid_keep_money' },
              { id: 'lesson-5-1-1-5', title: 'Lao động tạo ra giá trị', videoId: 'vid_work_value' },
            ],
          },
        ],
      },
      {
        id: 'topic-5-2',
        title: 'Siêu nhân Tiết kiệm',
        epicBadge: { name: 'Heo đất Vàng', icon: 'EpicBadge' },
        levels: [
          {
            id: 'level-5-2-1',
            level: 1,
            title: 'Nuôi heo đất',
            badge: { name: 'Hũ gạo Tiết kiệm', icon: 'Badge' },
            lessons: [
              { id: 'lesson-5-2-1-1', title: 'Tại sao phải tiết kiệm?', videoId: 'vid_why_save' },
              { id: 'lesson-5-2-1-2', title: 'Mục tiêu tiết kiệm của bé', videoId: 'vid_save_goal' },
              { id: 'lesson-5-2-1-3', title: 'Phân biệt "Cần" và "Muốn"', videoId: 'vid_need_vs_want' },
              { id: 'lesson-5-2-1-4', title: 'Tự làm hộp tiết kiệm', videoId: 'vid_diy_piggy' },
              { id: 'lesson-5-2-1-5', title: 'Kiên nhẫn để đạt mục tiêu', videoId: 'vid_patience' },
            ],
          },
        ],
      },
      {
        id: 'topic-5-3',
        title: 'Chi tiêu Thông minh',
        epicBadge: { name: 'Nhà Quản lý Tài ba', icon: 'EpicBadge' },
        levels: [
          {
            id: 'level-5-3-1',
            level: 1,
            title: 'Đi chợ cùng mẹ',
            badge: { name: 'Giỏ hàng Thông minh', icon: 'Badge' },
            lessons: [
              { id: 'lesson-5-3-1-1', title: 'So sánh giá cả', videoId: 'vid_compare_price' },
              { id: 'lesson-5-3-1-2', title: 'Lên danh sách trước khi mua', videoId: 'vid_shopping_list' },
              { id: 'lesson-5-3-1-3', title: 'Không đòi hỏi vô lý', videoId: 'vid_no_tantrum' },
              { id: 'lesson-5-3-1-4', title: 'Kiểm tra hàng hóa', videoId: 'vid_check_goods' },
              { id: 'lesson-5-3-1-5', title: 'Chia sẻ với người khó khăn', videoId: 'vid_charity' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'theme-6',
    title: 'Kỹ năng Tự lập',
    description: 'Học cách tự chăm sóc bản thân và giúp đỡ bố mẹ những việc vừa sức.',
    certificate: { name: 'Ngôi sao Tự lập', icon: 'Certificate' },
    topics: [
      {
        id: 'topic-6-1',
        title: 'Tự chăm sóc bản thân',
        epicBadge: { name: 'Bé Ngoan Tự giác', icon: 'EpicBadge' },
        levels: [
          {
            id: 'level-6-1-1',
            level: 1,
            title: 'Vệ sinh sạch sẽ',
            badge: { name: 'Gương mặt Sáng ngời', icon: 'Badge' },
            lessons: [
              { id: 'lesson-6-1-1-1', title: 'Đánh răng đúng cách', videoId: 'vid_brush_teeth' },
              { id: 'lesson-6-1-1-2', title: 'Rửa tay sạch khuẩn', videoId: 'vid_wash_hands' },
              { id: 'lesson-6-1-1-3', title: 'Tự tắm gội', videoId: 'vid_bath_time' },
              { id: 'lesson-6-1-1-4', title: 'Tự mặc quần áo', videoId: 'vid_dressing' },
              { id: 'lesson-6-1-1-5', title: 'Giữ gìn đầu tóc gọn gàng', videoId: 'vid_hair_care' },
            ],
          },
        ],
      },
      {
        id: 'topic-6-2',
        title: 'Việc nhà thật đơn giản',
        epicBadge: { name: 'Trợ thủ Đắc lực', icon: 'EpicBadge' },
        levels: [
          {
            id: 'level-6-2-1',
            level: 1,
            title: 'Giúp mẹ một tay',
            badge: { name: 'Chổi vàng Chăm chỉ', icon: 'Badge' },
            lessons: [
              { id: 'lesson-6-2-1-1', title: 'Gấp quần áo gọn gàng', videoId: 'vid_fold_clothes' },
              { id: 'lesson-6-2-1-2', title: 'Dọn dẹp đồ chơi sau khi chơi', videoId: 'vid_cleanup_toys' },
              { id: 'lesson-6-2-1-3', title: 'Lau bàn ghế', videoId: 'vid_clean_table' },
              { id: 'lesson-6-2-1-4', title: 'Tưới cây', videoId: 'vid_watering' },
              { id: 'lesson-6-2-1-5', title: 'Sắp xếp giày dép', videoId: 'vid_shoes_tidy' },
            ],
          },
        ],
      },
      {
        id: 'topic-6-3',
        title: 'Quản lý Thời gian',
        epicBadge: { name: 'Đồng hồ Tích tắc', icon: 'EpicBadge' },
        levels: [
          {
            id: 'level-6-3-1',
            level: 1,
            title: 'Thời gian biểu của bé',
            badge: { name: 'Người bạn Đúng giờ', icon: 'Badge' },
            lessons: [
              { id: 'lesson-6-3-1-1', title: 'Lập thời gian biểu hàng ngày', videoId: 'vid_schedule' },
              { id: 'lesson-6-3-1-2', title: 'Thức dậy đúng giờ', videoId: 'vid_wakeup' },
              { id: 'lesson-6-3-1-3', title: 'Học ra học, chơi ra chơi', videoId: 'vid_focus' },
              { id: 'lesson-6-3-1-4', title: 'Không trì hoãn', videoId: 'vid_no_procrastinate' },
              { id: 'lesson-6-3-1-5', title: 'Đi ngủ sớm', videoId: 'vid_sleep_early' },
            ],
          },
        ],
      },
    ],
  },
];
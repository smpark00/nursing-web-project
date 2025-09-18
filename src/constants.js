// Animation and timing constants
export const ANIMATION_DURATION = 2000;
export const UPDATE_INTERVAL = 5000;
export const CLOCK_UPDATE_INTERVAL = 1000;
export const ANIMATION_STEPS = 60;

// Chart colors
export const CHART_COLORS = {
  purple: '#9B59B6',
  yellow: '#F1C40F',
  blue: '#3498DB',
  success: '#27AE60',
  danger: '#E74C3C'
};

// Target values for animations
export const TARGET_VALUES = {
  learners: 124684,
  achievement: 93,
  progress: 29300,
  utilization: 122, // 2시간 2분 in minutes
  attendance: 80,
  usageTime: 83 // 1시간 23분 in minutes
};

// Graph data
export const GRAPH_DATA = [
  { month: '1월', value: 45, date: '1월 15일' },
  { month: '2월', value: 52, date: '2월 12일' },
  { month: '3월', value: 48, date: '3월 18일' },
  { month: '4월', value: 61, date: '4월 22일' },
  { month: '5월', value: 58, date: '5월 16일' },
  { month: '6월', value: 67, date: '6월 20일' },
  { month: '7월', value: 63, date: '7월 14일' },
  { month: '8월', value: 71, date: '8월 19일' },
  { month: '9월', value: 56, date: '9월 14일' },
  { month: '10월', value: 78, date: '10월 21일' },
  { month: '11월', value: 82, date: '11월 17일' },
  { month: '12월', value: 89, date: '12월 23일' }
];

// Bar chart data
export const BAR_DATA = [
  { label: '지식 점수', value: 85 },
  { label: '안전/무균', value: 78 },
  { label: '의사소통', value: 95 },
  { label: '시간', value: 72 },
  { label: '동작/자세', value: 88 },
];

// Menu items
export const MENU_ITEMS = {
  MAIN: [
    { id: '대시보드', label: '대시보드', icon: '🏠' },
    { id: '학생', label: '학생', icon: '👥' },
    { id: '평가', label: '평가', icon: '🎓' },
    { id: '출결', label: '출결', icon: '✅' },
    { id: '실습 로그', label: '실습 로그', icon: '📦' },
    { id: '학습 성과 리포트', label: '학습 성과 리포트', icon: '📊' },
    { id: '메시지', label: '메시지', icon: '💬' }
  ],
  OTHER: [
    { id: '프로필', label: '프로필', icon: '👤' },
    { id: '설정', label: '설정', icon: '⚙️' },
    { id: '로그아웃', label: '로그아웃', icon: '🚪' }
  ]
};

// Week options
export const WEEK_OPTIONS = ['1주차', '2주차', '3주차'];

// Grade options
export const GRADE_OPTIONS = ['Grade 3', 'Grade 2', 'Grade 1'];

// Month names
export const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

// Weekday names
export const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Student page data
export const STUDENT_DATA = {
  profile: {
    name: "김O윤",
    studentId: "202510325",
    grade: "3학년 / 1반",
    contact: "5678010-1234-5678"
  },
  metrics: {
    attendance: "출석",
    studioTime: "3시간 52분",
    recentScore: "74점",
    vrParticipation: "완료"
  },
  achievement: 80,
  scoreTrend: [
    { date: "09/10", score: 65 },
    { date: "09/11", score: 68 },
    { date: "09/12", score: 72 },
    { date: "09/13", score: 70 },
    { date: "09/14", score: 70 },
    { date: "09/15", score: 75 },
    { date: "09/16", score: 78 }
  ],
  vrEvaluation: [
    { item: "정확도", score: 22.5, total: 30 },
    { item: "시간", score: 22.5, total: 30 },
    { item: "동작/자세", score: 11.7, total: 15 },
    { item: "안전/무균", score: 13.6, total: 20 },
    { item: "의사소통", score: 6.5, total: 10 },
    { item: "종합 성과", score: 7.2, total: 10 }
  ],
  comparison: [
    { category: "성취율", student: 80, classAverage: 70 },
    { category: "오류율", student: 20, classAverage: 30 },
    { category: "학습시간", student: 60, classAverage: 50 }
  ],
  vrSession: {
    executionCount: 8,
    totalTime: "11시간 2분",
    lastExecution: "5일 전"
  },
  memos: [
    { title: "실습실 공지, 과제 제출 현황", date: "2025.09.25" },
    { title: "실습실 공지, 과제 제출 현황", date: "2025.09.22" },
    { title: "실습실 공지, 과제 제출 현황", date: "2025.09.13" },
    { title: "실습실 공지, 과제 제출 현황", date: "2025.09.11" }
  ],
  studentList: [
    { id: "202510001", name: "김지수", grade: "3학년/1반", contact: "010-1234-5678", attendance: "출석", studioTime: "2시간 21분", score: 78, vrStatus: "완료" },
    { id: "202510012", name: "김지현", grade: "3학년/2반", contact: "010-1234-5678", attendance: "출석", studioTime: "2시간 21분", score: 78, vrStatus: "진행중" },
    { id: "202510325", name: "김재은", grade: "4학년/1반", contact: "010-1234-5678", attendance: "출석", studioTime: "2시간 21분", score: 78, vrStatus: "완료" },
    { id: "202510782", name: "나현성", grade: "2학년/4반", contact: "010-1234-5678", attendance: "출석", studioTime: "2시간 21분", score: 78, vrStatus: "완료" },
    { id: "202510012", name: "김지수", grade: "1학년/3반", contact: "010-1234-5678", attendance: "출석", studioTime: "2시간 21분", score: 83, vrStatus: "미수행" }
  ]
};

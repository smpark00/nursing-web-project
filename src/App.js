import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import gridatechLogo from './logo/gridatech.avif';
import { 
  TARGET_VALUES,
  GRAPH_DATA,
  BAR_DATA,
  MENU_ITEMS,
  WEEK_OPTIONS,
  GRADE_OPTIONS,
  MONTH_NAMES,
  WEEKDAY_NAMES,
  STUDENT_DATA
} from './constants';
import { 
  formatTime, 
  formatMonthYear, 
  getSeoulTime, 
  getCalendarData,
  validateGraphData,
  validateBarData,
  formatNumber
} from './utils';

function App() {
  // State for interactive features
  const [activeMenu, setActiveMenu] = useState('대시보드');
  const [selectedWeek, setSelectedWeek] = useState('1주차');
  const [selectedGrade, setSelectedGrade] = useState('Grade 3');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(22); // 22일이 선택된 상태
  const [selectedMonth, setSelectedMonth] = useState('9월'); // 선택된 월
  const [hoveredPoint, setHoveredPoint] = useState(null); // 호버된 데이터 포인트
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 상태
  const [liveData] = useState({
    onlineUsers: 0,
    newMessages: 0,
    currentTime: getSeoulTime(),
    isLive: true
  });
  const [animatedValues, setAnimatedValues] = useState({
    learners: 0,
    achievement: 0,
    progress: 0,
    utilization: 0,
    attendance: 0,
    usageTime: 0
  });

  // Animation effect for numbers - 비활성화
  // useEffect(() => {
  //   const stepDuration = ANIMATION_DURATION / ANIMATION_STEPS;
  //   let currentStep = 0;
  //   let timer = null;

  //   try {
  //     timer = setInterval(() => {
  //     currentStep++;
  //       const progress = currentStep / ANIMATION_STEPS;
      
  //     setAnimatedValues({
  //         learners: Math.floor(TARGET_VALUES.learners * progress),
  //         achievement: Math.floor(TARGET_VALUES.achievement * progress),
  //         progress: Math.floor(TARGET_VALUES.progress * progress),
  //         utilization: Math.floor(TARGET_VALUES.utilization * progress),
  //         attendance: Math.floor(TARGET_VALUES.attendance * progress),
  //         usageTime: Math.floor(TARGET_VALUES.usageTime * progress)
  //       });

  //       if (currentStep >= ANIMATION_STEPS) {
  //       clearInterval(timer);
  //         setAnimatedValues(TARGET_VALUES);
  //     }
  //   }, stepDuration);
  //   } catch (error) {
  //     console.warn('Animation error:', error);
  //     setAnimatedValues(TARGET_VALUES);
  //   }

  //   return () => {
  //     if (timer) {
  //       clearInterval(timer);
  //     }
  //   };
  // }, []);

  // 초기값 설정
  useEffect(() => {
    setAnimatedValues(TARGET_VALUES);
  }, []);

  // Real-time clock update - 비활성화
  // useEffect(() => {
  //   let clockInterval = null;
  //   
  //   try {
  //     clockInterval = setInterval(() => {
  //     setLiveData(prev => ({
  //       ...prev,
  //         currentTime: getSeoulTime()
  //       }));
  //     }, CLOCK_UPDATE_INTERVAL);
  //   } catch (error) {
  //     console.warn('Clock update error:', error);
  //   }

  //   return () => {
  //     if (clockInterval) {
  //       clearInterval(clockInterval);
  //     }
  //   };
  // }, []);

  // Live data simulation - 비활성화
  // useEffect(() => {
  //   let liveInterval = null;
  //   
  //   try {
  //     liveInterval = setInterval(() => {
  //     setLiveData(prev => ({
  //       ...prev,
  //         onlineUsers: getRandomInRange(120, 170),
  //         newMessages: getRandomInRange(0, 3)
  //     }));
  //     }, UPDATE_INTERVAL);
  //   } catch (error) {
  //     console.warn('Live data update error:', error);
  //   }

  //   return () => {
  //     if (liveInterval) {
  //       clearInterval(liveInterval);
  //     }
  //   };
  // }, []);

  // 메뉴 클릭 핸들러 - 완전히 새로운 방식
  const handleMenuClick = (menuItem) => {
    console.log('Menu clicked:', menuItem);
    setActiveMenu(menuItem);
  };

  // Calendar functions
  const navigateMonth = useCallback((direction) => {
    setCurrentDate(prevDate => {
      try {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + direction);
      return newDate;
      } catch (error) {
        console.warn('Date navigation error:', error);
        return prevDate;
      }
    });
  }, []);

  const handleDateClick = useCallback((date) => {
    if (typeof date === 'number' && date >= 1 && date <= 31) {
    setSelectedDate(date);
    }
  }, []);

  const handleMonthClick = useCallback((month) => {
    if (typeof month === 'string' && MONTH_NAMES.includes(month)) {
    setSelectedMonth(month);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
    }
  }, []);

  // Memoized graph data with validation
  const graphData = useMemo(() => {
    return validateGraphData(GRAPH_DATA) ? GRAPH_DATA : [];
  }, []);

  const handlePointHover = useCallback((index) => {
    if (typeof index === 'number' && index >= 0 && index < graphData.length) {
    setHoveredPoint(index);
    }
  }, [graphData.length]);

  const handlePointLeave = useCallback(() => {
    setHoveredPoint(null);
  }, []);

  // Memoized calendar data
  const calendarData = useMemo(() => {
    return getCalendarData(currentDate);
  }, [currentDate]);

  // Memoized bar chart data with validation
  const barData = useMemo(() => {
    return validateBarData(BAR_DATA) ? BAR_DATA : [];
  }, []);

  // Student page component
  const StudentPage = () => (
    <div className="main-content">
      {/* Header */}
      <div className="header">
        <div className="header__search">
          <input 
            type="text" 
            placeholder="검색" 
            className="header__search-input"
            aria-label="검색"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          />
        </div>
        
        <div className="header__actions">
          <div className="header__live-indicator">
            <div className={`header__live-dot ${liveData.isLive ? 'header__live-dot--pulsing' : ''}`}></div>
            <span className="header__live-text">실시간</span>
            <span className="header__live-time">
              {liveData.currentTime.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })}
            </span>
          </div>
          <div className="header__notifications">
            <div className="header__notification-icon" aria-label="알림">🔔</div>
            <div className="header__notification-icon" aria-label="설정">⚙️</div>
          </div>
          <div className="header__profile">
            <div className="header__profile-picture" aria-label="프로필">옥</div>
            <div className="header__profile-name">옥지원 교수</div>
          </div>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="student-profile-section">
        <div className="student-profile-card">
          <div className="student-avatar">
            <div className="avatar-placeholder">👨‍🎓</div>
          </div>
          <div className="student-info">
            <div className="student-name">김ㅇ윤</div>
            <div className="student-details">
              <div className="student-id">202510325</div>
              <div className="student-grade">3학년/1반</div>
              <div className="student-contact">5678010-1234-5678</div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="student-metrics-grid">
          <div className="student-metric-card">
            <div className="metric-icon attendance-icon">👥</div>
            <div className="metric-content">
              <div className="metric-value">출석</div>
              <div className="metric-label">출결 현황</div>
            </div>
          </div>
          <div className="student-metric-card">
            <div className="metric-icon time-icon">📅</div>
            <div className="metric-content">
              <div className="metric-value">3시간 52분</div>
              <div className="metric-label">Studio 평균 학습 시간</div>
            </div>
          </div>
          <div className="student-metric-card">
            <div className="metric-icon score-icon">🏆</div>
            <div className="metric-content">
              <div className="metric-value">74점</div>
              <div className="metric-label">최근 성과</div>
            </div>
          </div>
          <div className="student-metric-card">
            <div className="metric-icon vr-icon">✅</div>
            <div className="metric-content">
              <div className="metric-value">완료</div>
              <div className="metric-label">VR 학습 참여 여부</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Data Section */}
      <div className="student-content-grid">
        {/* Left Column */}
        <div className="student-left-column">
          {/* Achievement Chart */}
          <div className="content-card">
            <div className="card-title">누적 성취율</div>
            <div className="achievement-chart">
              <div className="achievement-circle">
                <div className="achievement-percentage">{STUDENT_DATA.achievement}%</div>
              </div>
            </div>
          </div>

          {/* Memo Section */}
          <div className="content-card">
            <div className="card-title">메모</div>
            <div className="memo-controls">
              <input 
                type="text" 
                placeholder="검색" 
                className="memo-search"
                aria-label="메모 검색"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
              <button 
                type="button"
                className="memo-add-btn"
                onClick={(e) => e.preventDefault()}
              >
                + 메모 추가
              </button>
            </div>
            <div className="memo-list">
              {STUDENT_DATA.memos.map((memo, index) => (
                <div key={index} className="memo-item">
                  <div className="memo-content">
                    <div className="memo-title">{memo.title}</div>
                    <div className="memo-date">{memo.date}</div>
                  </div>
                  <div className="memo-actions">
                    <button 
                      type="button"
                      className="memo-edit"
                      onClick={(e) => e.preventDefault()}
                    >
                      ✏️
                    </button>
                    <button 
                      type="button"
                      className="memo-delete"
                      onClick={(e) => e.preventDefault()}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VR Learning Evaluation Section */}
          <div className="content-card">
            <div className="card-title">VR 학습 평가</div>
            <div className="chart-controls">
              <select className="chart-select" aria-label="주차 선택">
                <option>주차</option>
                <option>1주차</option>
                <option>2주차</option>
                <option>3주차</option>
              </select>
              <select className="chart-select" aria-label="모듈 선택">
                <option>모듈(과목/단원/챕터)</option>
              </select>
            </div>
            <div className="vr-evaluation-content">
              {/* Video Frames */}
              <div className="vr-video-section">
                <div className="vr-video-frame">
                  <div className="vr-video-placeholder">
                    <div className="vr-skeleton-overlay">
                      <div className="skeleton-line skeleton-torso"></div>
                      <div className="skeleton-line skeleton-arm-left"></div>
                      <div className="skeleton-line skeleton-arm-right"></div>
                      <div className="skeleton-line skeleton-hand-left"></div>
                      <div className="skeleton-line skeleton-hand-right"></div>
                      <div className="skeleton-node node-shoulder-left"></div>
                      <div className="skeleton-node node-shoulder-right"></div>
                      <div className="skeleton-node node-elbow-left"></div>
                      <div className="skeleton-node node-elbow-right"></div>
                      <div className="skeleton-node node-wrist-left"></div>
                      <div className="skeleton-node node-wrist-right"></div>
                    </div>
                  </div>
                </div>
                <div className="vr-video-frame">
                  <div className="vr-video-placeholder">
                    <div className="vr-skeleton-overlay">
                      <div className="skeleton-line skeleton-torso"></div>
                      <div className="skeleton-line skeleton-arm-left"></div>
                      <div className="skeleton-line skeleton-arm-right"></div>
                      <div className="skeleton-line skeleton-hand-left"></div>
                      <div className="skeleton-line skeleton-hand-right"></div>
                      <div className="skeleton-node node-shoulder-left"></div>
                      <div className="skeleton-node node-shoulder-right"></div>
                      <div className="skeleton-node node-elbow-left"></div>
                      <div className="skeleton-node node-elbow-right"></div>
                      <div className="skeleton-node node-wrist-left"></div>
                      <div className="skeleton-node node-wrist-right"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evaluation Table */}
              <div className="vr-evaluation-table">
                <div className="evaluation-header">
                  <div className="evaluation-item-header">평가 항목</div>
                  <div className="evaluation-score-header">학생 점수</div>
                </div>
                <div className="evaluation-list">
                  <div className="evaluation-item">
                    <div className="evaluation-label">정확도</div>
                    <div className="evaluation-bar">
                      <div className="evaluation-progress" style={{width: '75%'}}></div>
                      <div className="evaluation-score">22.5 / 30</div>
                    </div>
                  </div>
                  <div className="evaluation-item">
                    <div className="evaluation-label">시간</div>
                    <div className="evaluation-bar">
                      <div className="evaluation-progress" style={{width: '75%'}}></div>
                      <div className="evaluation-score">22.5 / 30</div>
                    </div>
                  </div>
                  <div className="evaluation-item">
                    <div className="evaluation-label">동작/자세</div>
                    <div className="evaluation-bar">
                      <div className="evaluation-progress" style={{width: '78%'}}></div>
                      <div className="evaluation-score">11.7 / 15</div>
                    </div>
                  </div>
                  <div className="evaluation-item">
                    <div className="evaluation-label">안전/무균</div>
                    <div className="evaluation-bar">
                      <div className="evaluation-progress" style={{width: '68%'}}></div>
                      <div className="evaluation-score">13.6 / 20</div>
                    </div>
                  </div>
                  <div className="evaluation-item">
                    <div className="evaluation-label">의사소통</div>
                    <div className="evaluation-bar">
                      <div className="evaluation-progress" style={{width: '65%'}}></div>
                      <div className="evaluation-score">6.5 / 10</div>
                    </div>
                  </div>
                  <div className="evaluation-item">
                    <div className="evaluation-label">종합 성과</div>
                    <div className="evaluation-bar">
                      <div className="evaluation-progress" style={{width: '72%'}}></div>
                      <div className="evaluation-score">7.2 / 10</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Information Section */}
          <div className="content-card">
            <div className="card-title">학생 상세 정보</div>
            <div className="student-info-content">
              {/* Student Details Grid */}
              <div className="student-details-grid">
                <div className="detail-item">
                  <div className="detail-label">학번</div>
                  <div className="detail-value">202510325</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">학년/반</div>
                  <div className="detail-value">3학년 1반</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">전공</div>
                  <div className="detail-value">간호학과</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">연락처</div>
                  <div className="detail-value">010-1234-5678</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">이메일</div>
                  <div className="detail-value">student@university.ac.kr</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">입학일</div>
                  <div className="detail-value">2022.03.01</div>
                </div>
              </div>

              {/* Learning Progress */}
              <div className="learning-progress-section">
                <div className="progress-header">
                  <h4>학습 진행률</h4>
                  <div className="progress-overall">전체 78%</div>
                </div>
                <div className="progress-items">
                  <div className="progress-item">
                    <div className="progress-label">기본 이론</div>
                    <div className="progress-bar-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '85%'}}></div>
                      </div>
                      <div className="progress-percentage">85%</div>
                    </div>
                  </div>
                  <div className="progress-item">
                    <div className="progress-label">실습 모듈</div>
                    <div className="progress-bar-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '72%'}}></div>
                      </div>
                      <div className="progress-percentage">72%</div>
                    </div>
                  </div>
                  <div className="progress-item">
                    <div className="progress-label">VR 시뮬레이션</div>
                    <div className="progress-bar-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '68%'}}></div>
                      </div>
                      <div className="progress-percentage">68%</div>
                    </div>
                  </div>
                  <div className="progress-item">
                    <div className="progress-label">평가 및 피드백</div>
                    <div className="progress-bar-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '90%'}}></div>
                      </div>
                      <div className="progress-percentage">90%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="recent-activities">
                <div className="activities-header">
                  <h4>최근 활동</h4>
                </div>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">📚</div>
                    <div className="activity-content">
                      <div className="activity-title">기본 이론 학습 완료</div>
                      <div className="activity-time">2시간 전</div>
                    </div>
                    <div className="activity-status completed">완료</div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">🎯</div>
                    <div className="activity-content">
                      <div className="activity-title">VR 시뮬레이션 실습</div>
                      <div className="activity-time">1일 전</div>
                    </div>
                    <div className="activity-status completed">완료</div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">📝</div>
                    <div className="activity-content">
                      <div className="activity-title">중간 평가 제출</div>
                      <div className="activity-time">3일 전</div>
                    </div>
                    <div className="activity-status completed">완료</div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">💬</div>
                    <div className="activity-content">
                      <div className="activity-title">피드백 검토</div>
                      <div className="activity-time">5일 전</div>
                    </div>
                    <div className="activity-status pending">대기중</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Performance Section */}
          <div className="content-card">
            <div className="card-title">학습 성과</div>
            <div className="learning-performance-content">
              {/* Performance Summary */}
              <div className="performance-summary">
                <div className="summary-item">
                  <div className="summary-icon">📊</div>
                  <div className="summary-content">
                    <div className="summary-label">이번 주 성과</div>
                    <div className="summary-value">우수</div>
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-icon">🎯</div>
                  <div className="summary-content">
                    <div className="summary-label">목표 달성률</div>
                    <div className="summary-value">85%</div>
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-icon">⭐</div>
                  <div className="summary-content">
                    <div className="summary-label">평가 등급</div>
                    <div className="summary-value">A</div>
                  </div>
                </div>
              </div>

              {/* Improvement Areas */}
              <div className="improvement-areas">
                <div className="improvement-header">
                  <h4>개선 영역</h4>
                </div>
                <div className="improvement-list">
                  <div className="improvement-item">
                    <div className="improvement-icon">🔧</div>
                    <div className="improvement-content">
                      <div className="improvement-title">실습 정확도</div>
                      <div className="improvement-desc">세부 동작 개선 필요</div>
                    </div>
                    <div className="improvement-priority high">높음</div>
                  </div>
                  <div className="improvement-item">
                    <div className="improvement-icon">⏱️</div>
                    <div className="improvement-content">
                      <div className="improvement-title">시간 관리</div>
                      <div className="improvement-desc">실습 속도 향상</div>
                    </div>
                    <div className="improvement-priority medium">보통</div>
                  </div>
                  <div className="improvement-item">
                    <div className="improvement-icon">💬</div>
                    <div className="improvement-content">
                      <div className="improvement-title">의사소통</div>
                      <div className="improvement-desc">상황 설명 능력</div>
                    </div>
                    <div className="improvement-priority low">낮음</div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="next-steps">
                <div className="steps-header">
                  <h4>다음 단계</h4>
                </div>
                <div className="steps-list">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <div className="step-title">고급 실습 모듈</div>
                      <div className="step-time">다음 주</div>
                    </div>
                    <div className="step-status ready">준비완료</div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <div className="step-title">종합 평가</div>
                      <div className="step-time">2주 후</div>
                    </div>
                    <div className="step-status pending">대기중</div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <div className="step-title">인증 시험</div>
                      <div className="step-time">1개월 후</div>
                    </div>
                    <div className="step-status pending">대기중</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="student-right-column">
          {/* Score Trend Chart */}
          <div className="content-card">
            <div className="card-title">점수 추이</div>
            <div className="chart-controls">
              <select className="chart-select" aria-label="주차 선택">
                <option>1주차</option>
                <option>2주차</option>
                <option>3주차</option>
              </select>
              <select className="chart-select" aria-label="모듈 선택">
                <option>모듈(과목/단원/챕터)</option>
              </select>
            </div>
            <div className="score-trend-chart">
              <div className="chart-y-axis">
                <div className="y-label">80</div>
                <div className="y-label">75</div>
                <div className="y-label">70</div>
                <div className="y-label">65</div>
                <div className="y-label">60</div>
              </div>
              <div className="chart-area">
                <svg className="trend-line" viewBox="0 0 300 150">
                  {/* Area fill */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4"/>
                      <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.05"/>
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Generate path and area based on actual data */}
                  {(() => {
                    const points = STUDENT_DATA.scoreTrend.map((point, index) => {
                      const x = 20 + (index * 40);
                      const y = 75 - (point.score - 60) * 1.2; // 60-80점 범위를 그래프 중앙(75px) 기준으로 매핑
                      return { x, y };
                    });
                    
                    // Create path that goes through all points exactly
                    let pathData = `M ${points[0].x} ${points[0].y}`;
                    for (let i = 1; i < points.length; i++) {
                      pathData += ` L ${points[i].x} ${points[i].y}`;
                    }
                    
                    // Create area fill path
                    const areaPath = `${pathData} L ${points[points.length - 1].x} 120 L 20 120 Z`;
                    
                    return (
                      <>
                        <path 
                          d={areaPath}
                          fill="url(#chartGradient)"
                        />
                        <path 
                          d={pathData}
                          stroke="#8B5CF6"
                          strokeWidth="4"
                          fill="none"
                          filter="url(#glow)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {points.map((point, index) => (
                          <circle 
                            key={index}
                            cx={point.x} 
                            cy={point.y} 
                            r="5" 
                            fill="#8B5CF6"
                            stroke="white"
                            strokeWidth="3"
                            filter="url(#glow)"
                          />
                        ))}
                      </>
                    );
                  })()}
                  {/* Highlight line and point for 09/14 (4th data point) */}
                  {(() => {
                    const highlightIndex = 3; // 09/14 is the 4th point (index 3)
                    const highlightPoint = {
                      x: 20 + (highlightIndex * 40),
                      y: 75 - (STUDENT_DATA.scoreTrend[highlightIndex].score - 60) * 1.2
                    };
                    
                    return (
                      <>
                        <line
                          x1={highlightPoint.x}
                          y1="120"
                          x2={highlightPoint.x}
                          y2={highlightPoint.y}
                          stroke="#8B5CF6"
                          strokeWidth="2"
                          strokeOpacity="0.7"
                          strokeDasharray="8,4"
                          strokeLinecap="round"
                        />
                        <circle
                          cx={highlightPoint.x}
                          cy={highlightPoint.y}
                          r="7"
                          fill="#8B5CF6"
                          stroke="white"
                          strokeWidth="4"
                          filter="url(#glow)"
                        />
                      </>
                    );
                  })()}
                </svg>
                {/* Highlight label */}
                <div className="chart-highlight-label">
                  <div className="highlight-value">{STUDENT_DATA.scoreTrend[3].score}점</div>
                </div>
                <div className="chart-x-axis">
                  {STUDENT_DATA.scoreTrend.map((point, index) => (
                    <div key={index} className="x-label">{point.date}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* VR Learning Evaluation */}
          <div className="content-card">
            <div className="card-title">VR 학습 평가</div>
            <div className="chart-controls">
              <select className="chart-select" aria-label="주차 선택">
                <option>1주차</option>
                <option>2주차</option>
                <option>3주차</option>
              </select>
              <select className="chart-select" aria-label="모듈 선택">
                <option>모듈(과목/단원/챕터)</option>
              </select>
            </div>
            <div className="vr-evaluation">
              <div className="vr-image">
                <div className="vr-placeholder">🖐️</div>
              </div>
              <div className="evaluation-list">
                {STUDENT_DATA.vrEvaluation.map((item, index) => (
                  <div key={index} className="evaluation-item">
                    <div className="evaluation-label">{item.item}</div>
                    <div className="evaluation-bar">
                      <div 
                        className="evaluation-progress" 
                        style={{width: `${(item.score / item.total) * 100}%`}}
                      ></div>
                    </div>
                    <div className="evaluation-score">{item.score}/{item.total}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Average Comparison */}
          <div className="content-card">
            <div className="card-title">평균 비교</div>
            <div className="comparison-legend">
              <div className="legend-item">
                <div className="legend-dot purple"></div>
                <span>학생</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot yellow"></div>
                <span>반평균</span>
              </div>
            </div>
            <div className="comparison-chart">
              {STUDENT_DATA.comparison.map((item, index) => (
                <div key={index} className="comparison-item">
                  <div className="comparison-label">{item.category}</div>
                  <div className="comparison-bars">
                    <div className="bar-container">
                      <div 
                        className="bar student-bar" 
                        style={{width: `${item.student}%`}}
                      ></div>
                      <div className="bar-value">{item.student}%</div>
                    </div>
                    <div className="bar-container">
                      <div 
                        className="bar class-bar" 
                        style={{width: `${item.classAverage}%`}}
                      ></div>
                      <div className="bar-value">{item.classAverage}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="content-card">
            <div className="calendar-header">
              <button 
                type="button"
                className="calendar-nav" 
                aria-label="이전 달"
                onClick={(e) => e.preventDefault()}
              >
                ‹
              </button>
              <div className="calendar-month-year">2025.09</div>
              <button 
                type="button"
                className="calendar-nav" 
                aria-label="다음 달"
                onClick={(e) => e.preventDefault()}
              >
                ›
              </button>
            </div>
            <div className="calendar-weekdays">
              {WEEKDAY_NAMES.map((weekday) => (
                <div key={weekday} className="weekday">{weekday}</div>
              ))}
            </div>
            <div className="calendar-dates">
              {calendarData.slice(0, 7).map((date, index) => (
                <div 
                  key={index}
                  className={`calendar-date ${date === 14 ? 'selected' : ''}`}
                >
                  {date}
                </div>
              ))}
            </div>
          </div>

          {/* VR Session Records */}
          <div className="content-card">
            <div className="card-title">
              VR 세션 기록
              <div className="card-options">전체보기</div>
            </div>
            <div className="vr-session-data">
              <div className="session-item">
                <div className="session-value">{STUDENT_DATA.vrSession.executionCount}회</div>
                <div className="session-label">실행 횟수</div>
              </div>
              <div className="session-item">
                <div className="session-value">{STUDENT_DATA.vrSession.totalTime}</div>
                <div className="session-label">누적 학습 시간</div>
              </div>
              <div className="session-item">
                <div className="session-value">{STUDENT_DATA.vrSession.lastExecution}</div>
                <div className="session-label">최근 실행일</div>
              </div>
            </div>
          </div>

          {/* Learning Analytics Section */}
          <div className="content-card">
            <div className="card-title">학습 분석</div>
            <div className="learning-analytics-content">
              {/* Performance Metrics Grid */}
              <div className="analytics-metrics-grid">
                <div className="metric-item">
                  <div className="metric-label">평균 점수</div>
                  <div className="metric-value">78.5점</div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">완료율</div>
                  <div className="metric-value">92%</div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">학습 시간</div>
                  <div className="metric-value">24시간</div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">진행 단계</div>
                  <div className="metric-value">3/5</div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">피드백 수</div>
                  <div className="metric-value">12개</div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">개선 사항</div>
                  <div className="metric-value">3개</div>
                </div>
              </div>

              {/* Learning Goals */}
              <div className="learning-goals-section">
                <div className="goals-header">
                  <h4>학습 목표</h4>
                  <div className="goals-overall">달성률 85%</div>
                </div>
                <div className="goals-items">
                  <div className="goal-item">
                    <div className="goal-label">기본 이론 숙지</div>
                    <div className="goal-bar-container">
                      <div className="goal-bar">
                        <div className="goal-fill" style={{width: '90%'}}></div>
                      </div>
                      <div className="goal-percentage">90%</div>
                    </div>
                  </div>
                  <div className="goal-item">
                    <div className="goal-label">실습 기술 향상</div>
                    <div className="goal-bar-container">
                      <div className="goal-bar">
                        <div className="goal-fill" style={{width: '75%'}}></div>
                      </div>
                      <div className="goal-percentage">75%</div>
                    </div>
                  </div>
                  <div className="goal-item">
                    <div className="goal-label">안전 수칙 준수</div>
                    <div className="goal-bar-container">
                      <div className="goal-bar">
                        <div className="goal-fill" style={{width: '95%'}}></div>
                      </div>
                      <div className="goal-percentage">95%</div>
                    </div>
                  </div>
                  <div className="goal-item">
                    <div className="goal-label">의사소통 능력</div>
                    <div className="goal-bar-container">
                      <div className="goal-bar">
                        <div className="goal-fill" style={{width: '80%'}}></div>
                      </div>
                      <div className="goal-percentage">80%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Study Schedule */}
              <div className="study-schedule">
                <div className="schedule-header">
                  <h4>학습 일정</h4>
                </div>
                <div className="schedule-list">
                  <div className="schedule-item">
                    <div className="schedule-icon">📅</div>
                    <div className="schedule-content">
                      <div className="schedule-title">기본 이론 복습</div>
                      <div className="schedule-time">오늘 오후 2시</div>
                    </div>
                    <div className="schedule-status upcoming">예정</div>
                  </div>
                  <div className="schedule-item">
                    <div className="schedule-icon">🎯</div>
                    <div className="schedule-content">
                      <div className="schedule-title">VR 실습 세션</div>
                      <div className="schedule-time">내일 오전 10시</div>
                    </div>
                    <div className="schedule-status upcoming">예정</div>
                  </div>
                  <div className="schedule-item">
                    <div className="schedule-icon">📝</div>
                    <div className="schedule-content">
                      <div className="schedule-title">주간 평가</div>
                      <div className="schedule-time">금요일 오후 3시</div>
                    </div>
                    <div className="schedule-status upcoming">예정</div>
                  </div>
                  <div className="schedule-item">
                    <div className="schedule-icon">💬</div>
                    <div className="schedule-content">
                      <div className="schedule-title">피드백 상담</div>
                      <div className="schedule-time">다음 주 월요일</div>
                    </div>
                    <div className="schedule-status upcoming">예정</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Resources Section */}
          <div className="content-card">
            <div className="card-title">학습 자료</div>
            <div className="learning-resources-content">
              {/* Resource Categories */}
              <div className="resource-categories">
                <div className="category-item">
                  <div className="category-icon">📚</div>
                  <div className="category-content">
                    <div className="category-label">이론 자료</div>
                    <div className="category-count">12개</div>
                  </div>
                </div>
                <div className="category-item">
                  <div className="category-icon">🎥</div>
                  <div className="category-content">
                    <div className="category-label">동영상</div>
                    <div className="category-count">8개</div>
                  </div>
                </div>
                <div className="category-item">
                  <div className="category-icon">📋</div>
                  <div className="category-content">
                    <div className="category-label">실습 가이드</div>
                    <div className="category-count">5개</div>
                  </div>
                </div>
              </div>

              {/* Recent Resources */}
              <div className="recent-resources">
                <div className="resources-header">
                  <h4>최근 자료</h4>
                </div>
                <div className="resources-list">
                  <div className="resource-item">
                    <div className="resource-icon">📖</div>
                    <div className="resource-content">
                      <div className="resource-title">기본 이론서</div>
                      <div className="resource-date">2일 전</div>
                    </div>
                    <div className="resource-status new">신규</div>
                  </div>
                  <div className="resource-item">
                    <div className="resource-icon">🎬</div>
                    <div className="resource-content">
                      <div className="resource-title">실습 동영상</div>
                      <div className="resource-date">1주 전</div>
                    </div>
                    <div className="resource-status updated">업데이트</div>
                  </div>
                  <div className="resource-item">
                    <div className="resource-icon">📝</div>
                    <div className="resource-content">
                      <div className="resource-title">평가 기준</div>
                      <div className="resource-date">2주 전</div>
                    </div>
                    <div className="resource-status normal">일반</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>


      {/* Student List Table */}
      <div className="content-card student-table-card">
        <div className="card-title">
          <h2 className="table-title">학생 리스트</h2>
          <div className="table-search">
            <div className="search-input-container">
              <div className="search-icon">🔍</div>
              <input 
                type="text" 
                placeholder="학생 이름, 학번, 학년/반으로 검색하세요" 
                className="table-search-input"
                aria-label="학생 검색"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <button className="filter-btn" type="button">
              <span className="filter-icon">⚙️</span>
              <span className="filter-text">필터</span>
            </button>
          </div>
        </div>
        <table className="student-table">
          <thead>
            <tr>
              <th>학번</th>
              <th>이름</th>
              <th>학년/반</th>
              <th>연락처</th>
              <th>출결</th>
              <th>Studio 평균 시간</th>
              <th>최근 성과</th>
              <th>VR 학습</th>
            </tr>
          </thead>
          <tbody>
            {STUDENT_DATA.studentList.map((student, index) => (
              <tr key={index}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.contact}</td>
                <td>{student.attendance}</td>
                <td>{student.studioTime}</td>
                <td>{student.score}점</td>
                <td>
                  <span className={`vr-status ${student.vrStatus === '완료' ? 'completed' : student.vrStatus === '진행중' ? 'in-progress' : 'not-started'}`}>
                    {student.vrStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-pagination">
          <button 
            type="button"
            className="pagination-btn"
            onClick={(e) => e.preventDefault()}
          >
            이전
          </button>
          <span className="pagination-info">1페이지 / 총 12페이지</span>
          <button 
            type="button"
            className="pagination-btn"
            onClick={(e) => e.preventDefault()}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <img src={gridatechLogo} alt="gridatech" className="logo-image" />
          </div>
        </div>
        
        <div className="sidebar-menu">
          <div className="menu-section">
            <div className="menu-section-title">MENU</div>
            {MENU_ITEMS.MAIN.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMenuClick(item.id);
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMenuClick(item.id);
                }}
                aria-label={`${item.label} 메뉴`}
                aria-current={activeMenu === item.id ? 'page' : undefined}
                role="menuitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMenuClick(item.id);
                  }
                }}
              >
                <span className="menu-icon" aria-hidden="true">{item.icon}</span>
                <span className="menu-text">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="menu-section">
            <div className="menu-section-title">OTHER</div>
            {MENU_ITEMS.OTHER.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMenuClick(item.id);
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMenuClick(item.id);
                }}
                aria-label={`${item.label} 메뉴`}
                aria-current={activeMenu === item.id ? 'page' : undefined}
                role="menuitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMenuClick(item.id);
                  }
                }}
              >
                <span className="menu-icon" aria-hidden="true">{item.icon}</span>
                <span className="menu-text">{item.label}</span>
              </button>
            ))}
            </div>
            </div>
            </div>
          
      {/* Main Content */}
      {activeMenu === '학생' ? (
        <StudentPage />
      ) : activeMenu === '출결' ? (
        <div className="main-content">
          <div className="header">
            <div className="header__search">
              <input 
                type="text" 
                placeholder="검색" 
                className="header__search-input"
                aria-label="검색"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
          </div>
            <div className="header__actions">
              <div className="header__live-indicator">
                <div className={`header__live-dot ${liveData.isLive ? 'header__live-dot--pulsing' : ''}`}></div>
                <span className="header__live-text">실시간</span>
                <span className="header__live-time">
                  {liveData.currentTime.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
              <div className="header__notifications">
                <div className="header__notification-icon" aria-label="알림">🔔</div>
                <div className="header__notification-icon" aria-label="설정">⚙️</div>
              </div>
              <div className="header__profile">
                <div className="header__profile-picture" aria-label="프로필">교수</div>
                <div className="header__profile-name">김교수</div>
              </div>
            </div>
          </div>
          <div className="content-card">
            <div className="card-title">출결 관리</div>
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              출결 관리 페이지가 준비 중입니다.
            </div>
          </div>
        </div>
      ) : activeMenu === '평가' ? (
        <div className="main-content">
          <div className="header">
            <div className="header__search">
              <input 
                type="text" 
                placeholder="검색" 
                className="header__search-input"
                aria-label="검색"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="header__actions">
              <div className="header__live-indicator">
                <div className={`header__live-dot ${liveData.isLive ? 'header__live-dot--pulsing' : ''}`}></div>
                <span className="header__live-text">실시간</span>
                <span className="header__live-time">
                  {liveData.currentTime.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
              <div className="header__notifications">
                <div className="header__notification-icon" aria-label="알림">🔔</div>
                <div className="header__notification-icon" aria-label="설정">⚙️</div>
              </div>
              <div className="header__profile">
                <div className="header__profile-picture" aria-label="프로필">교수</div>
                <div className="header__profile-name">김교수</div>
              </div>
            </div>
          </div>
          <div className="content-card">
            <div className="card-title">평가 페이지</div>
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--Regular-Grey)' }}>
              평가 관련 기능이 여기에 표시됩니다.
            </div>
          </div>
        </div>
      ) : activeMenu === '실습 로그' ? (
        <div className="main-content">
          <div className="header">
            <div className="header__search">
              <input 
                type="text" 
                placeholder="검색" 
                className="header__search-input"
                aria-label="검색"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="header__actions">
              <div className="header__live-indicator">
                <div className={`header__live-dot ${liveData.isLive ? 'header__live-dot--pulsing' : ''}`}></div>
                <span className="header__live-text">실시간</span>
                <span className="header__live-time">
                  {liveData.currentTime.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
              <div className="header__notifications">
                <div className="header__notification-icon" aria-label="알림">🔔</div>
                <div className="header__notification-icon" aria-label="설정">⚙️</div>
              </div>
              <div className="header__profile">
                <div className="header__profile-picture" aria-label="프로필">교수</div>
                <div className="header__profile-name">김교수</div>
              </div>
            </div>
          </div>
          <div className="content-card">
            <div className="card-title">실습 로그</div>
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              실습 로그 페이지가 준비 중입니다.
        </div>
      </div>
        </div>
      ) : activeMenu === '학습 성과 리포트' ? (
        <div className="main-content report-management-page">
          {/* Unified Header */}
          <div className="header">
            <div className="header__search">
              <input 
                type="text" 
                placeholder="검색" 
                className="header__search-input"
                aria-label="검색"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="header__actions">
              <div className="header__live-indicator">
                <div className={`header__live-dot ${liveData.isLive ? 'header__live-dot--pulsing' : ''}`}></div>
                <span className="header__live-text">실시간</span>
                <span className="header__live-time">
                  {liveData.currentTime.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
              <div className="header__notifications">
                <div className="header__notification-icon" aria-label="알림">🔔</div>
                <div className="header__notification-icon" aria-label="설정">⚙️</div>
              </div>
              <div className="header__profile">
                <div className="header__profile-picture" aria-label="프로필">교수</div>
                <div className="header__profile-name">김교수</div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="report-content-grid">
            {/* Left Column - Chart */}
            <div className="report-chart-section">
              <div className="content-card">
                <div className="chart-header">
                  <h3 className="chart-title">핵심 간호술 향상도</h3>
                  <div className="chart-options">
                    <select className="chart-select">
                      <option>전체 기간</option>
                      <option>최근 6개월</option>
                      <option>최근 3개월</option>
                    </select>
                  </div>
                </div>
                <div className="chart-container">
                  <svg viewBox="0 0 600 200" className="chart-svg">
                    {/* Y-axis labels */}
                    <text x="15" y="20" className="y-label">100</text>
                    <text x="15" y="60" className="y-label">75</text>
                    <text x="15" y="100" className="y-label">50</text>
                    <text x="15" y="140" className="y-label">25</text>
                    <text x="15" y="180" className="y-label">0</text>
                    
                    {/* X-axis labels */}
                    <text x="60" y="195" className="x-label">1월</text>
                    <text x="110" y="195" className="x-label">2월</text>
                    <text x="160" y="195" className="x-label">3월</text>
                    <text x="210" y="195" className="x-label">4월</text>
                    <text x="260" y="195" className="x-label">5월</text>
                    <text x="310" y="195" className="x-label">6월</text>
                    <text x="360" y="195" className="x-label">7월</text>
                    <text x="410" y="195" className="x-label">8월</text>
                    <text x="460" y="195" className="x-label">9월</text>
                    <text x="510" y="195" className="x-label">10월</text>
                    <text x="560" y="195" className="x-label">11월</text>
                    <text x="610" y="195" className="x-label">12월</text>
                    
                    {/* Area fill */}
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity="0.05"/>
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 60 160 L 110 140 L 160 120 L 210 100 L 260 80 L 310 70 L 360 60 L 410 50 L 460 40 L 510 35 L 560 30 L 610 25 L 610 200 L 60 200 Z"
                      fill="url(#chartGradient)"
                    />
                    
                    {/* Line */}
                    <path 
                      d="M 60 160 L 110 140 L 160 120 L 210 100 L 260 80 L 310 70 L 360 60 L 410 50 L 460 40 L 510 35 L 560 30 L 610 25"
                      stroke="var(--color-primary-500)"
                      strokeWidth="3"
                      fill="none"
                    />
                    
                    {/* Data points */}
                    <circle cx="60" cy="160" r="4" fill="var(--color-primary-500)" stroke="white" strokeWidth="2"/>
                    <circle cx="110" cy="140" r="4" fill="var(--color-primary-500)" stroke="white" strokeWidth="2"/>
                    <circle cx="160" cy="120" r="4" fill="var(--color-primary-500)" stroke="white" strokeWidth="2"/>
                    <circle cx="210" cy="100" r="4" fill="var(--color-primary-500)" stroke="white" strokeWidth="2"/>
                    <circle cx="260" cy="80" r="4" fill="var(--color-primary-500)" stroke="white" strokeWidth="2"/>
                    <circle cx="310" cy="70" r="4" fill="var(--color-primary-500)" stroke="white" strokeWidth="2"/>
                    <circle cx="360" cy="60" r="4" fill="var(--color-primary-500)" stroke="white" strokeWidth="2"/>
                    <circle cx="410" cy="50" r="4" fill="var(--color-primary-500)" stroke="white" strokeWidth="2"/>
                    <circle cx="460" cy="40" r="4" fill="var(--color-primary-500)" stroke="white" strokeWidth="2"/>
                    <circle cx="510" cy="35" r="4" fill="var(--color-primary-500)" stroke="white" strokeWidth="2"/>
                    <circle cx="560" cy="30" r="4" fill="var(--color-primary-500)" stroke="white" strokeWidth="2"/>
                    <circle cx="610" cy="25" r="4" fill="var(--color-primary-500)" stroke="white" strokeWidth="2"/>
                    
                    {/* Highlight point for September */}
                    <line x1="460" y1="200" x2="460" y2="40" stroke="var(--color-primary-500)" strokeWidth="2" strokeOpacity="0.6" strokeDasharray="5,5"/>
                    <circle cx="460" cy="40" r="6" fill="var(--color-primary-500)" stroke="white" strokeWidth="3"/>
                    <text x="470" y="35" className="highlight-label">92%</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Column - Metrics */}
            <div className="report-metrics-section">
              <div className="content-card">
                <h3 className="card-title">주요 지표</h3>
                <div className="metrics-cards-grid">
                  <div className="metric-card-small">
                    <div className="metric-icon-small">📊</div>
                    <div className="metric-content-small">
                      <div className="metric-value-small">87%</div>
                      <div className="metric-change-small positive">↑15%</div>
                      <div className="metric-label-small">실습 정확도</div>
                    </div>
                  </div>
                  <div className="metric-card-small">
                    <div className="metric-icon-small">📈</div>
                    <div className="metric-content-small">
                      <div className="metric-value-small">91%</div>
                      <div className="metric-change-small positive">↑15%</div>
                      <div className="metric-label-small">반복 학습 참여율</div>
                    </div>
                  </div>
                  <div className="metric-card-small">
                    <div className="metric-icon-small">📉</div>
                    <div className="metric-content-small">
                      <div className="metric-value-small">12%</div>
                      <div className="metric-change-small negative">↓8%</div>
                      <div className="metric-label-small">실습 오류율</div>
                    </div>
                  </div>
                  <div className="metric-card-small">
                    <div className="metric-icon-small">🎯</div>
                    <div className="metric-content-small">
                      <div className="metric-value-small">60%</div>
                      <div className="metric-change-small positive">↑8%</div>
                      <div className="metric-label-small">반복 학습 개선도</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Nursing Skill Improvement Chart */}
          <div className="content-card">
            <div className="chart-header">
              <div className="chart-title">핵심 간호술 향상도</div>
              <div className="chart-options">⋯</div>
            </div>
            <div className="chart-container">
              <div className="line-chart">
                <svg viewBox="0 0 600 180" className="chart-svg">
                  {/* Y-axis labels */}
                  <text x="15" y="15" className="y-label">100</text>
                  <text x="15" y="50" className="y-label">75</text>
                  <text x="15" y="85" className="y-label">50</text>
                  <text x="15" y="120" className="y-label">25</text>
                  <text x="15" y="155" className="y-label">0</text>
                  
                  {/* X-axis labels */}
                  <text x="60" y="175" className="x-label">1월</text>
                  <text x="110" y="175" className="x-label">2월</text>
                  <text x="160" y="175" className="x-label">3월</text>
                  <text x="210" y="175" className="x-label">4월</text>
                  <text x="260" y="175" className="x-label">5월</text>
                  <text x="310" y="175" className="x-label">6월</text>
                  <text x="360" y="175" className="x-label">7월</text>
                  <text x="410" y="175" className="x-label">8월</text>
                  <text x="460" y="175" className="x-label">9월</text>
                  <text x="510" y="175" className="x-label">10월</text>
                  <text x="560" y="175" className="x-label">11월</text>
                  <text x="610" y="175" className="x-label">12월</text>
                  
                  {/* Area fill */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--Main-Purple)" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="var(--Main-Purple)" stopOpacity="0.05"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Area path */}
                  <path d="M 60 110 L 110 90 L 160 70 L 210 80 L 260 60 L 310 75 L 360 65 L 410 55 L 460 30 L 510 45 L 560 50 L 610 40 L 610 160 L 60 160 Z" 
                        fill="url(#chartGradient)" />
                  
                  {/* Line path */}
                  <path d="M 60 110 L 110 90 L 160 70 L 210 80 L 260 60 L 310 75 L 360 65 L 410 55 L 460 30 L 510 45 L 560 50 L 610 40" 
                        stroke="var(--Main-Purple)" 
                        strokeWidth="2" 
                        fill="none" />
                  
                  {/* Data points */}
                  <circle cx="60" cy="110" r="3" fill="var(--Main-Purple)" stroke="white" strokeWidth="1"/>
                  <circle cx="110" cy="90" r="3" fill="var(--Main-Purple)" stroke="white" strokeWidth="1"/>
                  <circle cx="160" cy="70" r="3" fill="var(--Main-Purple)" stroke="white" strokeWidth="1"/>
                  <circle cx="210" cy="80" r="3" fill="var(--Main-Purple)" stroke="white" strokeWidth="1"/>
                  <circle cx="260" cy="60" r="3" fill="var(--Main-Purple)" stroke="white" strokeWidth="1"/>
                  <circle cx="310" cy="75" r="3" fill="var(--Main-Purple)" stroke="white" strokeWidth="1"/>
                  <circle cx="360" cy="65" r="3" fill="var(--Main-Purple)" stroke="white" strokeWidth="1"/>
                  <circle cx="410" cy="55" r="3" fill="var(--Main-Purple)" stroke="white" strokeWidth="1"/>
                  
                  {/* Highlight point for September */}
                  <circle cx="460" cy="30" r="6" fill="var(--Main-Purple)" stroke="white" strokeWidth="2"/>
                  <text x="460" y="20" className="highlight-label">92%</text>
                  
                  <circle cx="510" cy="45" r="3" fill="var(--Main-Purple)" stroke="white" strokeWidth="1"/>
                  <circle cx="560" cy="50" r="3" fill="var(--Main-Purple)" stroke="white" strokeWidth="1"/>
                  <circle cx="610" cy="40" r="3" fill="var(--Main-Purple)" stroke="white" strokeWidth="1"/>
                </svg>
              </div>
              
              {/* Key Metrics Cards - 2x2 Grid */}
              <div className="metrics-cards-grid">
                <div className="metric-card-small">
                  <div className="metric-icon-small">📊</div>
                  <div className="metric-content-small">
                    <div className="metric-value-small">87%</div>
                    <div className="metric-change-small positive">↑15%</div>
                    <div className="metric-label-small">실습 정확도</div>
                  </div>
                </div>
                <div className="metric-card-small">
                  <div className="metric-icon-small">📈</div>
                  <div className="metric-content-small">
                    <div className="metric-value-small">91%</div>
                    <div className="metric-change-small positive">↑15%</div>
                    <div className="metric-label-small">반복 학습 참여율</div>
                  </div>
                </div>
                <div className="metric-card-small">
                  <div className="metric-icon-small">📉</div>
                  <div className="metric-content-small">
                    <div className="metric-value-small">12%</div>
                    <div className="metric-change-small negative">↓8%</div>
                    <div className="metric-label-small">실습 오류율</div>
                  </div>
                </div>
                <div className="metric-card-small">
                  <div className="metric-icon-small">🎯</div>
                  <div className="metric-content-small">
                    <div className="metric-value-small">60%</div>
                    <div className="metric-change-small positive">↑8%</div>
                    <div className="metric-label-small">반복 학습 개선도</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Download Section */}
          <div className="content-card">
            <div className="card-title">리포트 다운로드</div>
            <div className="report-controls">
              <div className="search-section">
                <input 
                  type="text" 
                  placeholder="검색" 
                  className="report-search"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="controls-section">
                <button type="button" className="select-download-btn">선택 다운로드</button>
                <select className="category-select">
                  <option>구분</option>
                  <option>성과 리포트</option>
                  <option>학생 성적표</option>
                  <option>기타</option>
                </select>
                <select className="sort-select">
                  <option>정렬</option>
                  <option>날짜순</option>
                  <option>이름순</option>
                  <option>구분순</option>
                </select>
              </div>
            </div>
            
            <div className="report-table">
              <div className="table-header">
                <div className="header-cell checkbox-cell">
                  <input type="checkbox" />
                </div>
                <div className="header-cell">파일명</div>
                <div className="header-cell">구분</div>
                <div className="header-cell">날짜</div>
                <div className="header-cell">다운로드</div>
              </div>
              
              <div className="table-body">
                <div className="table-row">
                  <div className="table-cell checkbox-cell">
                    <input type="checkbox" />
                  </div>
                  <div className="table-cell">반 / 학년 성과 리포트</div>
                  <div className="table-cell">성과 리포트</div>
                  <div className="table-cell">2025.02.13</div>
                  <div className="table-cell actions">
                    <button type="button" className="download-btn">⬇️</button>
                    <button type="button" className="delete-btn">🗑️</button>
                  </div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell checkbox-cell">
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="table-cell">교수자 피드백 로그</div>
                  <div className="table-cell">기타</div>
                  <div className="table-cell">2025.02.13</div>
                  <div className="table-cell actions">
                    <button type="button" className="download-btn">⬇️</button>
                    <button type="button" className="delete-btn">🗑️</button>
                  </div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell checkbox-cell">
                    <input type="checkbox" />
                  </div>
                  <div className="table-cell">김지수 / 202510325</div>
                  <div className="table-cell">학생 성적표</div>
                  <div className="table-cell">2025.02.13</div>
                  <div className="table-cell actions">
                    <button type="button" className="download-btn">⬇️</button>
                    <button type="button" className="delete-btn">🗑️</button>
                  </div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell checkbox-cell">
                    <input type="checkbox" />
                  </div>
                  <div className="table-cell">나현성 / 202510325</div>
                  <div className="table-cell">학생 성적표</div>
                  <div className="table-cell">2025.02.13</div>
                  <div className="table-cell actions">
                    <button type="button" className="download-btn">⬇️</button>
                    <button type="button" className="delete-btn">🗑️</button>
                  </div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell checkbox-cell">
                    <input type="checkbox" />
                  </div>
                  <div className="table-cell">김재윤 / 202510325</div>
                  <div className="table-cell">학생 성적표</div>
                  <div className="table-cell">2025.02.13</div>
                  <div className="table-cell actions">
                    <button type="button" className="download-btn">⬇️</button>
                    <button type="button" className="delete-btn">🗑️</button>
                  </div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell checkbox-cell">
                    <input type="checkbox" />
                  </div>
                  <div className="table-cell">김수빈 / 202510325</div>
                  <div className="table-cell">학생 성적표</div>
                  <div className="table-cell">2025.02.13</div>
                  <div className="table-cell actions">
                    <button type="button" className="download-btn">⬇️</button>
                    <button type="button" className="delete-btn">🗑️</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pagination">
              <button type="button" className="pagination-btn">이전</button>
              <span className="pagination-info">1페이지 / 총 12페이지</span>
              <button type="button" className="pagination-btn">다음</button>
            </div>
          </div>
        </div>
      ) : activeMenu === '메시지' ? (
        <div className="main-content">
          <div className="content-card">
            <div className="card-title">메시지</div>
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>💬 메시지 관리</h3>
                <p>학생들과의 소통을 위한 메시지 시스템입니다.</p>
              </div>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', minWidth: '150px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📨</div>
                  <div style={{ fontWeight: '600' }}>받은 메시지</div>
                </div>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', minWidth: '150px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📤</div>
                  <div style={{ fontWeight: '600' }}>보낸 메시지</div>
                </div>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', minWidth: '150px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📢</div>
                  <div style={{ fontWeight: '600' }}>공지사항</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeMenu === '프로필' ? (
        <div className="main-content">
          <div className="content-card">
            <div className="card-title">프로필 관리</div>
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>👤 개인 정보 관리</h3>
                <p>교수님의 프로필 정보를 관리하고 업데이트할 수 있습니다.</p>
              </div>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', minWidth: '150px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📝</div>
                  <div style={{ fontWeight: '600' }}>기본 정보</div>
                </div>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', minWidth: '150px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔐</div>
                  <div style={{ fontWeight: '600' }}>보안 설정</div>
                </div>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', minWidth: '150px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎨</div>
                  <div style={{ fontWeight: '600' }}>테마 설정</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeMenu === '설정' ? (
        <div className="main-content">
          <div className="content-card">
            <div className="card-title">시스템 설정</div>
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>⚙️ 시스템 관리</h3>
                <p>시스템 전반의 설정을 관리하고 구성할 수 있습니다.</p>
        </div>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', minWidth: '150px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔧</div>
                  <div style={{ fontWeight: '600' }}>일반 설정</div>
      </div>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', minWidth: '150px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
                  <div style={{ fontWeight: '600' }}>사용자 관리</div>
                </div>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', minWidth: '150px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                  <div style={{ fontWeight: '600' }}>데이터 관리</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeMenu === '로그아웃' ? (
        <div className="main-content">
          <div className="content-card">
            <div className="card-title">로그아웃</div>
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>🚪 로그아웃</h3>
                <p>안전하게 시스템에서 로그아웃하시겠습니까?</p>
              </div>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', minWidth: '150px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
                  <div style={{ fontWeight: '600' }}>확인</div>
                </div>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', minWidth: '150px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>❌</div>
                  <div style={{ fontWeight: '600' }}>취소</div>
                </div>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', minWidth: '150px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>💾</div>
                  <div style={{ fontWeight: '600' }}>데이터 저장</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="header__search">
            <input 
              type="text" 
                  placeholder="검색" 
              className="header__search-input"
              aria-label="검색"
            />
          </div>
          <div className="header__actions">
            <div className="header__live-indicator">
              <div className={`header__live-dot ${liveData.isLive ? 'header__live-dot--pulsing' : ''}`}></div>
              <span className="header__live-text">실시간</span>
              <span className="header__live-time">
                    {liveData.currentTime.toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
            <div className="header__notifications">
              <div className="header__notification-icon" aria-label="알림">
                    🔔
                    {liveData.newMessages > 0 && (
                      <div className="notification-badge">{liveData.newMessages}</div>
                    )}
                  </div>
              <div className="header__notification-icon" aria-label="설정">⚙️</div>
            </div>
            <div className="header__profile">
              <div className="header__profile-picture" aria-label="프로필">교수</div>
              <div className="header__profile-name">김교수</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card purple live-updating">
            <div className="metric-title">학습자 수</div>
            <div className="metric-value" aria-label={`학습자 수 ${formatNumber(animatedValues.learners)}명`}>
              {formatNumber(animatedValues.learners)}
            </div>
            <div className="metric-change positive">↑15%</div>
            <div className="live-indicator-small" aria-label="실시간 업데이트">●</div>
          </div>
          
          <div className="metric-card yellow live-updating">
            <div className="metric-title">평균 성취율</div>
            <div className="metric-value" aria-label={`평균 성취율 ${animatedValues.achievement}퍼센트`}>
              {animatedValues.achievement}%
            </div>
            <div className="metric-change negative">↓3%</div>
            <div className="live-indicator-small" aria-label="실시간 업데이트">●</div>
          </div>
          
          <div className="metric-card yellow live-updating">
            <div className="metric-title">평균 학습 진도율</div>
            <div className="metric-value" aria-label={`평균 학습 진도율 ${formatNumber(animatedValues.progress)}`}>
              {formatNumber(animatedValues.progress)}
            </div>
            <div className="metric-change negative">↓3%</div>
            <div className="live-indicator-small" aria-label="실시간 업데이트">●</div>
          </div>
          
          <div className="metric-card yellow live-updating">
            <div className="metric-title">평균 활용 시간</div>
            <div className="metric-value" aria-label={`평균 활용 시간 ${formatTime(animatedValues.utilization)}`}>
              {formatTime(animatedValues.utilization)}
            </div>
            <div className="metric-change positive">↑12%</div>
            <div className="live-indicator-small" aria-label="실시간 업데이트">●</div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Left Column */}
          <div className="left-column">
            <div className="content-card">
              <div className="card-title">
                성취율 분포
                <div className="card-options">⋯</div>
              </div>
              <div className="donut-chart">
                <div className="donut-center">
                  <div className="donut-percentage">80%</div>
                </div>
                <div className="donut-legend">
                  <div className="legend-item">
                    <div className="legend-color purple"></div>
                    <div className="legend-text">
                      <div className="legend-label">합격</div>
                      <div className="legend-percentage">50%</div>
                    </div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color yellow"></div>
                    <div className="legend-text">
                      <div className="legend-label">불합격</div>
                      <div className="legend-percentage">54%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="content-card">
              <div className="card-title">학생 성장 그래프</div>
              <div className="line-chart">
                <div className="chart-header">
                  <div className="chart-legend">
                    <div className="legend-dot purple"></div>
                    <span>성취율</span>
                  </div>
                </div>
                
                {/* X-axis at the top */}
                <div className="x-axis-top">
                  {MONTH_NAMES.map((month, index) => (
                    <div 
                      key={index}
                      className={`x-label ${selectedMonth === month ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMonthClick(month);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${month} 선택`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleMonthClick(month);
                        }
                      }}
                    >
                      {month}
                    </div>
                  ))}
                </div>
                
                <div className="line-chart-container">
                  <div className="y-axis">
                    <div className="y-label">100</div>
                    <div className="y-label">75</div>
                    <div className="y-label">50</div>
                    <div className="y-label">25</div>
                    <div className="y-label">0</div>
                  </div>
                  <div className="chart-area">
                    <svg className="line-graph" viewBox="0 0 400 200">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="var(--Main-Purple)" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="var(--Main-Purple)" stopOpacity="0.1"/>
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {/* Generate path and area based on actual data */}
                      {(() => {
                        const points = graphData.map((point, index) => {
                          const x = 20 + (index * (360 / (graphData.length - 1)));
                          const y = 200 - (point.value * 1.5);
                          return { x, y };
                        });
                        
                        // Create path that goes through all points exactly
                        let pathData = `M ${points[0].x} ${points[0].y}`;
                        for (let i = 1; i < points.length; i++) {
                          pathData += ` L ${points[i].x} ${points[i].y}`;
                        }
                        
                        // Create area fill path
                        const areaPath = `${pathData} L ${points[points.length - 1].x} 200 L 20 200 Z`;
                        
                        return (
                          <>
                            <path 
                              d={areaPath}
                              fill="url(#lineGradient)"
                              className={`area-fill ${isAnimating ? 'animating' : ''}`}
                            />
                            <path 
                              d={pathData}
                              stroke="var(--Main-Purple)"
                              strokeWidth="2.5"
                              fill="none"
                              className={`line-path ${isAnimating ? 'animating' : ''}`}
                              filter="url(#glow)"
                            />
                          </>
                        );
                      })()}
                      
                      {/* Interactive data points */}
                      {graphData.map((point, index) => {
                        const x = 20 + (index * (360 / (graphData.length - 1)));
                        const y = 200 - (point.value * 1.5);
                        const isHovered = hoveredPoint === index;
                        const isSelected = selectedMonth === point.month;
                        
                        return (
                          <g key={index}>
                            {/* Highlight area for selected month */}
                            {isSelected && (
                              <rect 
                                x={x - 12} 
                                y={y - 20} 
                                width="24" 
                                height="40" 
                                fill="rgba(139, 92, 246, 0.08)"
                                rx="4"
                                className="highlight-area"
                              />
                            )}
                            
                            {/* Data point circle */}
                            <circle 
                              cx={x} 
                              cy={y} 
                              r={isHovered ? "5" : "3"} 
                              fill="var(--Main-Purple)"
                              className={`data-point ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}
                              onMouseEnter={() => handlePointHover(index)}
                              onMouseLeave={handlePointLeave}
                              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                            />
                            
                            {/* Glow effect for hovered point */}
                            {isHovered && (
                              <circle 
                                cx={x} 
                                cy={y} 
                                r="8" 
                                fill="var(--Main-Purple)"
                                opacity="0.3"
                                className="data-point-glow"
                              />
                            )}
                          </g>
                        );
                      })}
                    </svg>
                    
                    {/* Dynamic tooltip */}
                    {hoveredPoint !== null && (
                      <div 
                        className="tooltip"
                        style={{
                          left: `${20 + (hoveredPoint * (360 / (graphData.length - 1)))}px`,
                          top: `${200 - (graphData[hoveredPoint].value * 1.5) - 60}px`
                        }}
                      >
                        <div className="tooltip-date">{graphData[hoveredPoint].date}</div>
                        <div className="tooltip-value">
                          <div className="tooltip-dot purple"></div>
                          <span>{graphData[hoveredPoint].value}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Studio Module Usage TOP 3 */}
            <div className="content-card">
              <div className="card-title">
                Studio 모듈 사용 TOP 3
                <div className="card-options">전체보기</div>
              </div>
              <div className="studio-top-list">
                <div className="studio-item">
                  <div className="studio-icon blue">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#3498DB"/>
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="#F1C40F"/>
                    </svg>
                  </div>
                  <div className="studio-info">
                    <div className="studio-name">김재윤</div>
                    <div className="studio-id">202510325</div>
                  </div>
                  <div className="studio-duration">5시간 2분</div>
                </div>
                
                <div className="studio-item">
                  <div className="studio-icon purple">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="#9B59B6"/>
                    </svg>
                  </div>
                  <div className="studio-info">
                    <div className="studio-name">박지원</div>
                    <div className="studio-id">202512342</div>
                  </div>
                  <div className="studio-duration">3시간 22분</div>
                </div>
                
                <div className="studio-item">
                  <div className="studio-icon yellow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M14 9V5H3V19H21V9H14ZM12 1L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 1Z" fill="#F1C40F"/>
                    </svg>
                  </div>
                  <div className="studio-info">
                    <div className="studio-name">이진수</div>
                    <div className="studio-id">202212315</div>
                  </div>
                  <div className="studio-duration">2시간 59분</div>
                </div>
              </div>
            </div>
            
            {/* Re-education Recommended Items */}
            <div className="content-card">
              <div className="card-title">
                재교육 권장 항목 리스트
                <div className="card-options">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6H21V8H3V6ZM3 11H21V13H3V11ZM3 16H21V18H3V16Z" fill="#666"/>
                  </svg>
                </div>
              </div>
              <div className="reeducation-list">
                <div className="reeducation-item">
                  <div className="reeducation-thumbnail"></div>
                  <div className="reeducation-content">
                    <div className="reeducation-title">IM Injection Step 2 반복학습</div>
                    <div className="reeducation-professor">홍지연 교수</div>
                  </div>
                  <div className="reeducation-tag communication">의사소통</div>
                </div>
                
                <div className="reeducation-item">
                  <div className="reeducation-thumbnail"></div>
                  <div className="reeducation-content">
                    <div className="reeducation-title">IM Injection Step 2 반복학습 IM Injection Step 2 반복학습 IM Injection Step 2 반복학습</div>
                    <div className="reeducation-professor">이연수 교수</div>
                  </div>
                  <div className="reeducation-tag injection">근육주사</div>
                </div>
                
                <div className="reeducation-item">
                  <div className="reeducation-thumbnail"></div>
                  <div className="reeducation-content">
                    <div className="reeducation-title">IM Injection Step 2 반복학습</div>
                    <div className="reeducation-professor">백현수 교수</div>
                  </div>
                  <div className="reeducation-tag communication">의사소통</div>
                </div>
                
                <div className="reeducation-item">
                  <div className="reeducation-thumbnail"></div>
                  <div className="reeducation-content">
                    <div className="reeducation-title">IM Injection Step 2 반복학습</div>
                    <div className="reeducation-professor">윤지혜 교수</div>
                  </div>
                  <div className="reeducation-tag communication">의사소통</div>
                </div>
                
                <div className="reeducation-item">
                  <div className="reeducation-thumbnail"></div>
                  <div className="reeducation-content">
                    <div className="reeducation-title">IM Injection Step 2 반복학습</div>
                    <div className="reeducation-professor">이미영 교수</div>
                  </div>
                  <div className="reeducation-tag communication">의사소통</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Calendar */}
            <div className="content-card">
              <div className="calendar-header">
                <button 
                  type="button"
                  className="calendar-nav" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigateMonth(-1);
                  }}
                  aria-label="이전 달"
                >
                  ‹
                </button>
                <div className="calendar-month-year">{formatMonthYear(currentDate)}</div>
                <button 
                  type="button"
                  className="calendar-nav" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigateMonth(1);
                  }}
                  aria-label="다음 달"
                >
                  ›
                </button>
              </div>
              
              <div className="calendar-weekdays">
                {WEEKDAY_NAMES.map((weekday) => (
                  <div key={weekday} className="weekday">{weekday}</div>
                ))}
              </div>
              
              <div className="calendar-dates">
                {calendarData.slice(0, 7).map((date, index) => (
                  <div 
                    key={index}
                    className={`calendar-date ${selectedDate === date ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDateClick(date);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${date}일 선택`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleDateClick(date);
                      }
                    }}
                  >
                    {date}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Today's Schedule */}
            <div className="content-card">
              <div className="card-title">
                오늘 일정
                <div className="card-options">⋯</div>
                </div>
              <div className="schedule-list">
                <div className="schedule-item purple-bg">
                  <div className="schedule-time">08:00 am</div>
                  <div className="schedule-location">21관 409호</div>
                  <div className="schedule-content">일정내용 일정내용일정내용</div>
                </div>
                <div className="schedule-item yellow-bg">
                  <div className="schedule-time">10:00 am</div>
                  <div className="schedule-location">21관 409호</div>
                  <div className="schedule-content">일정내용 일정내용일정내용</div>
                </div>
                <div className="schedule-item purple-bg">
                  <div className="schedule-time">10:30 am</div>
                  <div className="schedule-location">21관 409호</div>
                  <div className="schedule-content">일정내용 일정내용일정내용</div>
                </div>
              </div>
            </div>
            
            {/* Practice Schedule */}
            <div className="content-card">
              <div className="card-title">
                실습 일정, 평가일
                <div className="card-options">전체보기</div>
              </div>
              <div className="practice-schedule">
                <div className="schedule-date">2025. 09. 23</div>
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-title">IM Injection Step 2 평가</div>
                      <div className="timeline-location">21건물 119호실</div>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-title">IM Injection Step 2 평가</div>
                      <div className="timeline-location">21건물 119호실</div>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-title">IM Injection Step 2 평가</div>
                      <div className="timeline-location">21건물 119호실</div>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-title">IM Injection Step 2 평가</div>
                      <div className="timeline-location">21건물 119호실</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Evaluation Performance */}
            <div className="content-card">
              <div className="card-title">평가 항목별 성과</div>
              <div className="bar-chart">
                <div className="chart-controls">
                  <select 
                    className="chart-select"
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                    aria-label="주차 선택"
                  >
                    {WEEK_OPTIONS.map((week) => (
                      <option key={week} value={week}>{week}</option>
                    ))}
                  </select>
                  <select 
                    className="chart-select"
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    aria-label="학년 선택"
                  >
                    {GRADE_OPTIONS.map((grade) => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div className="chart-legend">
                  <div className="legend-dot yellow"></div>
                  <span>평가 결과</span>
                </div>
                <div className="bar-chart-container">
                  {barData.map((item, index) => (
                    <div className="bar-item" key={index}>
                      <div className="bar-label">{item.label}</div>
                      <div className="bar-wrapper">
                        <div 
                          className="bar" 
                          style={{width: `${item.value}%`}}
                          aria-label={`${item.label} ${item.value}퍼센트`}
                        ></div>
                        {item.label === '의사소통' && (
                          <div className="bar-tooltip">95 Present</div>
                        )}
                      </div>
                      <div className="bar-value">{item.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Additional Metrics */}
            <div className="additional-metrics">
              <div className="metric-card yellow">
                <div className="metric-icon attendance-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14ZM17 1H23V3H17V1ZM17 5H23V7H17V5ZM17 9H23V11H17V9Z" fill="#3498DB"/>
                  </svg>
                </div>
                <div className="metric-content">
                  <div className="metric-title">출석률 현황</div>
                  <div className="metric-value" aria-label={`출석률 ${animatedValues.attendance}퍼센트`}>
                    {animatedValues.attendance}%
                  </div>
                  <div className="metric-change negative">↓15%</div>
                </div>
              </div>
              
              <div className="metric-card yellow">
                <div className="metric-icon utilization-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16V4C22 3.45 21.55 3 21 3H3C2.45 3 2 3.45 2 4V16C2 16.55 2.45 17 3 17H1V19H23V17H21C21.55 17 22 16.55 22 16ZM11 12L7 8H10L14 12L10 16H7L11 12Z" fill="#F1C40F"/>
                  </svg>
                </div>
                <div className="metric-content">
                  <div className="metric-title">활용 시간</div>
                  <div className="metric-value" aria-label={`활용 시간 ${formatTime(animatedValues.usageTime)}`}>
                    {formatTime(animatedValues.usageTime)}
                  </div>
                  <div className="metric-change negative">↓8%</div>
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <div className="content-card">
              <div className="card-title">
                메시지
                <div className="card-options">전체보기</div>
              </div>
              <div className="message-list">
                <div className="message-item">
                  <div className="message-avatar">김</div>
                  <div className="message-content">
                    <div className="message-name">김재윤</div>
                    <div className="message-text">교수님 안녕하세요! 이번 주 제출하는 간호과정 과제 관련해서 여쭤볼 게 있습니다</div>
                    <div className="message-time">9:00 AM</div>
                  </div>
                </div>
                <div className="message-item">
                  <div className="message-avatar">김</div>
                  <div className="message-content">
                    <div className="message-name">김지현</div>
                    <div className="message-text">환자 사례를 작성할 때, 간호진단을 2개 이상 적어야 하나요? 아니면 1개만 해도 될까요?</div>
                    <div className="message-time">10:15 AM</div>
                  </div>
                  <div className="message-notification">4</div>
                </div>
                <div className="message-item">
                  <div className="message-avatar">나</div>
                  <div className="message-content">
                    <div className="message-name">나현성</div>
                    <div className="message-text">환자 사례를 작성할 때, 간호진단을 2개 이상 적어야 하나요? 아니면 1개만 해도 될까요?</div>
                    <div className="message-time">2:00 PM</div>
                  </div>
                </div>
                <div className="message-item">
                  <div className="message-avatar">이</div>
                  <div className="message-content">
                    <div className="message-name">이진수</div>
                    <div className="message-text">환자 사례를 작성할 때, 간호진단을 2개 이상 적어야 하나요? 아니면 1개만 해도 될까요?</div>
                    <div className="message-time">3:10 PM</div>
                  </div>
                  <div className="message-notification">2</div>
                </div>
                <div className="message-item">
                  <div className="message-avatar">박</div>
                  <div className="message-content">
                    <div className="message-name">박지원</div>
                    <div className="message-text">환자 사례를 작성할 때, 간호진단을 2개 이상 적어야 하나요? 아니면 1개만 해도 될까요?</div>
                    <div className="message-time">5:00 PM</div>
                  </div>
                  <div className="message-notification">6</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">
          <div className="bottom-left">
            {/* Empty space or additional content can be added here */}
          </div>
          
          <div className="bottom-right">
            {/* Empty space or additional content can be added here */}
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-left">
            <span>Info@gridatech.com</span>
            <span>051-710-2778</span>
          </div>
          <div className="footer-right">
            <button type="button" className="footer-link">Terms of Use</button>
            <button type="button" className="footer-link">Privacy Policy</button>
            <span>Copyright © Peterdraw</span>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default App;

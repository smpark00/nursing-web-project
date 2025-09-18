// Time formatting utilities
export const formatTime = (minutes) => {
  if (typeof minutes !== 'number' || minutes < 0) {
    return '0시간 0분';
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}시간 ${mins}분`;
};

// Date formatting utilities
export const formatMonthYear = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '2024.01';
  }
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
};

// Get current time in Seoul timezone
export const getSeoulTime = () => {
  try {
    return new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
  } catch (error) {
    console.warn('Failed to get Seoul time:', error);
    return new Date();
  }
};

// Calendar data generation
export const getCalendarData = (currentDate) => {
  if (!(currentDate instanceof Date) || isNaN(currentDate.getTime())) {
    return [];
  }
  
  try {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    // eslint-disable-next-line no-unused-vars
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendarDays = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      calendarDays.push(date.getDate());
    }
    
    return calendarDays;
  } catch (error) {
    console.warn('Failed to generate calendar data:', error);
    return [];
  }
};

// Data validation utilities
export const validateGraphData = (data) => {
  if (!Array.isArray(data)) return false;
  return data.every(item => 
    item && 
    typeof item.month === 'string' && 
    typeof item.value === 'number' && 
    item.value >= 0 && item.value <= 100 &&
    typeof item.date === 'string'
  );
};

export const validateBarData = (data) => {
  if (!Array.isArray(data)) return false;
  return data.every(item => 
    item && 
    typeof item.label === 'string' && 
    typeof item.value === 'number' && 
    item.value >= 0 && item.value <= 100
  );
};

// Random number generation with bounds
export const getRandomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Safe number formatting
export const formatNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return num.toLocaleString();
};

// Animation easing functions
export const easeInOut = (t) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

// Debounce function for performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

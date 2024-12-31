const dateUtils = {
    formatDateRange(startDate, endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
  
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
  
      return { startDate: start, endDate: end };
    },
  
    getStartOfDay() {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return now;
    },
  
    getStartOfMonth() {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), 1);
    }
  };
  
  module.exports = dateUtils;
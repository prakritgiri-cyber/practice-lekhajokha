// Mock data for LekhaJokha app
import NepaliDate from 'nepali-date-converter';

const currentNepaliDate = new NepaliDate();
const currentMonth = currentNepaliDate.getMonth();
const currentYear = currentNepaliDate.getYear();

export const mockUser = {
  id: '1',
  monthlyBudget: 15000,
  currentMonth: currentMonth,
  currentYear: currentYear,
  budgetSetDate: currentNepaliDate.format('YYYY-MM-DD'),
  darkMode: false,
  customCategories: [
    { id: 'custom1', name: 'Entertainment', icon: 'Tv' },
    { id: 'custom2', name: 'Clothing', icon: 'Shirt' }
  ]
};

// Generate expenses for the current week
const generateWeeklyExpenses = () => {
  const expenses = [];
  const today = new Date();
  // Set to start of day to avoid time comparison issues
  today.setHours(0, 0, 0, 0);
  
  // Add expenses for each day of the last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const nepaliDate = new NepaliDate(date);
    
    // Vary expenses by day
    if (i === 0) {
      // Today
      expenses.push({
        id: `exp-${Date.now()}-${i}-1`,
        category: 'Food',
        amount: 450,
        description: 'Lunch at college canteen',
        date: nepaliDate.format('YYYY-MM-DD'),
        englishDate: date.toISOString(),
        icon: 'Utensils'
      });
      expenses.push({
        id: `exp-${Date.now()}-${i}-2`,
        category: 'Transport',
        amount: 120,
        description: 'Bus fare',
        date: nepaliDate.format('YYYY-MM-DD'),
        englishDate: date.toISOString(),
        icon: 'Bus'
      });
    } else if (i === 1) {
      expenses.push({
        id: `exp-${Date.now()}-${i}-1`,
        category: 'Stationery',
        amount: 280,
        description: 'Notebooks and pens',
        date: nepaliDate.format('YYYY-MM-DD'),
        englishDate: date.toISOString(),
        icon: 'BookOpen'
      });
      expenses.push({
        id: `exp-${Date.now()}-${i}-2`,
        category: 'Food',
        amount: 350,
        description: 'Snacks',
        date: nepaliDate.format('YYYY-MM-DD'),
        englishDate: date.toISOString(),
        icon: 'Utensils'
      });
    } else if (i === 2) {
      expenses.push({
        id: `exp-${Date.now()}-${i}-1`,
        category: 'Internet',
        amount: 600,
        description: 'Monthly data pack',
        date: nepaliDate.format('YYYY-MM-DD'),
        englishDate: date.toISOString(),
        icon: 'Wifi'
      });
    } else if (i === 3) {
      expenses.push({
        id: `exp-${Date.now()}-${i}-1`,
        category: 'Food',
        amount: 400,
        description: 'Dinner with friends',
        date: nepaliDate.format('YYYY-MM-DD'),
        englishDate: date.toISOString(),
        icon: 'Utensils'
      });
      expenses.push({
        id: `exp-${Date.now()}-${i}-2`,
        category: 'Transport',
        amount: 80,
        description: 'Taxi',
        date: nepaliDate.format('YYYY-MM-DD'),
        englishDate: date.toISOString(),
        icon: 'Bus'
      });
    } else if (i === 4) {
      expenses.push({
        id: `exp-${Date.now()}-${i}-1`,
        category: 'Education',
        amount: 1200,
        description: 'Course materials',
        date: nepaliDate.format('YYYY-MM-DD'),
        englishDate: date.toISOString(),
        icon: 'GraduationCap'
      });
    } else if (i === 5) {
      expenses.push({
        id: `exp-${Date.now()}-${i}-1`,
        category: 'Groceries',
        amount: 850,
        description: 'Weekly groceries',
        date: nepaliDate.format('YYYY-MM-DD'),
        englishDate: date.toISOString(),
        icon: 'ShoppingCart'
      });
    } else if (i === 6) {
      expenses.push({
        id: `exp-${Date.now()}-${i}-1`,
        category: 'Entertainment',
        amount: 500,
        description: 'Movie tickets',
        date: nepaliDate.format('YYYY-MM-DD'),
        englishDate: date.toISOString(),
        icon: 'Tv'
      });
      expenses.push({
        id: `exp-${Date.now()}-${i}-2`,
        category: 'Food',
        amount: 300,
        description: 'Breakfast',
        date: nepaliDate.format('YYYY-MM-DD'),
        englishDate: date.toISOString(),
        icon: 'Utensils'
      });
    }
  }
  
  return expenses;
};

export const mockExpenses = generateWeeklyExpenses();

export const defaultCategories = [
  { id: 'food', name: 'Food', icon: 'Utensils', color: '#22c55e' },
  { id: 'groceries', name: 'Groceries', icon: 'ShoppingCart', color: '#3b82f6' },
  { id: 'stationery', name: 'Stationery', icon: 'BookOpen', color: '#a855f7' },
  { id: 'transport', name: 'Transport', icon: 'Bus', color: '#f59e0b' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: '#ec4899' },
  { id: 'internet', name: 'Internet', icon: 'Wifi', color: '#06b6d4' },
  { id: 'health', name: 'Health', icon: 'Heart', color: '#ef4444' },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal', color: '#6b7280' }
];

export const mockStreak = {
  current: 12,
  longest: 25,
  lastEntry: currentNepaliDate.format('YYYY-MM-DD')
};

export const motivationalQuotes = [
  "Small savings today, big dreams tomorrow! 🌱",
  "Every rupee saved is a rupee earned! 💚",
  "Track your spending, grow your future! 📈",
  "Financial discipline leads to freedom! 🎯",
  "Save today for a better tomorrow! ✨",
  "Your future self will thank you! 🙏"
];

export const getTodayExpenseTotal = () => {
  const today = currentNepaliDate.format('YYYY-MM-DD');
  return mockExpenses
    .filter(exp => exp.date === today)
    .reduce((sum, exp) => sum + exp.amount, 0);
};

export const getMonthExpenseTotal = () => {
  return mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);
};

export const getRemainingBudget = () => {
  return mockUser.monthlyBudget - getMonthExpenseTotal();
};

export const getBudgetPercentage = () => {
  return ((getRemainingBudget() / mockUser.monthlyBudget) * 100).toFixed(1);
};
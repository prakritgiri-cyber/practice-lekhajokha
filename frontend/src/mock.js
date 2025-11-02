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

export const mockExpenses = [
  {
    id: '1',
    category: 'Food',
    amount: 450,
    description: 'Lunch at college canteen',
    date: currentNepaliDate.format('YYYY-MM-DD'),
    englishDate: new Date().toISOString(),
    icon: 'Utensils'
  },
  {
    id: '2',
    category: 'Transport',
    amount: 120,
    description: 'Bus fare',
    date: currentNepaliDate.format('YYYY-MM-DD'),
    englishDate: new Date().toISOString(),
    icon: 'Bus'
  },
  {
    id: '3',
    category: 'Stationery',
    amount: 280,
    description: 'Notebooks and pens',
    date: new NepaliDate(currentYear, currentMonth, currentNepaliDate.getDate() - 1).format('YYYY-MM-DD'),
    englishDate: new Date(Date.now() - 86400000).toISOString(),
    icon: 'BookOpen'
  },
  {
    id: '4',
    category: 'Internet',
    amount: 600,
    description: 'Monthly data pack',
    date: new NepaliDate(currentYear, currentMonth, currentNepaliDate.getDate() - 2).format('YYYY-MM-DD'),
    englishDate: new Date(Date.now() - 172800000).toISOString(),
    icon: 'Wifi'
  },
  {
    id: '5',
    category: 'Food',
    amount: 350,
    description: 'Dinner with friends',
    date: new NepaliDate(currentYear, currentMonth, currentNepaliDate.getDate() - 3).format('YYYY-MM-DD'),
    englishDate: new Date(Date.now() - 259200000).toISOString(),
    icon: 'Utensils'
  },
  {
    id: '6',
    category: 'Education',
    amount: 1200,
    description: 'Course materials',
    date: new NepaliDate(currentYear, currentMonth, currentNepaliDate.getDate() - 5).format('YYYY-MM-DD'),
    englishDate: new Date(Date.now() - 432000000).toISOString(),
    icon: 'GraduationCap'
  },
  {
    id: '7',
    category: 'Entertainment',
    amount: 500,
    description: 'Movie tickets',
    date: new NepaliDate(currentYear, currentMonth, currentNepaliDate.getDate() - 6).format('YYYY-MM-DD'),
    englishDate: new Date(Date.now() - 518400000).toISOString(),
    icon: 'Tv'
  }
];

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
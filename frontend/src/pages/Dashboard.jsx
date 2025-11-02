import React, { useState } from 'react';
import NepaliDate from 'nepali-date-converter';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { AlertTriangle, TrendingDown, Plus, Trash2, Edit2, Settings } from 'lucide-react';
import { defaultCategories, mockExpenses, mockUser, getTodayExpenseTotal, getRemainingBudget, getBudgetPercentage } from '../mock';
import IconPicker from '../components/IconPicker';
import { toast } from '../hooks/use-toast';

const Dashboard = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [user, setUser] = useState(mockUser);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: '',
    date: new NepaliDate().format('YYYY-MM-DD')
  });
  const [showCustomCategoryForm, setShowCustomCategoryForm] = useState(false);
  const [customCategory, setCustomCategory] = useState({ name: '', icon: 'MoreHorizontal' });
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editBudgetOpen, setEditBudgetOpen] = useState(false);
  const [newBudget, setNewBudget] = useState('');

  const todayTotal = getTodayExpenseTotal();
  const remaining = getRemainingBudget();
  const percentage = getBudgetPercentage();
  const isOverspending = todayTotal > 1000;

  const allCategories = [...defaultCategories, ...user.customCategories.map(c => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    color: '#10b981'
  }))];

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.amount) {
      toast({
        title: "Missing Information",
        description: "Please select a category and enter an amount.",
        variant: "destructive"
      });
      return;
    }

    const expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      date: newExpense.date,
      englishDate: new Date().toISOString(),
      icon: allCategories.find(c => c.name === newExpense.category)?.icon || 'MoreHorizontal'
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({
      category: '',
      amount: '',
      description: '',
      date: new NepaliDate().format('YYYY-MM-DD')
    });

    toast({
      title: "Expense Added!",
      description: `₨${expense.amount} for ${expense.category}`,
    });
  };

  const handleAddCustomCategory = () => {
    if (!customCategory.name) {
      toast({
        title: "Missing Name",
        description: "Please enter a category name.",
        variant: "destructive"
      });
      return;
    }

    const newCategory = {
      id: `custom-${Date.now()}`,
      name: customCategory.name,
      icon: customCategory.icon
    };

    setUser({
      ...user,
      customCategories: [...user.customCategories, newCategory]
    });

    setCustomCategory({ name: '', icon: 'MoreHorizontal' });
    setShowCustomCategoryForm(false);

    toast({
      title: "Category Added!",
      description: `${newCategory.name} is now available.`,
    });
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
    toast({
      title: "Expense Deleted",
      description: "The expense has been removed.",
    });
  };

  const groupExpensesByDate = () => {
    const grouped = {};
    expenses.forEach(expense => {
      if (!grouped[expense.date]) {
        grouped[expense.date] = [];
      }
      grouped[expense.date].push(expense);
    });
    return grouped;
  };

  const groupedExpenses = groupExpensesByDate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Warning Banner */}
        {isOverspending && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg flex items-center space-x-3 animate-pulse">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800 dark:text-red-300">Daily Spending Alert!</p>
              <p className="text-sm text-red-700 dark:text-red-400">
                You've spent ₨{todayTotal.toFixed(2)} today - over ₨1000 limit!
              </p>
            </div>
          </div>
        )}

        {/* Balance Tracker */}
        <Card className="mb-6 border-2 border-green-200 dark:border-green-800 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Budget</p>
              <div className="flex items-center justify-center space-x-2">
                <h2 className="text-4xl font-bold text-green-600 dark:text-green-400">
                  ₨{remaining.toFixed(2)}
                </h2>
                <Badge variant={percentage > 50 ? "default" : percentage > 20 ? "secondary" : "destructive"} className="text-lg px-3 py-1">
                  {percentage}%
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                of ₨{user.monthlyBudget.toFixed(2)} remaining
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    percentage > 50 ? 'bg-green-500' : percentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Add Expense Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-green-600" />
                <span>Add Expense</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Category Buttons */}
              <div>
                <Label>Quick Categories</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {allCategories.map(cat => {
                    const IconComponent = Icons[cat.icon] || Icons.MoreHorizontal;
                    return (
                      <Button
                        key={cat.id}
                        variant={newExpense.category === cat.name ? "default" : "outline"}
                        className={`flex flex-col items-center p-3 h-auto space-y-1 transition-all ${
                          newExpense.category === cat.name
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                        onClick={() => setNewExpense({ ...newExpense, category: cat.name })}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="text-xs">{cat.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Category Button */}
              {!showCustomCategoryForm && (
                <Button
                  variant="ghost"
                  className="w-full border border-dashed border-green-300 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                  onClick={() => setShowCustomCategoryForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Category
                </Button>
              )}

              {/* Custom Category Form */}
              {showCustomCategoryForm && (
                <Card className="border-green-200 dark:border-green-800">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIconPickerOpen(true)}
                        className="flex-shrink-0"
                      >
                        {React.createElement(Icons[customCategory.icon] || Icons.MoreHorizontal, {
                          className: 'w-5 h-5'
                        })}
                      </Button>
                      <Input
                        placeholder="Category name"
                        value={customCategory.name}
                        onChange={(e) => setCustomCategory({ ...customCategory, name: e.target.value })}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAddCustomCategory} className="flex-1 bg-green-600 hover:bg-green-700">
                        Add
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCustomCategoryForm(false);
                          setCustomCategory({ name: '', icon: 'MoreHorizontal' });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Amount */}
              <div>
                <Label htmlFor="amount">Amount (₨)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="text-lg"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What did you spend on?"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  rows={2}
                />
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
              </div>

              <Button
                onClick={handleAddExpense}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Add Expense
              </Button>
            </CardContent>
          </Card>

          {/* Expense List */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-green-600" />
                <span>Recent Expenses</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {Object.keys(groupedExpenses).length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No expenses yet. Start tracking!</p>
                ) : (
                  Object.keys(groupedExpenses)
                    .sort((a, b) => new Date(b) - new Date(a))
                    .map(date => (
                      <div key={date}>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sticky top-0 bg-white dark:bg-gray-800 py-1">
                          {date}
                        </h4>
                        <div className="space-y-2">
                          {groupedExpenses[date].map(expense => {
                            const IconComponent = Icons[expense.icon] || Icons.MoreHorizontal;
                            return (
                              <div
                                key={expense.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
                              >
                                <div className="flex items-center space-x-3 flex-1">
                                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <IconComponent className="w-5 h-5 text-green-600 dark:text-green-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                      {expense.category}
                                    </p>
                                    {expense.description && (
                                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                        {expense.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-gray-900 dark:text-gray-100">
                                    ₨{expense.amount.toFixed(2)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDeleteExpense(expense.id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Icon Picker Modal */}
      <IconPicker
        open={iconPickerOpen}
        onClose={() => setIconPickerOpen(false)}
        onSelectIcon={(icon) => setCustomCategory({ ...customCategory, icon })}
      />
    </div>
  );
};

export default Dashboard;
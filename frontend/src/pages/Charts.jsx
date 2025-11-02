import React, { useState, useMemo } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import NepaliDate from 'nepali-date-converter';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BarChart3, PieChart, Calendar as CalendarIcon } from 'lucide-react';
import { mockExpenses, defaultCategories, mockUser } from '../mock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Charts = () => {
  const [timeRange, setTimeRange] = useState('last7days'); // 'week' or 'last7days'

  // Get date ranges
  const getDateRange = () => {
    const currentNepaliDate = new NepaliDate();
    const today = new Date();

    if (timeRange === 'week') {
      // Current week (Sunday to Saturday)
      const dayOfWeek = today.getDay();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - dayOfWeek);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return { start: weekStart, end: weekEnd, label: 'This Week' };
    } else {
      // Last 7 days
      const last7Start = new Date(today);
      last7Start.setDate(today.getDate() - 6);
      return { start: last7Start, end: today, label: 'Last 7 Days' };
    }
  };

  const { start, end, label } = getDateRange();

  // Filter expenses by date range
  const filteredExpenses = mockExpenses.filter(expense => {
    const expenseDate = new Date(expense.englishDate);
    expenseDate.setHours(0, 0, 0, 0);
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    return expenseDate >= startDate && expenseDate <= endDate;
  });

  // Prepare weekly bar chart data
  const weeklyData = useMemo(() => {
    const days = [];
    const amounts = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      days.push(dayName);

      const dayTotal = filteredExpenses
        .filter(exp => {
          const expDate = new Date(exp.englishDate);
          return expDate.toDateString() === date.toDateString();
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      amounts.push(dayTotal);
    }

    return {
      labels: days,
      datasets: [
        {
          label: 'Daily Spending (₨)',
          data: amounts,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
          borderRadius: 8,
        }
      ]
    };
  }, [filteredExpenses, start]);

  // Prepare category pie chart data
  const categoryData = useMemo(() => {
    const categoryTotals = {};

    filteredExpenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    const colors = [
      '#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6',
      '#06b6d4', '#ef4444', '#64748b', '#10b981', '#f97316'
    ];

    return {
      labels: categories,
      datasets: [
        {
          label: 'Spending by Category (₨)',
          data: amounts,
          backgroundColor: colors.slice(0, categories.length),
          borderColor: '#ffffff',
          borderWidth: 2,
        }
      ]
    };
  }, [filteredExpenses]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            return `₨${context.parsed.y || context.parsed}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
          callback: function(value) {
            return '₨' + value;
          }
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)'
        }
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'
        },
        grid: {
          display: false
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
          font: {
            size: 12,
            weight: 500
          },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ₨${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  const totalSpending = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Spending Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize your expense patterns and trends
          </p>
        </div>

        {/* Time Range Toggle */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <Tabs value={timeRange} onValueChange={setTimeRange} className="w-full sm:w-auto">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="week" className="space-x-2">
                <CalendarIcon className="w-4 h-4" />
                <span>This Week</span>
              </TabsTrigger>
              <TabsTrigger value="last7days" className="space-x-2">
                <CalendarIcon className="w-4 h-4" />
                <span>Last 7 Days</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Spending</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₨{totalSpending.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{label}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Bar Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <span>Daily Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {filteredExpenses.length > 0 ? (
                  <Bar data={weeklyData} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No expenses in this period</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category Pie Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-green-600" />
                <span>Category Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {filteredExpenses.length > 0 ? (
                  <Doughnut data={categoryData} options={pieOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <PieChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No expenses in this period</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Summary Table */}
        {filteredExpenses.length > 0 && (
          <Card className="mt-6 shadow-lg">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                        Category
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                        Amount
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryData.labels.map((category, index) => {
                      const amount = categoryData.datasets[0].data[index];
                      const percentage = ((amount / totalSpending) * 100).toFixed(1);
                      return (
                        <tr
                          key={category}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: categoryData.datasets[0].backgroundColor[index] }}
                              />
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {category}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-gray-100">
                            ₨{amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                            {percentage}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold bg-green-50 dark:bg-green-900/20">
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">Total</td>
                      <td className="py-3 px-4 text-right text-green-600 dark:text-green-400">
                        ₨{totalSpending.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                        100%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Charts;
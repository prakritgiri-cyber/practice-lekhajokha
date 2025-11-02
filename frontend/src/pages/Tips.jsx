import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Lightbulb, TrendingDown, AlertCircle, CheckCircle, Target } from 'lucide-react';
import { mockExpenses, mockUser, getRemainingBudget, getBudgetPercentage } from '../mock';

const Tips = () => {
  const remaining = getRemainingBudget();
  const percentage = parseFloat(getBudgetPercentage());

  // Calculate category spending
  const categorySpending = useMemo(() => {
    const totals = {};
    mockExpenses.forEach(expense => {
      if (!totals[expense.category]) {
        totals[expense.category] = 0;
      }
      totals[expense.category] += expense.amount;
    });
    return totals;
  }, []);

  const totalSpent = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Generate rule-based tips
  const generateTips = () => {
    const tips = [];

    // Budget status tips
    if (percentage < 20) {
      tips.push({
        id: 1,
        type: 'warning',
        title: 'Budget Running Low!',
        description: `You have only ${percentage.toFixed(1)}% of your monthly budget remaining (₨${remaining.toFixed(2)}). Consider reducing non-essential spending for the rest of the month.`,
        icon: AlertCircle,
        color: 'red',
        savings: null
      });
    } else if (percentage > 60) {
      tips.push({
        id: 2,
        type: 'success',
        title: 'Great Job!',
        description: `You're doing well! You have ${percentage.toFixed(1)}% of your budget remaining (₨${remaining.toFixed(2)}). Keep up the good spending habits!`,
        icon: CheckCircle,
        color: 'green',
        savings: null
      });
    } else if (percentage > 30) {
      tips.push({
        id: 3,
        type: 'info',
        title: 'On Track',
        description: `You have ${percentage.toFixed(1)}% of your budget remaining (₨${remaining.toFixed(2)}). You're managing your expenses reasonably well.`,
        icon: Target,
        color: 'blue',
        savings: null
      });
    }

    // Category-specific tips
    Object.keys(categorySpending).forEach(category => {
      const amount = categorySpending[category];
      const categoryPercentage = ((amount / totalSpent) * 100).toFixed(1);

      // Food spending tips
      if (category === 'Food' && categoryPercentage > 35) {
        const potentialSavings = (amount * 0.15).toFixed(2);
        tips.push({
          id: `tip-food-${category}`,
          type: 'tip',
          title: 'Reduce Food Expenses',
          description: `You spent ${categoryPercentage}% of your budget on Food (₨${amount.toFixed(2)}). Consider meal prepping or eating at home more often.`,
          icon: Lightbulb,
          color: 'yellow',
          savings: `Cutting back by 15% could save you ₨${potentialSavings}/month`
        });
      }

      // Entertainment/Custom categories
      if ((category === 'Entertainment' || category === 'Clothing') && categoryPercentage > 20) {
        const potentialSavings = (amount * 0.20).toFixed(2);
        tips.push({
          id: `tip-entertainment-${category}`,
          type: 'tip',
          title: `Watch ${category} Spending`,
          description: `You spent ${categoryPercentage}% of your budget on ${category} (₨${amount.toFixed(2)}). Consider reducing discretionary expenses.`,
          icon: Lightbulb,
          color: 'yellow',
          savings: `Reducing by 20% could save you ₨${potentialSavings}/month`
        });
      }

      // Transport tips
      if (category === 'Transport' && categoryPercentage > 25) {
        const potentialSavings = (amount * 0.10).toFixed(2);
        tips.push({
          id: `tip-transport-${category}`,
          type: 'tip',
          title: 'Optimize Transportation',
          description: `You spent ${categoryPercentage}% on Transport (₨${amount.toFixed(2)}). Consider carpooling, using public transport, or walking short distances.`,
          icon: Lightbulb,
          color: 'yellow',
          savings: `Optimizing transport could save you ₨${potentialSavings}/month`
        });
      }

      // Education spending
      if (category === 'Education' && categoryPercentage > 30) {
        tips.push({
          id: `tip-education-${category}`,
          type: 'info',
          title: 'Education Investment',
          description: `You spent ${categoryPercentage}% on Education (₨${amount.toFixed(2)}). While this is a valuable investment, look for free online resources or library materials when possible.`,
          icon: Target,
          color: 'blue',
          savings: null
        });
      }
    });

    // General savings tips
    tips.push(
      {
        id: 'general-1',
        type: 'tip',
        title: 'Track Daily Spending',
        description: 'Try to limit daily expenses to ₨1000 or less. This helps you stay within your monthly budget and build better spending habits.',
        icon: Lightbulb,
        color: 'yellow',
        savings: null
      },
      {
        id: 'general-2',
        type: 'tip',
        title: 'Set Category Limits',
        description: 'Allocate specific amounts to each category (e.g., 30% for Food, 20% for Transport) and track your progress weekly.',
        icon: Target,
        color: 'blue',
        savings: null
      },
      {
        id: 'general-3',
        type: 'tip',
        title: 'Emergency Fund',
        description: 'Try to save at least 10-15% of your monthly budget for unexpected expenses. Small savings add up over time!',
        icon: CheckCircle,
        color: 'green',
        savings: null
      }
    );

    return tips;
  };

  const tips = generateTips();

  const getColorClasses = (color, type) => {
    const colors = {
      red: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        icon: 'text-red-500',
        badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
      },
      yellow: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        icon: 'text-yellow-500',
        badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        icon: 'text-green-500',
        badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        icon: 'text-blue-500',
        badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-4 shadow-lg">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Savings Tips & Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Personalized advice based on your spending patterns
          </p>
        </div>

        {/* Budget Overview Card */}
        <Card className="mb-6 shadow-lg border-2 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₨{totalSpent.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining Budget</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₨{remaining.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Budget Status</p>
                <Badge
                  variant={percentage > 50 ? "default" : percentage > 20 ? "secondary" : "destructive"}
                  className="text-lg px-3 py-1"
                >
                  {percentage.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips List */}
        <div className="space-y-4">
          {tips.map(tip => {
            const colorClasses = getColorClasses(tip.color, tip.type);
            const IconComponent = tip.icon;

            return (
              <Card
                key={tip.id}
                className={`${colorClasses.bg} ${colorClasses.border} border-l-4 shadow-md hover:shadow-lg transition-all duration-200`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm`}>
                      <IconComponent className={`w-6 h-6 ${colorClasses.icon}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {tip.title}
                        </h3>
                        <Badge className={colorClasses.badge}>
                          {tip.type === 'warning' ? 'Alert' : tip.type === 'success' ? 'Success' : tip.type === 'info' ? 'Info' : 'Tip'}
                        </Badge>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {tip.description}
                      </p>
                      {tip.savings && (
                        <div className="flex items-center space-x-2 text-sm font-semibold text-green-700 dark:text-green-400">
                          <TrendingDown className="w-4 h-4" />
                          <span>{tip.savings}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Resources */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Keep Going! 🌱</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                Remember, small changes in daily habits can lead to significant savings over time.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Track your expenses daily, review your spending weekly, and adjust your budget monthly for the best results.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tips;
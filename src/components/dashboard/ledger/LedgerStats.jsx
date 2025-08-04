import React from 'react';

const LedgerStats = ({ transactions }) => {
  const getStats = () => {
    // Calculate total income (all income transactions)
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    // Calculate total expenses (all expense transactions)
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    // Calculate net profit
    const netProfit = totalIncome - totalExpenses;
    
    // Count sales transactions
    const salesCount = transactions.filter(t => t.category === 'sales').length;
    
    // Count expense transactions
    const expenseCount = transactions.filter(t => t.type === 'expense').length;
    
    // Calculate monthly income (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= thirtyDaysAgo;
    });
    
    const monthlyIncome = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    const monthlyExpenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    // Calculate overdue payment sum
    const overduePayments = transactions
      .filter(t => t.paymentStatus === 'overdue')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    const overdueCount = transactions.filter(t => t.paymentStatus === 'overdue').length;
    
    // Calculate percentage changes (comparing with previous period)
    const previousPeriodTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return transactionDate >= sixtyDaysAgo && transactionDate < thirtyDaysAgo;
    });
    
    const previousMonthlyIncome = previousPeriodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    const previousMonthlyExpenses = previousPeriodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    // Calculate percentage changes
    const incomeChangePercent = previousMonthlyIncome > 0 
      ? ((monthlyIncome - previousMonthlyIncome) / previousMonthlyIncome * 100).toFixed(1)
      : monthlyIncome > 0 ? '+100.0' : '0.0';
    
    const expenseChangePercent = previousMonthlyExpenses > 0
      ? ((monthlyExpenses - previousMonthlyExpenses) / previousMonthlyExpenses * 100).toFixed(1)
      : monthlyExpenses > 0 ? '+100.0' : '0.0';
    
    const profitChangePercent = (previousMonthlyIncome - previousMonthlyExpenses) > 0
      ? (((netProfit - (previousMonthlyIncome - previousMonthlyExpenses)) / (previousMonthlyIncome - previousMonthlyExpenses)) * 100).toFixed(1)
      : netProfit > 0 ? '+100.0' : '0.0';

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      salesCount,
      expenseCount,
      monthlyIncome,
      monthlyExpenses,
      overduePayments,
      overdueCount,
      totalTransactions: transactions.length,
      incomeChangePercent,
      expenseChangePercent,
      profitChangePercent
    };
  };

  const stats = getStats();

  const statCards = [
    {
      title: 'Total Income',
      value: `$${stats.totalIncome.toFixed(2)}`,
      icon: '💰',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      change: `${stats.incomeChangePercent}%`,
      changeType: parseFloat(stats.incomeChangePercent) >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Total Expenses',
      value: `$${stats.totalExpenses.toFixed(2)}`,
      icon: '💸',
      color: 'bg-red-500',
      textColor: 'text-red-600',
      change: `${stats.expenseChangePercent}%`,
      changeType: parseFloat(stats.expenseChangePercent) >= 0 ? 'negative' : 'positive'
    },
    {
      title: 'Net Profit',
      value: `$${stats.netProfit.toFixed(2)}`,
      icon: '📈',
      color: stats.netProfit >= 0 ? 'bg-blue-500' : 'bg-red-500',
      textColor: stats.netProfit >= 0 ? 'text-blue-600' : 'text-red-600',
      change: `${stats.profitChangePercent}%`,
      changeType: parseFloat(stats.profitChangePercent) >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Sales Count',
      value: stats.salesCount,
      icon: '🛍️',
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      change: `${stats.salesCount > 0 ? '+' : ''}${stats.salesCount}`,
      changeType: 'positive'
    },
    {
      title: 'Overdue Payments',
      value: `$${stats.overduePayments.toFixed(2)}`,
      icon: '⚠️',
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      change: `${stats.overdueCount} overdue`,
      changeType: stats.overdueCount > 0 ? 'negative' : 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center text-white text-xl`}>
              {stat.icon}
            </div>
            <div className={`text-xs font-medium ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LedgerStats; 
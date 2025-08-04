import React from 'react';

const ShippingStats = ({ orders }) => {
  const getStats = () => {
    const total = orders.length;
    const pending = orders.filter(order => order.status === 'pending').length;
    const processing = orders.filter(order => order.status === 'processing').length;
    const shipped = orders.filter(order => order.status === 'shipped').length;
    const delivered = orders.filter(order => order.status === 'delivered').length;
    const cancelled = orders.filter(order => order.status === 'cancelled').length;

    return {
      total,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      completionRate: total > 0 ? Math.round((delivered / total) * 100) : 0
    };
  };

  const stats = getStats();

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.total,
      icon: '📦',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: '⏳',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Processing',
      value: stats.processing,
      icon: '⚙️',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Shipped',
      value: stats.shipped,
      icon: '🚚',
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Delivered',
      value: stats.delivered,
      icon: '✅',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Cancelled',
      value: stats.cancelled,
      icon: '❌',
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center text-white text-xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShippingStats; 
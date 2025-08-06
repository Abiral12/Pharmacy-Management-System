"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar
} from 'lucide-react';
import { BillingStats as BillingStatsType } from '@/types/billing';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/formatters';

interface BillingStatsProps {
  stats: BillingStatsType;
}

const BillingStats: React.FC<BillingStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'green',
      trend: stats.revenueGrowth ? {
        value: stats.revenueGrowth,
        isPositive: stats.revenueGrowth > 0
      } : null
    },
    {
      title: 'Pending Amount',
      value: formatCurrency(stats.pendingAmount),
      icon: AlertCircle,
      color: 'yellow',
      subtitle: `${stats.pendingInvoices} pending invoices`
    },
    {
      title: 'Total Invoices',
      value: formatNumber(stats.totalInvoices),
      icon: FileText,
      color: 'blue',
      subtitle: `${stats.paidInvoices} paid, ${stats.overdueInvoices} overdue`
    },
    {
      title: 'Average Invoice',
      value: formatCurrency(stats.averageInvoiceValue),
      icon: TrendingUp,
      color: 'purple',
      subtitle: 'Per invoice value'
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      icon: Calendar,
      color: 'teal',
      subtitle: 'Current month'
    },
    {
      title: 'Collection Rate',
      value: stats.collectionRate ? formatPercentage(stats.collectionRate) : 'N/A',
      icon: CheckCircle,
      color: 'green',
      subtitle: 'Payment success rate'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: 'bg-green-50 border-green-200 text-green-600',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      purple: 'bg-purple-50 border-purple-200 text-purple-600',
      teal: 'bg-teal-50 border-teal-200 text-teal-600',
      red: 'bg-red-50 border-red-200 text-red-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-lg border ${getColorClasses(stat.color)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <stat.icon className="w-8 h-8" />
                <div>
                  <h3 className="font-medium text-gray-800">{stat.title}</h3>
                  {stat.subtitle && (
                    <p className="text-sm text-gray-600">{stat.subtitle}</p>
                  )}
                </div>
              </div>
              {stat.trend && (
                <div className={`flex items-center space-x-1 ${
                  stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend.isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {formatPercentage(Math.abs(stat.trend.value))}
                  </span>
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Customers */}
      {stats.topCustomers && stats.topCustomers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-6 h-6 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-800">Top Customers</h3>
          </div>
          <div className="space-y-3">
            {stats.topCustomers.map((customer, index) => (
              <div key={customer.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-800">{customer.name}</span>
                </div>
                <span className="font-semibold text-teal-600">
                  {formatCurrency(customer.total)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-200"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-colors">
            <FileText className="w-5 h-5 text-teal-600" />
            <span className="font-medium text-gray-700">Create Invoice</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-colors">
            <DollarSign className="w-5 h-5 text-teal-600" />
            <span className="font-medium text-gray-700">Process Payment</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-colors">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <span className="font-medium text-gray-700">View Reports</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BillingStats;
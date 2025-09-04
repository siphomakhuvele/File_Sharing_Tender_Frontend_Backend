import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileText, Gavel, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export const AdminDashboard: React.FC = () => {
  const { dashboardStats, tenders, bids } = useApp();

  const statsCards = [
    {
      title: 'Total Users',
      value: dashboardStats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
    },
    {
      title: 'Active Tenders',
      value: dashboardStats.activeTenders,
      icon: FileText,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: '+8%',
    },
    {
      title: 'Total Bids',
      value: dashboardStats.totalBids,
      icon: Gavel,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+15%',
    },
    {
      title: 'Pending Reviews',
      value: dashboardStats.pendingBids,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '-5%',
    },
  ];

  const tenderStatusData = [
    { name: 'Published', value: tenders.filter(t => t.status === 'published').length },
    { name: 'Closed', value: tenders.filter(t => t.status === 'closed').length },
    { name: 'Draft', value: tenders.filter(t => t.status === 'draft').length },
    { name: 'Awarded', value: tenders.filter(t => t.status === 'awarded').length },
  ];

  const monthlyData = [
    { month: 'Jan', tenders: 12, bids: 45 },
    { month: 'Feb', tenders: 18, bids: 62 },
    { month: 'Mar', tenders: 15, bids: 58 },
    { month: 'Apr', tenders: 22, bids: 78 },
    { month: 'May', tenders: 19, bids: 65 },
    { month: 'Jun', tenders: 25, bids: 89 },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor and manage your tender platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change} from last month
                </p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tenders" fill="#3B82F6" name="Tenders" />
              <Bar dataKey="bids" fill="#10B981" name="Bids" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tender Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tender Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tenderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {tenderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {dashboardStats.recentActivity.length > 0 ? (
              dashboardStats.recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.details}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent activity to display</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
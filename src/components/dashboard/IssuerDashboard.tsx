import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Gavel, 
  Plus, 
  Clock, 
  CheckCircle, 
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';

export const IssuerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { tenders, bids } = useApp();
  
  const myTenders = tenders.filter(tender => tender.issuerId === user?.id);
  const myBids = bids.filter(bid => myTenders.some(tender => tender.id === bid.tenderId));
  const recentBids = myBids.slice(0, 5);

  const stats = [
    {
      title: 'My Tenders',
      value: myTenders.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Received Bids',
      value: myBids.length,
      icon: Gavel,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Pending Review',
      value: myBids.filter(bid => bid.status === 'submitted').length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Active Tenders',
      value: myTenders.filter(tender => tender.status === 'published').length,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'under_review':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'rejected':
        return <CheckCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Issuer Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your tenders and review bids</p>
        </div>
        <Link
          to="/issuer/create"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Tender
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12% this month
                </p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bids */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bids</h3>
            <Link 
              to="/issuer/bids"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            {recentBids.length > 0 ? (
              <div className="space-y-4">
                {recentBids.map((bid) => {
                  const tender = myTenders.find(t => t.id === bid.tenderId);
                  return (
                    <div key={bid.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{bid.bidderName}</p>
                        <p className="text-sm text-gray-600">{tender?.title}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm font-medium text-emerald-600">
                            ${bid.amount.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(bid.submittedAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(bid.status)}
                        <span className="text-sm font-medium capitalize">{bid.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Gavel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No bids received yet</p>
                <p className="text-sm text-gray-500 mt-1">Create a tender to start receiving bids</p>
              </div>
            )}
          </div>
        </div>

        {/* My Tenders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">My Tenders</h3>
            <Link 
              to="/issuer/tenders"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            {myTenders.length > 0 ? (
              <div className="space-y-4">
                {myTenders.slice(0, 5).map((tender) => {
                  const daysLeft = Math.ceil((new Date(tender.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={tender.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{tender.title}</p>
                        <p className="text-sm text-gray-600">{tender.category}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm font-medium text-emerald-600">
                            ${tender.budget.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {tender.bidCount} bids
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          tender.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                          tender.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                          tender.status === 'draft' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                        </span>
                        <p className={`text-xs mt-1 ${daysLeft <= 3 && daysLeft > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No tenders created yet</p>
                <Link 
                  to="/issuer/create"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Tender
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
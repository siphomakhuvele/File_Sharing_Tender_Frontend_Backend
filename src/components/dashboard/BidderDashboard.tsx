import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Gavel, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';

export const BidderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { tenders, bids } = useApp();
  
  const myBids = bids.filter(bid => bid.bidderId === user?.id);
  const activeTenders = tenders.filter(tender => tender.status === 'published');
  const upcomingDeadlines = activeTenders
    .filter(tender => new Date(tender.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const bidStats = [
    {
      title: 'Submitted Bids',
      value: myBids.length,
      icon: Gavel,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Under Review',
      value: myBids.filter(bid => bid.status === 'under_review').length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Accepted',
      value: myBids.filter(bid => bid.status === 'accepted').length,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Active Tenders',
      value: activeTenders.length,
      icon: Search,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'under_review':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bidder Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your bids and discover new opportunities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bidStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
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
              to="/bidder/bids"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            {myBids.length > 0 ? (
              <div className="space-y-4">
                {myBids.slice(0, 5).map((bid) => {
                  const tender = tenders.find(t => t.id === bid.tenderId);
                  return (
                    <div key={bid.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{tender?.title || 'Unknown Tender'}</p>
                        <p className="text-sm text-gray-600">Bid: ${bid.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(bid.submittedAt), 'MMM dd, yyyy')}
                        </p>
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
                <p className="text-gray-600">No bids submitted yet</p>
                <Link 
                  to="/bidder/tenders"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                >
                  Browse Available Tenders
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
            <Link 
              to="/bidder/tenders"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-4">
                {upcomingDeadlines.map((tender) => {
                  const daysLeft = Math.ceil((new Date(tender.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  const hasBid = myBids.some(bid => bid.tenderId === tender.id);
                  
                  return (
                    <div key={tender.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{tender.title}</p>
                        <p className="text-sm text-gray-600">Budget: ${tender.budget.toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {format(new Date(tender.deadline), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${daysLeft <= 3 ? 'text-red-600' : 'text-gray-600'}`}>
                          {daysLeft} days left
                        </p>
                        {hasBid ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 mt-1">
                            <CheckCircle className="w-3 h-3" />
                            Bid Submitted
                          </span>
                        ) : (
                          <Link
                            to={`/bidder/tenders/${tender.id}`}
                            className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block"
                          >
                            Submit Bid
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming deadlines</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/bidder/tenders"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
          >
            <Search className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-medium text-blue-900">Browse Tenders</p>
              <p className="text-xs text-blue-700">Find new opportunities</p>
            </div>
          </Link>
          
          <Link
            to="/bidder/bids"
            className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors group"
          >
            <Gavel className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-medium text-emerald-900">My Bids</p>
              <p className="text-xs text-emerald-700">Track bid status</p>
            </div>
          </Link>
          
          <Link
            to="/bidder/downloads"
            className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
          >
            <DollarSign className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-medium text-purple-900">Downloads</p>
              <p className="text-xs text-purple-700">Access documents</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
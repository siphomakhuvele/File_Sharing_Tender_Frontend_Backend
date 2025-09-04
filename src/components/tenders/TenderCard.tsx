import React from 'react';
import { Tender } from '../../types';
import { Calendar, DollarSign, Users, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface TenderCardProps {
  tender: Tender;
  showActions?: boolean;
  actionButton?: React.ReactNode;
}

export const TenderCard: React.FC<TenderCardProps> = ({ tender, showActions = true, actionButton }) => {
  const daysLeft = Math.ceil((new Date(tender.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{tender.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{tender.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            tender.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
            tender.status === 'closed' ? 'bg-gray-100 text-gray-700' :
            tender.status === 'draft' ? 'bg-orange-100 text-orange-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
          </span>
          {!isExpired && (
            <span className={`text-xs font-medium ${daysLeft <= 3 ? 'text-red-600' : 'text-gray-600'}`}>
              {daysLeft} days left
            </span>
          )}
          {isExpired && (
            <span className="text-xs font-medium text-red-600">Expired</span>
          )}
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {tender.category}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            ${tender.budget.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {tender.bidCount} bids
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {format(new Date(tender.deadline), 'MMM dd, yyyy')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {tender.issuerName}
          </span>
        </div>
      </div>

      {/* Requirements */}
      {tender.requirements.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900 mb-2">Key Requirements:</p>
          <div className="flex flex-wrap gap-2">
            {tender.requirements.slice(0, 3).map((req, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                {req}
              </span>
            ))}
            {tender.requirements.length > 3 && (
              <span className="text-xs text-gray-500">+{tender.requirements.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            to={`/tender/${tender.id}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            View Details
          </Link>
          {actionButton}
        </div>
      )}
    </div>
  );
};
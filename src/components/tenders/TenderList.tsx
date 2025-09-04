import React, { useState } from 'react';
import { Tender } from '../../types';
import { TenderCard } from './TenderCard';
import { Search, Filter, SortDesc } from 'lucide-react';

interface TenderListProps {
  tenders: Tender[];
  title: string;
  showFilters?: boolean;
  actionButton?: (tender: Tender) => React.ReactNode;
}

export const TenderList: React.FC<TenderListProps> = ({ 
  tenders, 
  title, 
  showFilters = true,
  actionButton 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('deadline');

  const categories = Array.from(new Set(tenders.map(t => t.category)));

  const filteredTenders = tenders
    .filter(tender => {
      const matchesSearch = tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tender.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || tender.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'budget':
          return b.budget - a.budget;
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">
          {filteredTenders.length} of {tenders.length} tenders
        </p>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <SortDesc className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="deadline">Sort by Deadline</option>
                <option value="budget">Sort by Budget</option>
                <option value="created">Sort by Created Date</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tender Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTenders.map(tender => (
          <TenderCard
            key={tender.id}
            tender={tender}
            actionButton={actionButton ? actionButton(tender) : undefined}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTenders.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tenders found</h3>
          <p className="text-gray-600">
            {searchQuery || selectedCategory 
              ? 'Try adjusting your search filters' 
              : 'No tenders available at the moment'
            }
          </p>
        </div>
      )}
    </div>
  );
};
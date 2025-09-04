import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Tender } from '../../types';
import { X, Upload, DollarSign, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface BidModalProps {
  tender: Tender;
  isOpen: boolean;
  onClose: () => void;
}

export const BidModal: React.FC<BidModalProps> = ({ tender, isOpen, onClose }) => {
  const { user } = useAuth();
  const { submitBid } = useApp();
  const [formData, setFormData] = useState({
    amount: '',
    proposal: '',
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const bid = {
      tenderId: tender.id,
      bidderId: user.id,
      bidderName: user.name,
      amount: parseFloat(formData.amount),
      proposal: formData.proposal,
      status: 'submitted' as const,
      attachments: files.map((file, index) => ({
        id: `${Date.now()}_${index}`,
        filename: file.name,
        filesize: file.size,
        mimetype: file.type,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user.name,
        url: '#', // Mock URL
      })),
    };

    submitBid(bid);
    toast.success('Bid submitted successfully!');
    onClose();
    setFormData({ amount: '', proposal: '' });
    setFiles([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Submit Bid</h2>
            <p className="text-gray-600 mt-1">{tender.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Tender Info */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Budget: ${tender.budget.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Deadline: {format(new Date(tender.deadline), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
          
          {tender.requirements.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Requirements:</p>
              <div className="flex flex-wrap gap-2">
                {tender.requirements.map((req, index) => (
                  <span key={index} className="text-xs bg-white text-gray-700 px-2 py-1 rounded-md border">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Bid Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Bid Amount (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your bid amount"
                min="1"
                step="0.01"
                required
              />
            </div>
            {parseFloat(formData.amount) > tender.budget && (
              <div className="mt-2 flex items-center gap-2 text-orange-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Your bid exceeds the stated budget</span>
              </div>
            )}
          </div>

          {/* Proposal */}
          <div>
            <label htmlFor="proposal" className="block text-sm font-medium text-gray-700 mb-2">
              Proposal Description
            </label>
            <textarea
              id="proposal"
              value={formData.proposal}
              onChange={(e) => setFormData(prev => ({ ...prev, proposal: e.target.value }))}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Describe your approach, timeline, and why you're the best choice for this project..."
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload proposals, portfolios, or certificates</p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Choose Files
              </label>
            </div>
            
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <FileText className="w-4 h-4" />
                    <span>{file.name}</span>
                    <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Submit Bid
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
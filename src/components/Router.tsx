import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthPage } from './auth/AuthPage';
import { Layout } from './layout/Layout';
import { AdminDashboard } from './dashboard/AdminDashboard';
import { BidderDashboard } from './dashboard/BidderDashboard';
import { IssuerDashboard } from './dashboard/IssuerDashboard';
import { TenderList } from './tenders/TenderList';
import { CreateTenderForm } from './tenders/CreateTenderForm';
import { useApp } from '../context/AppContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/auth" replace />;
  
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'bidder':
      return <BidderDashboard />;
    case 'issuer':
      return <IssuerDashboard />;
    default:
      return <Navigate to="/auth" replace />;
  }
};

const TenderListPage: React.FC = () => {
  const { tenders } = useApp();
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/auth" replace />;
  
  let filteredTenders = tenders;
  let title = 'All Tenders';
  
  if (user.role === 'bidder') {
    filteredTenders = tenders.filter(t => t.status === 'published');
    title = 'Available Tenders';
  } else if (user.role === 'issuer') {
    filteredTenders = tenders.filter(t => t.issuerId === user.id);
    title = 'My Tenders';
  }
  
  return (
    <TenderList 
      tenders={filteredTenders} 
      title={title}
      actionButton={user.role === 'bidder' ? (tender: any) => (
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
          Submit Bid
        </button>
      ) : undefined}
    />
  );
};

export const Router: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/auth" 
          element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />} 
        />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Navigate to="/dashboard" replace />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardRouter />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-gray-600 mt-2">Manage users, tenders, and system settings</p>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Bidder Routes */}
        <Route
          path="/bidder/tenders"
          element={
            <ProtectedRoute allowedRoles={['bidder']}>
              <Layout>
                <TenderListPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/bidder/*"
          element={
            <ProtectedRoute allowedRoles={['bidder']}>
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900">Bidder Panel</h1>
                  <p className="text-gray-600 mt-2">Manage your bids and applications</p>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Issuer Routes */}
        <Route
          path="/issuer/tenders"
          element={
            <ProtectedRoute allowedRoles={['issuer']}>
              <Layout>
                <TenderListPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/issuer/create"
          element={
            <ProtectedRoute allowedRoles={['issuer']}>
              <Layout>
                <CreateTenderForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/issuer/*"
          element={
            <ProtectedRoute allowedRoles={['issuer']}>
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900">Issuer Panel</h1>
                  <p className="text-gray-600 mt-2">Manage your tenders and review bids</p>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="text-gray-600 mt-2">Manage your account preferences</p>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};
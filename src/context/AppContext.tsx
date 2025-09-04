import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Tender, Bid, Notification, AuditLog, DashboardStats } from '../types';

interface AppState {
  tenders: Tender[];
  bids: Bid[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  dashboardStats: DashboardStats;
  loading: boolean;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TENDERS'; payload: Tender[] }
  | { type: 'ADD_TENDER'; payload: Tender }
  | { type: 'UPDATE_TENDER'; payload: Tender }
  | { type: 'DELETE_TENDER'; payload: string }
  | { type: 'SET_BIDS'; payload: Bid[] }
  | { type: 'ADD_BID'; payload: Bid }
  | { type: 'UPDATE_BID'; payload: Bid }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'ADD_AUDIT_LOG'; payload: AuditLog }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats };

const initialState: AppState = {
  tenders: [],
  bids: [],
  notifications: [],
  auditLogs: [],
  dashboardStats: {
    totalTenders: 0,
    activeTenders: 0,
    totalBids: 0,
    pendingBids: 0,
    totalUsers: 0,
    activeUsers: 0,
    recentActivity: [],
  },
  loading: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TENDERS':
      return { ...state, tenders: action.payload };
    case 'ADD_TENDER':
      return { ...state, tenders: [...state.tenders, action.payload] };
    case 'UPDATE_TENDER':
      return {
        ...state,
        tenders: state.tenders.map(t => t.id === action.payload.id ? action.payload : t),
      };
    case 'DELETE_TENDER':
      return {
        ...state,
        tenders: state.tenders.filter(t => t.id !== action.payload),
      };
    case 'SET_BIDS':
      return { ...state, bids: action.payload };
    case 'ADD_BID':
      return { ...state, bids: [...state.bids, action.payload] };
    case 'UPDATE_BID':
      return {
        ...state,
        bids: state.bids.map(b => b.id === action.payload.id ? action.payload : b),
      };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'ADD_AUDIT_LOG':
      return { ...state, auditLogs: [action.payload, ...state.auditLogs] };
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    default:
      return state;
  }
};

interface AppContextType extends AppState {
  createTender: (tender: Omit<Tender, 'id' | 'createdAt' | 'updatedAt' | 'bidCount'>) => void;
  updateTender: (tender: Tender) => void;
  deleteTender: (id: string) => void;
  submitBid: (bid: Omit<Bid, 'id' | 'submittedAt' | 'updatedAt'>) => void;
  updateBid: (bid: Bid) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Mock data initialization
  useEffect(() => {
    const initializeData = () => {
      const mockTenders: Tender[] = [
        {
          id: '1',
          title: 'Website Development Project',
          description: 'Looking for a professional web development team to build a corporate website with modern design and functionality.',
          category: 'Technology',
          issuerId: '3',
          issuerName: 'Sarah Issuer',
          deadline: '2024-02-15T23:59:59Z',
          budget: 25000,
          status: 'published',
          requirements: ['React/Vue.js experience', 'Responsive design', 'SEO optimization'],
          attachments: [
            {
              id: '1',
              filename: 'requirements.pdf',
              filesize: 245760,
              mimetype: 'application/pdf',
              uploadedAt: '2024-01-10T10:00:00Z',
              uploadedBy: 'Sarah Issuer',
              url: '#',
            },
          ],
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-10T10:00:00Z',
          bidCount: 3,
        },
        {
          id: '2',
          title: 'Mobile App Development',
          description: 'Native iOS and Android app development for a fintech startup. Looking for experienced mobile developers.',
          category: 'Mobile Development',
          issuerId: '3',
          issuerName: 'Sarah Issuer',
          deadline: '2024-03-01T23:59:59Z',
          budget: 45000,
          status: 'published',
          requirements: ['React Native or Flutter', 'Banking app experience', 'Security expertise'],
          attachments: [],
          createdAt: '2024-01-12T14:30:00Z',
          updatedAt: '2024-01-12T14:30:00Z',
          bidCount: 1,
        },
      ];

      const mockBids: Bid[] = [
        {
          id: '1',
          tenderId: '1',
          bidderId: '2',
          bidderName: 'John Bidder',
          amount: 22000,
          proposal: 'We can deliver a high-quality website using React and modern design principles. Our team has 5+ years experience.',
          status: 'submitted',
          attachments: [
            {
              id: '2',
              filename: 'portfolio.pdf',
              filesize: 512000,
              mimetype: 'application/pdf',
              uploadedAt: '2024-01-11T15:00:00Z',
              uploadedBy: 'John Bidder',
              url: '#',
            },
          ],
          submittedAt: '2024-01-11T15:00:00Z',
          updatedAt: '2024-01-11T15:00:00Z',
        },
      ];

      dispatch({ type: 'SET_TENDERS', payload: mockTenders });
      dispatch({ type: 'SET_BIDS', payload: mockBids });

      const stats: DashboardStats = {
        totalTenders: mockTenders.length,
        activeTenders: mockTenders.filter(t => t.status === 'published').length,
        totalBids: mockBids.length,
        pendingBids: mockBids.filter(b => b.status === 'submitted').length,
        totalUsers: 3,
        activeUsers: 3,
        recentActivity: [],
      };
      dispatch({ type: 'SET_DASHBOARD_STATS', payload: stats });
    };

    initializeData();
  }, []);

  const createTender = (tenderData: Omit<Tender, 'id' | 'createdAt' | 'updatedAt' | 'bidCount'>) => {
    const tender: Tender = {
      ...tenderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bidCount: 0,
    };
    
    dispatch({ type: 'ADD_TENDER', payload: tender });
    
    const auditLog: AuditLog = {
      id: Date.now().toString(),
      userId: tender.issuerId,
      userName: tender.issuerName,
      action: 'Created tender',
      entity: 'tender',
      entityId: tender.id,
      details: `Created tender: ${tender.title}`,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_AUDIT_LOG', payload: auditLog });
  };

  const updateTender = (tender: Tender) => {
    const updatedTender = { ...tender, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_TENDER', payload: updatedTender });
    
    const auditLog: AuditLog = {
      id: Date.now().toString(),
      userId: tender.issuerId,
      userName: tender.issuerName,
      action: 'Updated tender',
      entity: 'tender',
      entityId: tender.id,
      details: `Updated tender: ${tender.title}`,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_AUDIT_LOG', payload: auditLog });
  };

  const deleteTender = (id: string) => {
    dispatch({ type: 'DELETE_TENDER', payload: id });
  };

  const submitBid = (bidData: Omit<Bid, 'id' | 'submittedAt' | 'updatedAt'>) => {
    const bid: Bid = {
      ...bidData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_BID', payload: bid });
    
    const auditLog: AuditLog = {
      id: Date.now().toString(),
      userId: bid.bidderId,
      userName: bid.bidderName,
      action: 'Submitted bid',
      entity: 'bid',
      entityId: bid.id,
      details: `Submitted bid for tender: ${bid.tenderId}`,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_AUDIT_LOG', payload: auditLog });
  };

  const updateBid = (bid: Bid) => {
    const updatedBid = { ...bid, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_BID', payload: updatedBid });
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const addAuditLog = (logData: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const log: AuditLog = {
      ...logData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_AUDIT_LOG', payload: log });
  };

  const refreshData = () => {
    // Simulate data refresh
    dispatch({ type: 'SET_LOADING', payload: true });
    setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 1000);
  };

  const value: AppContextType = {
    ...state,
    createTender,
    updateTender,
    deleteTender,
    submitBid,
    updateBid,
    addNotification,
    markNotificationRead,
    addAuditLog,
    refreshData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
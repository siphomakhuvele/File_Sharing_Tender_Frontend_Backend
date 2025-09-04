export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'bidder' | 'issuer';
  status: 'active' | 'pending' | 'rejected';
  createdAt: string;
  lastLogin?: string;
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  category: string;
  issuerId: string;
  issuerName: string;
  deadline: string;
  budget: number;
  status: 'draft' | 'published' | 'closed' | 'awarded';
  requirements: string[];
  attachments: FileAttachment[];
  createdAt: string;
  updatedAt: string;
  bidCount: number;
}

export interface Bid {
  id: string;
  tenderId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  proposal: string;
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected';
  attachments: FileAttachment[];
  submittedAt: string;
  updatedAt: string;
}

export interface FileAttachment {
  id: string;
  filename: string;
  filesize: number;
  mimetype: string;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: 'tender' | 'bid' | 'user';
  entityId: string;
  details: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  data?: any;
}

export interface DashboardStats {
  totalTenders: number;
  activeTenders: number;
  totalBids: number;
  pendingBids: number;
  totalUsers: number;
  activeUsers: number;
  recentActivity: AuditLog[];
}
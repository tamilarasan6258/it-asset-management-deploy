// src/app/models/request.model.ts

export interface RequestData {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    department: string;
  };
  asset_category: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  department: string;
  remarks?: string;
  adminStatus?: 'pending' | 'approved' | 'rejected';
  adminRemarks?: string;
  forwardedToAdmin?: boolean;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  assignment?: {
    asset_id: {
      asset_id: string;
      asset_name: string;
    };
    assignedBy: {
      name: string;
    };
  } | null;
}

export interface RequestResponse {
  message: string;
  request: RequestData;
}

export interface PagedRequestResponse {
  requests: RequestData[];
  total: number;
  page: number;
  totalPages: number;
}

export interface MessageResponse {
  message: string;
}

export interface RequestSummary {
  asset_category: string;
  available_count: number;
  pending_assignment_count: number;
  admin_only_approved_count: number;
}

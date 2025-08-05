// src/app/models/assignment.model.ts

export interface AssetInfo {
  _id: string;
  asset_name: string;
  asset_id: string;
  asset_category: string;
}

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  department?: string;
  role?: string;
}

export interface Assignment {
  _id: string;
  request: string;
  asset_name: string;
  asset_id: AssetInfo | string;
  asset_category: string;
  assignedBy: UserInfo | string;
  assignedTo: UserInfo | string;
  assignedAt?: string;
  returnedAt?: string;
  returnRequested?: boolean;
  returnApprovedByDeptHead?: boolean;
  returnDeptHeadMessage?: string;
  returnFinalizedByAdmin?: boolean;
  returnCondition?: 'good' | 'damaged' | 'new';
}

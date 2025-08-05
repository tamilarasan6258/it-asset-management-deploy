// asset.model.ts

export interface Asset {
  _id?: string; // optional for creation
  asset_name: string;
  asset_id: string;
  asset_category: string;
  condition: 'new' | 'good' | 'damaged';
  description?: string;
  isAssigned: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface AssetCount {
  _id?: string;
  asset_category: string;
  total_count: number;
  available_count: number;
}

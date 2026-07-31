export interface Receipt {
  id: string;
  vendor: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  source?: {
    filename?: string;
    uploadedAt?: string;
  };
}

export type CreateReceiptPayload = {
  vendor: string;
  amount: number;
  date: string;
  category: string;
  notes?: string;
};

export type Receipt = {
  id: string;
  vendor: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

const apiToken = import.meta.env.VITE_API_TOKEN;

function authHeaders(): HeadersInit | undefined {
  return apiToken ? { Authorization: `Bearer ${apiToken}` } : undefined;
}

export async function fetchReceipts(apiBase: string): Promise<Receipt[]> {
  const response = await fetch(`${apiBase}/receipts`, {
    headers: authHeaders()
  });
  if (!response.ok) {
    throw new Error('Unable to load receipts');
  }
  return response.json();
}

export async function postReceipt(apiBase: string, payload: CreateReceiptPayload): Promise<Receipt> {
  const response = await fetch(`${apiBase}/receipts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeaders() ?? {})
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Unable to create receipt');
  }

  return response.json();
}

export async function updateReceipt(apiBase: string, id: string, payload: Partial<CreateReceiptPayload>): Promise<Receipt> {
  const response = await fetch(`${apiBase}/receipts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeaders() ?? {})
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Unable to update receipt');
  }

  return response.json();
}

export async function deleteReceipt(apiBase: string, id: string): Promise<void> {
  const response = await fetch(`${apiBase}/receipts/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });

  if (!response.ok) {
    throw new Error('Unable to delete receipt');
  }
}

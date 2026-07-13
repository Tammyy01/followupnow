/**
 * Server-side API client for calling the Follow-Up Now backend.
 * Used by Next.js server components / API routes.
 */

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://followupnow-api.duckdns.org/api/v1';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';

async function adminFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BACKEND_API_URL}/admin${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': ADMIN_API_KEY,
      ...(options?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'API request failed' }));
    throw new Error(error.message || `API error: ${res.status}`);
  }

  const json = await res.json();
  return json.data as T;
}

// --- Dashboard Stats ---
export interface DashboardStats {
  totalUsers: number;
  lifetimeCount: number;
  trialActiveCount: number;
  trialExpiredCount: number;
  noPlanCount: number;
  signupsLast7d: number;
  signupsLast30d: number;
  stripeCount: number;
  appleCount: number;
  manualCount: number;
  signupsByDay: { label: string; count: number }[];
  recentUsers: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    plan: string;
    status: string;
    createdAt: string;
  }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return adminFetch<DashboardStats>('/dashboard');
}

// --- Users List ---
export interface UserRow {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  plan: string;
  status: string;
  paymentSource: string;
  trialEndDate: string | null;
  paymentDate: string | null;
  lastLogin: string | null;
  createdAt: string;
}

export interface UsersListResponse {
  users: UserRow[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export async function getUsers(params: Record<string, string>): Promise<UsersListResponse> {
  const qs = new URLSearchParams(params).toString();
  return adminFetch<UsersListResponse>(`/users${qs ? `?${qs}` : ''}`);
}

// --- User Detail ---
export interface UserDetail {
  _id: string;
  phoneNumber: string;
  email: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
    company: string;
    title: string;
    linkedIn: string;
    website: string;
    dateOfBirth: string;
    hobbies: string[];
    openToReferrals: boolean;
    referralNotes: string;
    idealClients: string[];
  };
  subscription: {
    plan: string;
    status: string;
    trialStartDate: string | null;
    trialEndDate: string | null;
    paymentDate: string | null;
    paymentAmount: number;
    paymentTransactionId: string;
    paymentEmail: string;
    paymentSource: string;
    appleTransactionId: string;
    appleOriginalTransactionId: string;
  };
  additionalPhones: { value: string; label: string; isPrimary: boolean }[];
  additionalEmails: { value: string; label: string; isPrimary: boolean }[];
  expoPushTokens: string[];
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getUserDetail(id: string): Promise<UserDetail> {
  return adminFetch<UserDetail>(`/users/${id}`);
}

'use server';

import { getUsers, UserRow } from '@/lib/api';

export async function fetchUsersForExport(params: {
  search?: string;
  plan?: string;
  status?: string;
  source?: string;
  startDate?: string;
  endDate?: string;
}): Promise<UserRow[]> {
  const queryParams: Record<string, string> = {
    limit: '100000', // Massive limit to get all users
  };

  if (params.search) queryParams.search = params.search;
  if (params.plan && params.plan !== 'all') queryParams.plan = params.plan;
  if (params.status && params.status !== 'all') queryParams.status = params.status;
  if (params.source && params.source !== 'all') queryParams.source = params.source;
  if (params.startDate) queryParams.startDate = params.startDate;
  if (params.endDate) queryParams.endDate = params.endDate;

  try {
    const data = await getUsers(queryParams);
    return data.users;
  } catch (error) {
    console.error('Failed to fetch users for export:', error);
    throw new Error('Failed to fetch users for export');
  }
}

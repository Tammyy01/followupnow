import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUsers } from '@/lib/api';
import UsersClient from './UsersClient';

export const dynamic = 'force-dynamic';

interface SearchParams {
  search?: string;
  plan?: string;
  status?: string;
  source?: string;
  page?: string;
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    redirect('/login');
  }

  const params = await searchParams;

  // Build query params for the backend
  const queryParams: Record<string, string> = {};
  if (params.search) queryParams.search = params.search;
  if (params.plan && params.plan !== 'all') queryParams.plan = params.plan;
  if (params.status && params.status !== 'all') queryParams.status = params.status;
  if (params.source && params.source !== 'all') queryParams.source = params.source;
  if (params.page) queryParams.page = params.page;

  try {
    const apiData = await getUsers(queryParams);

    return (
      <UsersClient
        data={{
          ...apiData,
          search: params.search || '',
          plan: params.plan || 'all',
          status: params.status || 'all',
          source: params.source || 'all',
        }}
      />
    );
  } catch (error) {
    return (
      <div style={{ padding: 24, color: 'red' }}>
        Error loading users. Please check if the backend is running.
      </div>
    );
  }
}

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { getDashboardStats } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const data = await getDashboardStats();
    return <DashboardClient data={data} />;
  } catch (err) {
    return <div style={{ padding: 24, color: 'red' }}>Error loading dashboard. Please check if the backend is running.</div>;
  }
}

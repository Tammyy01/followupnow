import { getUserDetail } from '@/lib/api';
import UserDetailClient from './UserDetailClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const user = await getUserDetail(id);
    return <UserDetailClient user={user} />;
  } catch {
    notFound();
  }
}

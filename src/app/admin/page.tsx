import { getAdminSupabase } from '@/lib/supabase';
import { AdminDashboard } from '@/components/AdminDashboard';
import { verifyAdminSession } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const supabase = getAdminSupabase();
  const { data: creators, error } = await supabase
    .from('creators')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="text-white p-8">Error loading data: {error.message}</div>;
  }

  return <AdminDashboard initialCreators={creators || []} />;
}

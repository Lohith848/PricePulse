import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  redirect('/login');
}

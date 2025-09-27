import { prisma } from '@/lib/prisma';
import ClientSettings from './ClientSettings'; // Fixed import path
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  // TODO: replace with real auth user id
  const userId = 1;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return <div style={{ padding: 24 }}>User not found</div>;

  const initial = {
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    email: user.email || '',
    age: user.age || 0,
    gender: (user.gender as 'Male' | 'Female' | 'Other' | 'Prefer not to say') || 'Prefer not to say',
    notifications: true,
    darkMode: false,
    defaultLocation: 'Midtown' as const,
  };

  return <ClientSettings userId={userId} initial={initial} />;
}
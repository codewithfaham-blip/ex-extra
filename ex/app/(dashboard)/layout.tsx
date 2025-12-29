'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { UserRole } from '@/types';

// Fixed: Added missing React import to support React namespace usage for types
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isAdminPath = pathname.startsWith('/admin');

  if (isAdminPath && !isAdmin) {
    router.push('/dashboard');
    return null;
  }

  if (isAdmin && !isAdminPath && pathname !== '/transactions') {
     router.push('/admin');
     return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
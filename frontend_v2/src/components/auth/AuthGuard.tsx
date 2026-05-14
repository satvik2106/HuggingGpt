'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

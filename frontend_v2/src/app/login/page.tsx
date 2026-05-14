'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/chat');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050B14]">
      <Loader2 className="w-8 h-8 animate-spin text-accent-cyan" />
    </div>
  );
}

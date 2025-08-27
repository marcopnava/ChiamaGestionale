'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Spinner } from '@/components/ui/shadcn-io/spinner';

export const PageTransitionSpinner = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Simulate loading on route change
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1200); // Increased to 1.2s

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-card p-8 shadow-lg border">
        <Spinner variant="ring" size={32} className="text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Caricamento...</p>
      </div>
    </div>
  );
}; 
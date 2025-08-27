'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Dock, DockItem, DockIcon, DockLabel } from '@/components/ui/shadcn-io/dock';
import {
  Home, Users, Package, ShoppingCart, BarChart3, MessageSquare,
  FileText, Shield, Calendar, Settings, LogOut, GanttChartSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type DockEntry = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const DOCK_ITEMS: DockEntry[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/customers', label: 'Clienti', icon: Users },
  { href: '/products', label: 'Prodotti', icon: Package },
  { href: '/sales', label: 'Vendite', icon: ShoppingCart },
  { href: '/reports', label: 'Report', icon: BarChart3 },
  { href: '/tickets', label: 'Ticket', icon: MessageSquare },
  { href: '/roadmap', label: 'Roadmap', icon: GanttChartSquare },
  { href: '/audit', label: 'Audit', icon: Shield },
  { href: '/calendar', label: 'Calendario', icon: Calendar },
  { href: '/settings', label: 'Impostazioni', icon: Settings },
];

export default function PlatformDock() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Disconnesso");
        router.replace("/login");
        router.refresh();
      } else {
        toast.error("Errore logout");
      }
    } catch (error) {
      toast.error("Errore logout");
    }
  };

  const handleNavigation = (href: string) => {
    router.push(href as any);
  };

  return (
    <div
      className="
        fixed left-1/2 -translate-x-1/2
        bottom-[max(12px,env(safe-area-inset-bottom))]
        z-50
      "
    >
      <Dock distance={150} magnification={96} panelHeight={56}>
        {DOCK_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname?.startsWith(href));
          return (
            <DockItem key={href}>
              <button
                onClick={() => handleNavigation(href)}
                aria-label={label}
                className={cn(
                  'group flex flex-col items-center gap-1 rounded-md px-1 py-1 transition',
                  active && 'ring-2 ring-[hsl(var(--ring))] ring-offset-2 ring-offset-background'
                )}
              >
                <DockIcon>
                  <Icon className={cn('h-full w-full', active ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--foreground))]/80')} />
                </DockIcon>
                <DockLabel>{label}</DockLabel>
              </button>
            </DockItem>
          );
        })}

        {/* Logout "subtle" */}
        <DockItem>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="group flex flex-col items-center gap-1 rounded-md px-1 py-1"
          >
            <DockIcon>
              <LogOut className="h-full w-full text-[hsl(var(--foreground))]/70 group-hover:text-[hsl(var(--foreground))]" />
            </DockIcon>
            <DockLabel>Log out</DockLabel>
          </button>
        </DockItem>
      </Dock>
    </div>
  );
}
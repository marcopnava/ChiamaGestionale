'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Route } from 'next';
import { Dock, DockItem, DockIcon, DockLabel } from '@/components/ui/shadcn-io/dock';
import {
  Home, Users, Package, ShoppingCart, BarChart3, MessageSquare,
  FileText, Shield, Calendar, Settings, LogOut, GanttChartSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type DockEntry = {
  href: Route;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const DOCK_ITEMS: DockEntry[] = [
  { href: '/' as Route, label: 'Home', icon: Home },
  { href: '/customers' as Route, label: 'Clienti', icon: Users },
  { href: '/products' as Route, label: 'Prodotti', icon: Package },
  { href: '/sales' as Route, label: 'Vendite', icon: ShoppingCart },
  { href: '/reports' as Route, label: 'Report', icon: BarChart3 },
  { href: '/tickets' as Route, label: 'Ticket', icon: MessageSquare },
  { href: '/roadmap' as Route, label: 'Roadmap', icon: GanttChartSquare },
  { href: '/audit' as Route, label: 'Audit', icon: Shield },
  { href: '/calendar' as Route, label: 'Calendario', icon: Calendar },
  { href: '/settings' as Route, label: 'Impostazioni', icon: Settings },
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
      } else {
        toast.error("Errore logout");
      }
    } catch {
      toast.error("Errore logout");
    }
  };

  return (
    <div
      className="
        fixed left-1/2 -translate-x-1/2
        bottom-[max(16px,env(safe-area-inset-bottom))]
        z-50
      "
    >
      <Dock distance={180} magnification={110} panelHeight={64}>
        {DOCK_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname?.startsWith(href));
          return (
            <DockItem key={href}>
              <button
                onClick={() => router.push(href)}
                aria-label={label}
                className={cn(
                  'group flex flex-col items-center gap-1 rounded-md px-2 py-1 transition focus:outline-none',
                  active && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                )}
              >
                <DockIcon>
                  <Icon
                    className={cn(
                      'h-full w-full transition-transform duration-200 ease-out group-hover:scale-125 group-hover:-translate-y-1',
                      active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                </DockIcon>
                <DockLabel>{label}</DockLabel>
              </button>
            </DockItem>
          );
        })}

        {/* Pulsante logout */}
        <DockItem>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="group flex flex-col items-center gap-1 rounded-md px-2 py-1 focus:outline-none"
          >
            <DockIcon>
              <LogOut className="h-full w-full text-muted-foreground transition-transform duration-200 ease-out group-hover:scale-125 group-hover:-translate-y-1 group-hover:text-red-500" />
            </DockIcon>
            <DockLabel>Logout</DockLabel>
          </button>
        </DockItem>
      </Dock>
    </div>
  );
}

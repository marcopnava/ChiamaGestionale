'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CalendarIcon, PlusIcon, XIcon } from 'lucide-react';

// Types
export type Feature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status: {
    id: string;
    name: string;
    color: string;
  };
  owner?: {
    id: string;
    name: string;
    image: string;
  };
  group?: {
    id: string;
    name: string;
  };
  product?: {
    id: string;
    name: string;
  };
  initiative?: {
    id: string;
    name: string;
  };
  release?: {
    id: string;
    name: string;
  };
};

export type Marker = {
  id: string;
  date: Date;
  label: string;
  className?: string;
};

// Context
type GanttContextType = {
  range: 'daily' | 'weekly' | 'monthly';
  zoom: number;
  onAddItem?: (date: Date) => void;
};

const GanttContext = createContext<GanttContextType>({
  range: 'monthly',
  zoom: 100,
});

// Provider
export type GanttProviderProps = {
  children: ReactNode;
  className?: string;
  range?: 'daily' | 'weekly' | 'monthly';
  zoom?: number;
  onAddItem?: (date: Date) => void;
};

export const GanttProvider = ({
  children,
  className,
  range = 'monthly',
  zoom = 100,
  onAddItem,
}: GanttProviderProps) => {
  return (
    <GanttContext.Provider value={{ range, zoom, onAddItem }}>
      <div className={cn('flex h-full', className)}>{children}</div>
    </GanttContext.Provider>
  );
};

// Sidebar
export type GanttSidebarProps = {
  children: ReactNode;
  className?: string;
};

export const GanttSidebar = ({ children, className }: GanttSidebarProps) => {
  return (
    <div className={cn('w-64 border-r bg-muted/50', className)}>
      {children}
    </div>
  );
};

export type GanttSidebarGroupProps = {
  children: ReactNode;
  name: string;
  className?: string;
};

export const GanttSidebarGroup = ({
  children,
  name,
  className,
}: GanttSidebarGroupProps) => {
  return (
    <div className={cn('border-b', className)}>
      <div className="p-3 font-medium text-sm">{name}</div>
      <div className="p-2">{children}</div>
    </div>
  );
};

export type GanttSidebarItemProps = {
  feature: Feature;
  onSelectItem?: (id: string) => void;
  className?: string;
};

export const GanttSidebarItem = ({
  feature,
  onSelectItem,
  className,
}: GanttSidebarItemProps) => {
  return (
    <div
      className={cn(
        'p-2 rounded cursor-pointer hover:bg-accent transition-colors',
        className
      )}
      onClick={() => onSelectItem?.(feature.id)}
    >
      <div className="text-sm font-medium">{feature.name}</div>
      <div className="text-xs text-muted-foreground">
        {feature.owner?.name}
      </div>
    </div>
  );
};

// Timeline
export type GanttTimelineProps = {
  children: ReactNode;
  className?: string;
};

export const GanttTimeline = ({ children, className }: GanttTimelineProps) => {
  return (
    <div className={cn('flex-1 overflow-auto', className)}>
      {children}
    </div>
  );
};

export type GanttHeaderProps = {
  className?: string;
};

export const GanttHeader = ({ className }: GanttHeaderProps) => {
  const { range } = useContext(GanttContext);
  
  const months = [
    'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
    'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'
  ];
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  
  return (
    <div className={cn('border-b bg-muted/50', className)}>
      <div className="flex h-12">
        {months.map((month, index) => (
          <div
            key={month}
            className={cn(
              'flex-1 border-r p-2 text-center text-xs font-medium',
              index === currentMonth && 'bg-primary/10 text-primary'
            )}
          >
            {month}
          </div>
        ))}
      </div>
    </div>
  );
};

export type GanttFeatureListProps = {
  children: ReactNode;
  className?: string;
};

export const GanttFeatureList = ({ children, className }: GanttFeatureListProps) => {
  return (
    <div className={cn('relative', className)}>
      {children}
    </div>
  );
};

export type GanttFeatureListGroupProps = {
  children: ReactNode;
  className?: string;
};

export const GanttFeatureListGroup = ({
  children,
  className,
}: GanttFeatureListGroupProps) => {
  return (
    <div className={cn('border-b', className)}>
      {children}
    </div>
  );
};

export type GanttFeatureItemProps = {
  feature: Feature;
  onMove?: (id: string, startAt: Date, endAt: Date | null) => void;
  children?: ReactNode;
  className?: string;
};

export const GanttFeatureItem = ({
  feature,
  onMove,
  children,
  className,
}: GanttFeatureItemProps) => {
  // Ensure dates are valid and feature exists
  if (!feature || !feature.startAt || !feature.endAt) {
    return null;
  }
  
  const startDate = feature.startAt instanceof Date ? feature.startAt : new Date(feature.startAt);
  const endDate = feature.endAt instanceof Date ? feature.endAt : new Date(feature.endAt);
  
  const startMonth = startDate.getMonth();
  const endMonth = endDate.getMonth();
  const left = (startMonth / 12) * 100;
  const width = ((endMonth - startMonth + 1) / 12) * 100;
  
  return (
    <div
      className={cn(
        'absolute top-0 h-8 rounded bg-primary/20 border border-primary/30 flex items-center px-2',
        className
      )}
      style={{
        left: `${left}%`,
        width: `${width}%`,
      }}
    >
      {children}
    </div>
  );
};

export type GanttMarkerProps = {
  marker: Marker;
  onRemove?: (id: string) => void;
  className?: string;
};

export const GanttMarker = ({ marker, onRemove, className }: GanttMarkerProps) => {
  // Ensure marker and date are valid
  if (!marker || !marker.date) {
    return null;
  }
  
  const date = marker.date instanceof Date ? marker.date : new Date(marker.date);
  const month = date.getMonth();
  const left = (month / 12) * 100;
  
  return (
    <div
      className={cn(
        'absolute top-0 w-0.5 h-full bg-red-500',
        className
      )}
      style={{ left: `${left}%` }}
    >
      <div className="absolute -top-2 -left-1 bg-red-500 text-white text-xs px-1 rounded">
        {marker.label}
      </div>
      {onRemove && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute -top-8 -left-2 h-6 w-6 p-0"
          onClick={() => onRemove(marker.id)}
        >
          <XIcon size={12} />
        </Button>
      )}
    </div>
  );
};

export type GanttTodayProps = {
  className?: string;
};

export const GanttToday = ({ className }: GanttTodayProps) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const left = (currentMonth / 12) * 100;
  
  return (
    <div
      className={cn(
        'absolute top-0 w-0.5 h-full bg-blue-500 z-10',
        className
      )}
      style={{ left: `${left}%` }}
    >
      <div className="absolute -top-2 -left-1 bg-blue-500 text-white text-xs px-1 rounded">
        Oggi
      </div>
    </div>
  );
};

export type GanttCreateMarkerTriggerProps = {
  onCreateMarker?: (date: Date) => void;
  className?: string;
};

export const GanttCreateMarkerTrigger = ({
  onCreateMarker,
  className,
}: GanttCreateMarkerTriggerProps) => {
  return (
    <div className={cn('absolute bottom-4 right-4', className)}>
      <Button
        size="sm"
        onClick={() => onCreateMarker?.(new Date())}
        className="rounded-full w-10 h-10 p-0"
      >
        <PlusIcon size={16} />
      </Button>
    </div>
  );
}; 
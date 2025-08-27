'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Types
export type Column = {
  id: string;
  name: string;
  color?: string;
};

export type KanbanItem = {
  id: string;
  name: string;
  column: string;
  [key: string]: any;
};

export type DragEndEvent = {
  active: { id: string };
  over: { id: string } | null;
};

// Context
type KanbanContextType = {
  columns: Column[];
  data: KanbanItem[];
  onDragEnd?: (event: DragEndEvent) => void;
};

const KanbanContext = createContext<KanbanContextType>({
  columns: [],
  data: [],
});

// Provider
export type KanbanProviderProps = {
  children: ReactNode | ((column: Column) => ReactNode);
  columns: Column[];
  data: KanbanItem[];
  onDragEnd?: (event: DragEndEvent) => void;
  className?: string;
};

export const KanbanProvider = ({
  children,
  columns,
  data,
  onDragEnd,
  className,
}: KanbanProviderProps) => {
  return (
    <KanbanContext.Provider value={{ columns, data, onDragEnd }}>
      <div className={cn('flex gap-4 h-full', className)}>
        {typeof children === 'function'
          ? columns.map((column) => children(column))
          : children}
      </div>
    </KanbanContext.Provider>
  );
};

// Board
export type KanbanBoardProps = {
  children: ReactNode;
  id: string;
  className?: string;
};

export const KanbanBoard = ({ children, id, className }: KanbanBoardProps) => {
  return (
    <div
      className={cn(
        'flex flex-col w-80 bg-muted/50 rounded-lg border',
        className
      )}
      data-column-id={id}
    >
      {children}
    </div>
  );
};

// Header
export type KanbanHeaderProps = {
  children: ReactNode;
  className?: string;
};

export const KanbanHeader = ({ children, className }: KanbanHeaderProps) => {
  return (
    <div className={cn('p-3 border-b font-medium text-sm', className)}>
      {children}
    </div>
  );
};

// Cards Container
export type KanbanCardsProps = {
  children: ReactNode | ((item: KanbanItem) => ReactNode);
  id: string;
  className?: string;
};

export const KanbanCards = ({ children, id, className }: KanbanCardsProps) => {
  const { data } = useContext(KanbanContext);
  const columnItems = data.filter((item) => item.column === id);

  return (
    <div className={cn('flex-1 p-2 space-y-2 overflow-y-auto', className)}>
      {typeof children === 'function'
        ? columnItems.map((item) => children(item))
        : children}
    </div>
  );
};

// Card
export type KanbanCardProps = {
  children: ReactNode;
  id: string;
  name: string;
  column: string;
  className?: string;
};

export const KanbanCard = ({
  children,
  id,
  name,
  column,
  className,
}: KanbanCardProps) => {
  return (
    <div
      className={cn(
        'p-3 bg-background border rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow',
        className
      )}
      data-item-id={id}
      draggable
    >
      <div className="font-medium text-sm mb-2">{name}</div>
      {children}
    </div>
  );
}; 
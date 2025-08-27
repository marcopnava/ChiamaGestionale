'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Types
export type DragEndEvent = {
  active: { id: string };
  over: { id: string } | null;
};

// Context
type ListContextType = {
  onDragEnd?: (event: DragEndEvent) => void;
};

const ListContext = createContext<ListContextType>({});

// Provider
export type ListProviderProps = {
  children: ReactNode;
  onDragEnd?: (event: DragEndEvent) => void;
  className?: string;
};

export const ListProvider = ({
  children,
  onDragEnd,
  className,
}: ListProviderProps) => {
  return (
    <ListContext.Provider value={{ onDragEnd }}>
      <div className={cn('flex gap-4 h-full', className)}>
        {children}
      </div>
    </ListContext.Provider>
  );
};

// Group
export type ListGroupProps = {
  children: ReactNode;
  id: string;
  className?: string;
};

export const ListGroup = ({ children, id, className }: ListGroupProps) => {
  return (
    <div
      className={cn(
        'flex flex-col w-80 bg-muted/50 rounded-lg border',
        className
      )}
      data-group-id={id}
    >
      {children}
    </div>
  );
};

// Header
export type ListHeaderProps = {
  children: ReactNode;
  name: string;
  color?: string;
  className?: string;
};

export const ListHeader = ({
  children,
  name,
  color,
  className,
}: ListHeaderProps) => {
  return (
    <div className={cn('p-3 border-b font-medium text-sm', className)}>
      <div className="flex items-center gap-2">
        {color && (
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
        )}
        {name}
      </div>
      {children}
    </div>
  );
};

// Items Container
export type ListItemsProps = {
  children: ReactNode;
  className?: string;
};

export const ListItems = ({ children, className }: ListItemsProps) => {
  return (
    <div className={cn('flex-1 p-2 space-y-2 overflow-y-auto', className)}>
      {children}
    </div>
  );
};

// Item
export type ListItemProps = {
  children: ReactNode;
  id: string;
  name: string;
  parent: string;
  index: number;
  className?: string;
};

export const ListItem = ({
  children,
  id,
  name,
  parent,
  index,
  className,
}: ListItemProps) => {
  return (
    <div
      className={cn(
        'p-3 bg-background border rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow',
        className
      )}
      data-item-id={id}
      data-parent-id={parent}
      data-index={index}
      draggable
    >
      <div className="font-medium text-sm mb-2">{name}</div>
      {children}
    </div>
  );
}; 
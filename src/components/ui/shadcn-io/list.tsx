'use client';

import React, { createContext, useContext, ReactNode, useState, useRef } from 'react';
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
export const ListProvider = ({ children, onDragEnd, className }: ListProviderProps) => {
  return (
    <ListContext.Provider value={{ onDragEnd }}>
      <div className={cn('flex gap-4 h-full', className)}>{children}</div>
    </ListContext.Provider>
  );
};

// Group (colonna)
export type ListGroupProps = {
  children: ReactNode;
  id: string; // "Planned" | "In Progress" | "Done"
  className?: string;
};
export const ListGroup = ({ children, id, className }: ListGroupProps) => {
  const { onDragEnd } = useContext(ListContext);
  const [isOver, setIsOver] = useState(false);
  const overResetRef = useRef<number | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // abilita drop
    if (!isOver) setIsOver(true);
    if (overResetRef.current) window.clearTimeout(overResetRef.current);
    overResetRef.current = window.setTimeout(() => setIsOver(false), 80);
  };
  const handleDragLeave = () => {
    if (overResetRef.current) window.clearTimeout(overResetRef.current);
    setIsOver(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (overResetRef.current) window.clearTimeout(overResetRef.current);
    setIsOver(false);

    const activeId = e.dataTransfer.getData('text/plain');
    if (!activeId) return;

    onDragEnd?.({ active: { id: activeId }, over: { id } });
  };

  return (
    <div
      className={cn(
        'flex flex-col w-80 bg-muted/50 rounded-lg border transition-shadow',
        isOver && 'ring-2 ring-primary/60 shadow-md',
        className
      )}
      data-group-id={id}
      onDragOverCapture={handleDragOver}
      onDragLeaveCapture={handleDragLeave}
      onDropCapture={handleDrop}
    >
      {children}
    </div>
  );
};

// Header colonna
export type ListHeaderProps = {
  children: ReactNode;
  name: string;
  color?: string;
  className?: string;
};
export const ListHeader = ({ children, name, color, className }: ListHeaderProps) => {
  return (
    <div className={cn('p-3 border-b font-medium text-sm', className)}>
      <div className="flex items-center gap-2">
        {color && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />}
        {name}
      </div>
      {children}
    </div>
  );
};

// Container items
export type ListItemsProps = {
  children: ReactNode;
  className?: string;
};
export const ListItems = ({ children, className }: ListItemsProps) => {
  return (
    <div
      className={cn('flex-1 p-2 space-y-2 overflow-y-auto min-h-[160px]', className)}
      onDragOverCapture={(e) => e.preventDefault()} // abilita drop anche su zone vuote
    >
      {children}
    </div>
  );
};

// Item (card)
export type ListItemProps = {
  children: ReactNode;
  id: string; // es: "feature-1"
  name: string;
  parent: string; // es: "Planned"
  index: number;
  className?: string;
};
export const ListItem = ({ children, id, name, parent, index, className }: ListItemProps) => {
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
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      <div className="font-medium text-sm mb-2">{name}</div>
      {children}
    </div>
  );
};

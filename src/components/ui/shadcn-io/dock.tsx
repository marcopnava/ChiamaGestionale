'use client';
import React, {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 96;
const DEFAULT_DISTANCE = 150;
const DEFAULT_PANEL_HEIGHT = 56;

type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelHeight?: number;
  magnification?: number;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
};

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
};

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  width?: number;
};

type DocContextType = {
  mouseX: number;
  magnification: number;
  distance: number;
};

type DockProviderProps = {
  children: React.ReactNode;
  value: DocContextType;
};

const DockContext = createContext<DocContextType | undefined>(undefined);

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within a DockProvider');
  }
  return context;
}

function Dock({
  children,
  className,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}: DockProps) {
  const [mouseX, setMouseX] = useState(Infinity);
  const [isHovered, setIsHovered] = useState(false);

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4);
  }, [magnification]);

  const heightRow = Math.max(panelHeight, isHovered ? maxHeight : panelHeight);

  const handleMouseMove = (e: React.MouseEvent) => {
    setIsHovered(true);
    setMouseX(e.pageX);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseX(Infinity);
  };



  return (
    <div
      style={{ height: heightRow, scrollbarWidth: 'none' }}
      className="mx-2 flex max-w-full items-end overflow-x-auto"
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'mx-auto flex w-fit gap-4 rounded-2xl bg-card/95 backdrop-blur border border-border px-4 shadow-lg',
          className
        )}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        <DockProvider value={{ mouseX, distance, magnification }}>
          {children}
        </DockProvider>
      </div>
    </div>
  );
}

function DockItem({ children, className }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { distance, magnification, mouseX } = useDock();
  const [isHovered, setIsHovered] = useState(false);
  const [width, setWidth] = useState(40);

  useEffect(() => {
    if (ref.current) {
      const domRect = ref.current.getBoundingClientRect();
      const mouseDistance = mouseX - domRect.x - domRect.width / 2;

      if (Math.abs(mouseDistance) <= distance) {
        const newWidth = Math.max(
          40,
          magnification -
            (Math.abs(mouseDistance) / distance) * (magnification - 40)
        );
        setWidth(newWidth);
      } else {
        setWidth(40);
      }
    }
  }, [mouseX, distance, magnification]);

  return (
    <div
      ref={ref}
      style={{ width }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className={cn(
        'relative inline-flex items-center justify-center transition-all duration-300',
        className
      )}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const childType = child.type as any;
          if (childType === 'button') {
            return cloneElement(child as any, {});
          } else if (childType === DockLabel) {
            return cloneElement(child as any, { width, isHovered });
          } else {
            return cloneElement(child as any, { width });
          }
        }
        return child;
      })}
    </div>
  );
}

function DockLabel({ children, className, isHovered = false }: DockLabelProps & { isHovered?: boolean }) {
  if (!isHovered) return null;

  return (
    <div
      className={cn(
        'absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-border bg-popover px-2 py-0.5 text-xs text-popover-foreground transition-all duration-200',
        className
      )}
      role="tooltip"
      style={{ transform: 'translateX(-50%) translateY(-10px)' }}
    >
      {children}
    </div>
  );
}

function DockIcon({ children, className, width = 40 }: DockIconProps) {
  const iconWidth = width / 2;
  return (
    <div style={{ width: iconWidth }} className={cn('flex items-center justify-center', className)}>
      {children}
    </div>
  );
}

export { Dock, DockIcon, DockItem, DockLabel };

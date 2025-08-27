'use client';
import React, { useState, cloneElement } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface NavigationMenuProps {
  children: React.ReactNode;
  className?: string;
}

export const NavigationMenu = React.forwardRef<
  HTMLDivElement,
  NavigationMenuProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative z-10 flex max-w-max flex-1 items-center justify-center',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
NavigationMenu.displayName = 'NavigationMenu';

export interface NavigationMenuListProps {
  children: React.ReactNode;
  className?: string;
}

export const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  NavigationMenuListProps
>(({ className, children, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn(
        'group flex flex-1 list-none items-center justify-center space-x-1',
        className
      )}
      {...props}
    >
      {children}
    </ul>
  );
});
NavigationMenuList.displayName = 'NavigationMenuList';

export interface NavigationMenuItemProps {
  children: React.ReactNode;
  className?: string;
}

export const NavigationMenuItem = React.forwardRef<
  HTMLLIElement,
  NavigationMenuItemProps
>(({ className, children, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn('relative', className)}
      {...props}
    >
      {children}
    </li>
  );
});
NavigationMenuItem.displayName = 'NavigationMenuItem';

export interface NavigationMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  NavigationMenuTriggerProps
>(({ className, children, asChild = false, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className="relative top-[1px] ml-1 h-3 w-3 transition duration-200"
        aria-hidden="true"
      />
    </button>
  );
});
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export interface NavigationMenuContentProps {
  children: React.ReactNode;
  className?: string;
}

export const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  NavigationMenuContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto bg-popover',
        className
      )}
      {...props}
    >
      <div className="grid w-full grid-cols-1 gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-popover">
        {children}
      </div>
    </div>
  );
});
NavigationMenuContent.displayName = 'NavigationMenuContent';

export interface NavigationMenuLinkProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  asChild?: boolean;
}

export const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  NavigationMenuLinkProps
>(({ className, children, href, asChild = false, ...props }, ref) => {
  if (asChild) {
    return cloneElement(children as React.ReactElement, {
      ref,
      className: cn(
        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        className
      ),
      ...props
    });
  }

  return (
    <a
      ref={ref}
      className={cn(
        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        className
      )}
      href={href}
      {...props}
    >
      {children}
    </a>
  );
});
NavigationMenuLink.displayName = 'NavigationMenuLink';

export interface NavigationMenuIndicatorProps {
  children: React.ReactNode;
  className?: string;
}

export const NavigationMenuIndicator = React.forwardRef<
  HTMLDivElement,
  NavigationMenuIndicatorProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </div>
  );
});
NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';

export interface NavigationMenuViewportProps {
  className?: string;
}

export const NavigationMenuViewport = React.forwardRef<
  HTMLDivElement,
  NavigationMenuViewportProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)] z-50',
        className
      )}
      {...props}
    />
  );
});
NavigationMenuViewport.displayName = 'NavigationMenuViewport'; 
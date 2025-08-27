"use client";

import * as React from "react";

type AppIcon = {
  id: string;
  name: string;
  icon: string; // URL o data URI
};

export function MacOSDock({
  apps,
  openApps = [],
  onAppClick,
}: {
  apps: AppIcon[];
  openApps?: string[];
  onAppClick?: (id: string) => void;
}) {
  const [hoverId, setHoverId] = React.useState<string | null>(null);

  return (
    <div
      className="pointer-events-auto fixed inset-x-0 z-50 flex w-full justify-center"
      style={{ bottom: "calc(8px + env(safe-area-inset-bottom))" }}
      aria-label="MacOS Dock"
      role="menubar"
    >
      <div className="flex items-end gap-3 rounded-2xl border border-gray-200 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-md dark:border-gray-700 dark:bg-neutral-900/90">
        {apps.map((a) => {
          const isOpen = openApps.includes(a.id);
          const isHover = hoverId === a.id;
          return (
            <button
              key={a.id}
              onClick={() => onAppClick?.(a.id)}
              onMouseEnter={() => setHoverId(a.id)}
              onMouseLeave={() => setHoverId(null)}
              className="grid place-items-center"
              aria-label={a.name}
              role="menuitem"
            >
              <img
                src={a.icon}
                alt={a.name}
                className="h-10 w-10 transition-transform duration-150"
                style={{ transform: isHover ? "scale(1.2)" : "scale(1)" }}
              />
              <span className="mt-1 text-[10px]">{a.name}</span>
              {isOpen && (
                <span
                  className="mt-0.5 inline-block h-1 w-1 rounded-full bg-blue-500"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
} 
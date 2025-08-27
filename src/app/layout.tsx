import type { Metadata } from "next";
import "./../styles/globals.css";
import { MobileTopbar } from "@/components/layout/MobileTopbar";
import { ToasterClient } from "@/components/ui/ToasterClient";
import PlatformDock from "@/components/layout/PlatformDock";
import { TextRevealButton } from "@/components/ui/shadcn-io/text-reveal-button";
import { SiteMainNav } from "@/components/site-main-nav";
import { PageTransitionSpinner } from "@/components/ui/shadcn-io/page-transition-spinner";
import { CommandPalette } from "@/components/ui/command-palette";
import { CursorProvider, Cursor, CursorFollow } from "@/components/ui/shadcn-io/animated-cursor";

export const metadata: Metadata = {
  title: "Admin Console",
  description: "Gestionale interno — shell con MacOS Dock",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <CursorProvider>
          <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 backdrop-blur border-b bg-background/95">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <SiteMainNav />
              <div className="flex items-center gap-2">
                <CommandPalette />
                <TextRevealButton 
                  text="Chiama.io" 
                  revealColor="#007aff"
                  strokeColor="rgba(0, 122, 255, 0.3)"
                />
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1200px] p-3 pb-[calc(88px+env(safe-area-inset-bottom))] flex-1">
            <MobileTopbar />
            {children}
          </main>

          <ToasterClient />
        </div>

        <PlatformDock />
        <PageTransitionSpinner />
        
                              <Cursor>
                        <svg
                          className="size-4 text-blue-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40"
                        >
                          <path
                            fill="currentColor"
                            d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
                          />
                        </svg>
                      </Cursor>
        
        </CursorProvider>
      </body>
    </html>
  );
}

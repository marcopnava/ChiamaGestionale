"use client";
import { PinContainer } from '@/components/ui/shadcn-io/3d-pin';

export default function DashboardHero() {
  return (
    <div className="h-[40rem] w-full flex items-center justify-center mb-8">
      <PinContainer
        title="ChiamaGestionale"
        href="/dashboard"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem]">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
            ChiamaGestionale
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500">
              Piattaforma di gestione completa per la tua azienda. Gestisci clienti, prodotti, vendite e report in modo semplice e intuitivo.
            </span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
        </div>
      </PinContainer>
    </div>
  );
} 
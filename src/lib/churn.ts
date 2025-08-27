// Calcolo semplice di rischio churn (0..1) con logistica; pronto a sostituire con tfjs.
export type ChurnInput = {
  daysInactive: number;   // giorni dall'ultimo login
  months: number;         // durata abbonamento
  mrr: number;            // ricavo mensile
  ticketsOpen: number;    // ticket aperti
};

export function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}

export function churnScore(input: ChurnInput): number {
  // Pesi euristici: più inattività e più ticket aperti => più rischio; più months/mrr => meno rischio
  const w = {
    bias: -1.2,
    daysInactive: 0.03,
    months: -0.05,
    mrr: -0.002,
    ticketsOpen: 0.25,
  };
  const z =
    w.bias +
    w.daysInactive * Math.min(input.daysInactive, 365) +
    w.months * Math.min(input.months, 48) +
    w.mrr * Math.min(input.mrr, 10000) +
    w.ticketsOpen * Math.min(input.ticketsOpen, 20);
  return Number(sigmoid(z).toFixed(4));
}

// Stub tfjs (facoltativo): permette un hook futuro per training
export async function predictWithTFJS(batch: ChurnInput[]): Promise<number[]> {
  try {
    await import("@tensorflow/tfjs"); // lazy load
    // Qui potresti caricare un modello salvato; ora applichiamo churnScore a ogni riga.
    return batch.map(churnScore);
  } catch {
    return batch.map(churnScore);
  }
} 
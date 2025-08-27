'use client';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error('GlobalError:', error); }, [error]);
  return (
    <html>
      <body>
        <div style={{ padding: 16 }}>
          <h1>Qualcosa è andato storto</h1>
          <p style={{ opacity: .7, fontSize: 14 }}>{error?.message}</p>
          <button onClick={() => reset()} style={{ marginTop: 12 }}>
            Riprova
          </button>
        </div>
      </body>
    </html>
  );
} 
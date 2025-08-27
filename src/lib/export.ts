import * as XLSX from "xlsx";

export function toCSV<T extends Record<string, any>>(rows: T[]): Buffer {
  if (!rows?.length) return Buffer.from("", "utf-8");
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => {
          const v = r[h] ?? "";
          const s = typeof v === "string" ? v.replace(/"/g, '""') : String(v);
          return `"${s}"`;
        })
        .join(",")
    ),
  ].join("\n");
  return Buffer.from(lines, "utf-8");
}

export function toXLSX<T extends Record<string, any>>(rows: T[], sheetName = "Sheet1"): Buffer {
  const ws = XLSX.utils.json_to_sheet(rows ?? []);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const out = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return out as Buffer;
}

// PDF minimale con jsPDF (dynamic import); se fallisce, fallback testo.
export async function toPDF<T extends Record<string, any>>(rows: T[], title = "Report"): Promise<Uint8Array> {
  try {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt" });
    let y = 40;
    doc.setFontSize(16);
    doc.text(title, 40, y);
    y += 20;
    doc.setFontSize(10);
    if (!rows?.length) {
      doc.text("Nessun dato.", 40, y);
      return new Uint8Array(doc.output("arraybuffer"));
    }
    const headers = Object.keys(rows[0]);
    doc.text(headers.join(" | "), 40, y);
    y += 14;
    for (const r of rows.slice(0, 200)) {
      const line = headers.map((h) => String(r[h] ?? "")).join(" | ");
      doc.text(line.substring(0, 110), 40, y); // clamp semplice
      y += 12;
      if (y > 780) {
        doc.addPage(); y = 40;
      }
    }
    return new Uint8Array(doc.output("arraybuffer"));
  } catch {
    const txt = [title, "", ...(rows ?? []).map((r) => JSON.stringify(r))].join("\n");
    return new TextEncoder().encode(txt);
  }
} 
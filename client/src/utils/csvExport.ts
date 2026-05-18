/**
 * Triggers a CSV file download from a Blob response.
 * Uses the native browser download mechanism — no third-party library needed.
 */
export const downloadCsv = (blob: Blob, filename?: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename ?? `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

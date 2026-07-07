export function logInfo(message: string, meta?: Record<string, unknown>): void {
  console.info(JSON.stringify({ level: "info", message, ...meta }));
}

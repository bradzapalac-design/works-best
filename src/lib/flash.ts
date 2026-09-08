type Handler = (message: string) => void;

const handlers = new Set<Handler>();

export function flash(message: string): void {
  handlers.forEach((h) => h(message));
}

export function subscribeFlash(handler: Handler): () => void {
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
}

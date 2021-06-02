import './app.tsx';

declare global {
  interface Window {
    api: {
      search: (pattern: string) => Promise<string[]>;
    };
  }
}

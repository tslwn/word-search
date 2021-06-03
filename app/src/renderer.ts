import './app.tsx';

declare global {
  interface Window {
    api: {
      search: (query: string) => Promise<string[]>;
    };
  }
}

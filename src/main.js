import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    api_base_url: API_BASE_URL || '/api',
  }
});

export default app;

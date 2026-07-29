import { createApp } from 'vue';
import App from './App.vue';
import { worker } from './mocks';
import './monaco-worker';

await worker.start();

createApp(App).mount('#app');

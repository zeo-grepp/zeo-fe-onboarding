import { createApp } from "vue";
import App from "./App.vue";
import { worker } from "./mocks";
import "./monaco-worker";
import { router } from "./router/index.ts";

await worker.start();

createApp(App).use(router).mount("#app");

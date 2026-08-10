import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import { worker } from "./mocks";
import "./monaco-worker";
import { router } from "./router/index.ts";

worker.start().then(() => createApp(App).use(router).mount("#app"));

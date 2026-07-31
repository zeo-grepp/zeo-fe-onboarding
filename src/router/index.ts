import { createWebHistory, createRouter } from "vue-router";
import ProblemListView from "../views/ProblemListView.vue";
import ProblemDetailView from "../views/ProblemDetailView.vue";

const routes = [
  { path: "/", component: ProblemListView },
  { path: "/problems/:id", component: ProblemDetailView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

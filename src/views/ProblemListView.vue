<script setup lang="ts">
import { useFetch } from "../composables/useFetch";
import type { Problem } from "../mocks/data"; //TODO: type 폴더 분리 고려

const {
  data: problems,
  isLoading,
  error,
} = useFetch<Problem[]>(() => "/lists");
</script>

<template>
  <div class="problem-list">
    <h1>문제 목록</h1>

    <p v-if="isLoading">로딩 중...</p>
    <p v-else-if="error">{{ error.message }}</p>
    <ul v-else>
      <li v-for="problem in problems" :key="problem.id">
        <RouterLink :to="`/problems/${problem.id}`">{{
          problem.title
        }}</RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.problem-list {
  padding: 20px 40px;
}

h1 {
  margin-bottom: 40px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid var(--color-border);
}

li {
  border-bottom: 1px solid var(--color-border);
}

li a {
  display: block;
  padding: 16px 8px;
  color: inherit;
  text-decoration: none;
}

li a:hover {
  background-color: var(--color-border-hover);
}
</style>

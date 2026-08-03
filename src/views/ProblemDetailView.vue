<script setup lang="ts">
import { useRoute } from "vue-router";
import { useFetch } from "../composables/useFetch";
import type { ProblemDetail } from "../mocks/data";
import { ref, watch } from "vue";

const route = useRoute();

const { data: problem } = useFetch<ProblemDetail>(
  () => `/details/${route.params.id}`,
);

const selectedLanguageId = ref<number | null>(null);

watch(
  problem,
  (newProblem) => {
    if (newProblem && newProblem.languages.length > 0) {
      selectedLanguageId.value = newProblem.languages[0].id;
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="problem-detail">
    <nav>
      <RouterLink to="/">문제 목록</RouterLink>
    </nav>
    <div class="content">
      <section class="left">
        <h2>문제 내용</h2>
        <p>{{ problem?.description }}</p>
      </section>

      <section class="right">
        <div class="language">
          <label>현재 언어</label>
          <select v-model="selectedLanguageId">
            <option
              v-for="{ id, language } in problem?.languages"
              :key="id"
              :value="id"
            >
              {{ language }}
            </option>
          </select>
        </div>

        <div class="editor">모나코 에디터</div>

        <div class="result">결과 표시</div>

        <div class="submit">
          <button>제출하기</button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.problem-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
}

nav {
  padding: 12px 20px;
  border-bottom: 1px solid var(--color-border);
  font-weight: 500;
}

nav a {
  color: inherit;
  text-decoration: none;
}

.content {
  display: flex;
  flex: 1;
  min-height: 0;
}

.left {
  flex: 1;
  padding: 20px 40px;
  overflow-y: auto;
}

.left h2 {
  margin-bottom: 32px;
}

.left p {
  white-space: pre-line;
  line-height: 1.6;
}

.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--color-border);
}

.editor {
  flex: 1;
}

.language {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--color-border);
}

.language label {
  font-weight: 500;
}

.language select {
  padding: 4px 12px;
  font-size: 16px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.result {
  height: 200px;
  border-top: 1px solid var(--color-border);
}

.submit {
  display: flex;
  justify-content: flex-end;
  padding: 12px 20px;
  border-top: 1px solid var(--color-border);
}

.submit button {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  background-color: var(--corlor-primary);
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.submit button:hover {
  background-color: var(--corlor-primary-hover);
}
</style>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useFetch } from "../composables/useFetch";
import type { ProblemDetail } from "../mocks/data";
import { computed, ref, watch } from "vue";
import CodeEditor from "../components/CodeEditor.vue";
import ResizableSplit from "../components/ResizableSplit.vue";

const route = useRoute();

const { data: problem } = useFetch<ProblemDetail>(
  () => `/details/${route.params.id}`,
);

const selectedLanguageId = ref<number | null>(null);
const selectedLanguage = computed(() =>
  problem?.value?.languages.find(
    (lang) => lang.id === selectedLanguageId.value,
  ),
);

watch(
  problem,
  (newProblem) => {
    if (newProblem && newProblem.languages.length > 0) {
      selectedLanguageId.value = newProblem.languages[0].id;
    }
  },
  { immediate: true },
);

const horizontalRatio = ref(0.5);
const verticalRatio = ref(0.7);
</script>

<template>
  <!-- TODO: 제목 표시 -->
  <div class="problem-detail">
    <nav>
      <RouterLink to="/">문제 목록</RouterLink>
    </nav>
    <ResizableSplit
      class="content"
      direction="horizontal"
      v-model="horizontalRatio"
    >
      <template #first>
        <section class="left">
          <h2>문제 내용</h2>
          <p>{{ problem?.description }}</p>
        </section>
      </template>

      <template #second>
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

          <ResizableSplit
            class="editor-result"
            direction="vertical"
            v-model="verticalRatio"
          >
            <template #first>
              <div class="editor">
                <CodeEditor
                  v-if="problem && selectedLanguage"
                  :problemId="problem.id"
                  :languageId="selectedLanguage.id"
                  :code="selectedLanguage.initialCode"
                  :language="selectedLanguage.language"
                />
              </div>
            </template>
            <template #second>
              <div class="result">결과 표시</div>
            </template>
          </ResizableSplit>

          <div class="submit">
            <button>제출하기</button>
          </div>
        </section>
      </template>
    </ResizableSplit>
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
  height: 100%;
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
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--color-border);
}

.editor-result {
  flex: 1;
  min-height: 0;
}

.editor {
  height: 100%;
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
  height: 100%;
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
  background-color: var(--color-primary);
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.submit button:hover {
  background-color: var(--color-primary-hover);
}
</style>

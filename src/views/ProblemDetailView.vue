<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useFetch } from "../composables/useFetch";
import { useMutation } from "../composables/useMutation";
import type { ProblemDetail } from "../mocks/data";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import CodeEditor from "../components/CodeEditor.vue";
import ResizableSplit from "../components/ResizableSplit.vue";
import { getLocalStorageItem, setLocalStorageItem } from "../utils/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import type { SubmitParams } from "../mocks/handlers";
import { isChromiumBrowser } from "../utils/agent";

const route = useRoute();
const router = useRouter();

const {
  data: problem,
  isLoading: isProblemLoading,
  error: problemError,
} = useFetch<ProblemDetail>(() => `/details/${route.params.id}`);

const selectedLanguageId = ref<number | null>(null);
const selectedLanguage = computed(() =>
  problem.value?.languages.find((lang) => lang.id === selectedLanguageId.value),
);

watch(selectedLanguageId, (newSelectedLanguageId) => {
  const problemId = problem.value?.id;
  if (!problemId) return;

  setLocalStorageItem(STORAGE_KEYS.language(problemId), newSelectedLanguageId);
});

watch(
  problem,
  (newProblem) => {
    if (newProblem && newProblem.languages.length > 0) {
      const localLanguageId = getLocalStorageItem<number>(
        STORAGE_KEYS.language(newProblem.id),
      );
      selectedLanguageId.value = newProblem.languages.some(
        ({ id }) => id === localLanguageId,
      )
        ? localLanguageId
        : newProblem.languages[0].id;
    }
  },
  { immediate: true },
);

const horizontalRatio = ref(0.5);
const verticalRatio = ref(0.7);

const codeEditorRef = ref<InstanceType<typeof CodeEditor> | null>(null);

const submit = async (params: SubmitParams) => {
  const res = await fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }

  return result;
};

const {
  data: submitResult,
  isLoading: isSubmitResultLoading,
  error: submitResultError,
  mutate,
} = useMutation<[SubmitParams], { msg: string }>(submit);

watch([problem, selectedLanguageId], () => {
  submitResult.value = null;
});

const handleSubmit = () => {
  const code = codeEditorRef.value?.getCode();

  const problemId = problem.value?.id;
  const languageId = selectedLanguageId.value;

  if (!problemId || !languageId) {
    return;
  }

  if (!code) {
    alert("코드를 작성해 주세요.");
    return;
  }

  mutate({
    problemId,
    languageId,
    code,
  });
};

const handleReset = () => {
  codeEditorRef.value?.resetCode();
};

const checkMultiMonitor = () => {
  if (!isChromiumBrowser()) {
    alert("Chromium 계열 브라우저를 이용해 주세요.");
    router.push("/");
  }
  if (window.screen.isExtended) {
    alert("다중 모니터를 사용할 수 없습니다.");
    router.push("/");
  }
};

onMounted(() => {
  checkMultiMonitor();
  window.screen.addEventListener("change", checkMultiMonitor);
});

onUnmounted(() => {
  window.screen.removeEventListener("change", checkMultiMonitor);
});
</script>

<template>
  <!-- TODO: 제목 표시 -->
  <div class="problem-detail">
    <nav>
      <RouterLink to="/">문제 목록</RouterLink>
    </nav>
    <!-- TODO: 화면 전체 로딩으로 개선 -->
    <div v-if="isProblemLoading">로딩 중...</div>
    <div v-else-if="problemError">{{ problemError.message }}</div>
    <ResizableSplit
      v-else
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
                  ref="codeEditorRef"
                  v-if="problem && selectedLanguage"
                  :problemId="problem.id"
                  :languageId="selectedLanguage.id"
                  :code="selectedLanguage.initialCode"
                  :language="selectedLanguage.language"
                />
              </div>
            </template>
            <template #second>
              <div class="result">
                <p v-if="isSubmitResultLoading" class="result-message loading">
                  채점 중...
                </p>
                <p v-else-if="submitResultError" class="result-message error">
                  {{ submitResultError.message }}
                </p>
                <p v-else-if="submitResult" class="result-message">
                  {{ submitResult.msg }}
                </p>
                <p v-else class="result-message placeholder">
                  결과가 여기에 표시됩니다.
                </p>
              </div>
            </template>
          </ResizableSplit>

          <div class="button-list">
            <button class="reset" @click="handleReset">초기화</button>
            <button
              class="submit"
              @click="handleSubmit"
              :disabled="isSubmitResultLoading"
            >
              제출하기
            </button>
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
  padding-top: 12px;
  box-sizing: border-box;
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
  padding: 12px 20px;
  overflow-y: auto;
  border-top: 1px solid var(--color-border);
}

.result-message {
  white-space: pre-line;
  line-height: 1.6;
}

.result-message.placeholder,
.result-message.loading {
  color: var(--color-text-muted);
}

.result-message.error {
  color: var(--color-error);
}

.button-list {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid var(--color-border);
}

.button-list button {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  color: var(--color-white);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.button-list .reset {
  background-color: var(--color-secondary);
}
.button-list .reset:hover {
  background-color: var(--color-secondary-hover);
}

.button-list .submit {
  background-color: var(--color-primary);
}
.button-list .submit:hover {
  background-color: var(--color-primary-hover);
}
</style>

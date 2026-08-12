<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import * as monaco from "monaco-editor";
import { modelCache } from "../monaco-model-cache";
import { setLocalStorageItem, getLocalStorageItem } from "../utils/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { debounce } from "../utils/debounce";

const props = defineProps<{
  problemId: number;
  languageId: number;
  code: string;
  language: string;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

const getCode = () => editor?.getValue();
const resetCode = () => editor?.setValue(props.code);
defineExpose({ getCode, resetCode });

const getModel = (
  problemId: number,
  languageId: number,
  code: string,
  language: string,
) => {
  const cacheKey = `${problemId}-${languageId}`;

  const existingModel = modelCache.get(cacheKey);
  if (existingModel) return existingModel;

  const storageKey = STORAGE_KEYS.code(problemId, languageId);
  const localCode = getLocalStorageItem<string>(storageKey);
  const model = monaco.editor.createModel(localCode ?? code, language);

  const saveContent = debounce((content: string) =>
    setLocalStorageItem(storageKey, content),
  );

  model.onDidChangeContent(() => {
    saveContent(model.getValue());
  });

  modelCache.set(cacheKey, model);

  return model;
};

onMounted(() => {
  if (!containerRef.value) return;

  const initModel = getModel(
    props.problemId,
    props.languageId,
    props.code,
    props.language,
  );

  editor = monaco.editor.create(containerRef.value, {
    model: initModel,
    theme: "vs-light",
    automaticLayout: true,
    scrollBeyondLastLine: false,
  });
});

watch(
  () => [props.problemId, props.languageId],
  ([newProblemId, newLanguageId]) => {
    if (!editor) return;

    const newModel = getModel(
      newProblemId,
      newLanguageId,
      props.code,
      props.language,
    );

    editor.setModel(newModel);
  },
);

onUnmounted(() => {
  editor?.dispose();
  editor = null;
});
</script>

<template>
  <div ref="containerRef" class="code-editor"></div>
</template>

<style scoped>
.code-editor {
  width: 100%;
  min-width: 0;
  height: 100%;
  min-height: 0;
}
</style>

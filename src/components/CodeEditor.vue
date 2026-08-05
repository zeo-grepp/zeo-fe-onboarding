<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";

import * as monaco from "monaco-editor";
import { modelCache } from "../monaco-model-cache";

const props = defineProps<{
  problemId: number;
  languageId: number;
  code: string;
  language: string;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

const getModel = (
  problemId: number,
  languageId: number,
  code: string,
  language: string,
) => {
  const cacheKey = `${problemId}-${languageId}`;

  const existingModel = modelCache.get(cacheKey);
  if (existingModel) return existingModel;

  const model = monaco.editor.createModel(code, language);
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

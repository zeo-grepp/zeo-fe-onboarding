<script setup lang="ts">
import { useRoute } from "vue-router";
import { useFetch } from "../composables/useFetch";
import type { ProblemDetail } from "../mocks/data";

const route = useRoute();

const { data: problem } = useFetch<ProblemDetail>(
  () => `/details/${route.params.id}`,
);
</script>

<template>Problem Detail {{ problem?.id }}</template>

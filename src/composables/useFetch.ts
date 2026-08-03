import { ref } from "vue";

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null);
  const isLoading = ref(true);
  const error = ref<Error | null>(null);

  fetch(url)
    .then((res) =>
      res.ok ? res.json() : Promise.reject(new Error("요청 실패")),
    )
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))
    .finally(() => (isLoading.value = false));

  return { data, isLoading, error };
}

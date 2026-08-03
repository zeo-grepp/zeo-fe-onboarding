import { Ref, ref, watchEffect } from "vue";

export function useFetch<T>(url: Ref<string> | (() => string)) {
  const data = ref<T | null>(null);
  const isLoading = ref(true);
  const error = ref<Error | null>(null);

  watchEffect(() => {
    data.value = null;
    isLoading.value = true;
    error.value = null;

    const currentUrl = typeof url === "function" ? url() : url.value;

    fetch(currentUrl)
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error("요청 실패")),
      )
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
      .finally(() => (isLoading.value = false));
  });

  return { data, isLoading, error };
}

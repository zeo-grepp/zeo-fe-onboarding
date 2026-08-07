import { Ref, ref, watchEffect } from "vue";

export const useFetch = <T>(url: Ref<string> | (() => string)) => {
  const data = ref<T | null>(null);
  const isLoading = ref(true);
  const error = ref<Error | null>(null);

  watchEffect((onCleanup) => {
    const controller = new AbortController();

    data.value = null;
    isLoading.value = true;
    error.value = null;

    const currentUrl = typeof url === "function" ? url() : url.value;

    const fetchData = async () => {
      try {
        const res = await fetch(currentUrl, { signal: controller.signal });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message ?? "요청 실패");
        }

        data.value = data;
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          error.value = err;
        }
      } finally {
        if (!controller.signal.aborted) {
          isLoading.value = false;
        }
      }
    };

    fetchData();

    onCleanup(() => {
      controller.abort();
    });
  });

  return { data, isLoading, error };
};

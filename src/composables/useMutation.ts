import { ref } from "vue";

export const useMutation = <Args extends unknown[], T>(
  mutationFn: (...args: Args) => Promise<T>,
) => {
  const data = ref<T | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const mutate = async (...args: Args) => {
    data.value = null;
    isLoading.value = true;
    error.value = null;

    try {
      data.value = await mutationFn(...args);
    } catch (err) {
      if (err instanceof Error) {
        error.value = err;
      } else {
        error.value = new Error(String(err));
      }
    } finally {
      isLoading.value = false;
    }
  };

  return { data, isLoading, error, mutate };
};

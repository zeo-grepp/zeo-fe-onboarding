import { ref } from "vue";

export const useMutation = <Args extends unknown[], T>(
  mutationFn: (...args: Args) => Promise<T>,
) => {
  const data = ref<T | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const mutate = async (...args: Args) => {
    isLoading.value = true;
    error.value = null;

    try {
      data.value = await mutationFn(...args);
    } catch (err) {
      error.value = err as Error;
    } finally {
      isLoading.value = false;
    }
  };

  return { data, isLoading, error, mutate };
};

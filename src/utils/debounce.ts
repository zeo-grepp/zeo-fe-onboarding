export const debounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay = 300,
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timer !== null) clearTimeout(timer);

    timer = setTimeout(() => {
      timer = null;
      callback(...args);
    }, delay);
  };

  return debounced;
};

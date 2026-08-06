export const setLocalStorageItem = <T>(key: string, value: T) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorageItem = <T>(key: string): T | null => {
  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue) return JSON.parse(storedValue);

    return null;
  } catch (e) {
    return null;
  }
};

// export const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
//   try {
//     const storedValue = window.localStorage.getItem(key);

//     if (storedValue) {
//       return JSON.parse(storedValue);
//     }

//     return defaultValue;
//   } catch (e) {
//     return defaultValue;
//   }
// };

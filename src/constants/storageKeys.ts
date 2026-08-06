export const STORAGE_KEYS = {
  code: (problemId: number, languageId: number) =>
    `code:${problemId}-${languageId}`,
  language: (problemId: number) => `lang:${problemId}`,
};

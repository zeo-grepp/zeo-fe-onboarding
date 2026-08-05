import * as monaco from "monaco-editor";

//TODO: 새로고침 시 유지 로직 추가
export const modelCache = new Map<string, monaco.editor.ITextModel>();

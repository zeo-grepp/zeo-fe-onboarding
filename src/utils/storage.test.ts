import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLocalStorageItem, setLocalStorageItem } from "./storage";

describe("localStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("setLocalStorageItem", () => {
    it("값을 JSON 문자열로 변환해 localStorage에 저장한다", () => {
      const value = {
        name: "Kim",
        roles: ["admin", "user"],
      };

      setLocalStorageItem("test-key", value);

      expect(window.localStorage.getItem("test-key")).toBe(
        JSON.stringify(value),
      );
    });
  });

  describe("getLocalStorageItem", () => {
    it("저장된 JSON 값을 파싱해 반환한다", () => {
      const value = {
        name: "Kim",
        roles: ["admin", "user"],
      };

      window.localStorage.setItem("test-key", JSON.stringify(value));

      expect(getLocalStorageItem("test-key")).toEqual(value);
    });

    it("해당 key가 존재하지 않으면 null을 반환한다", () => {
      expect(getLocalStorageItem("unknown-key")).toBeNull();
    });

    it("저장된 값이 올바른 JSON이 아니면 null을 반환한다", () => {
      window.localStorage.setItem("test-key", "{invalid json}");

      expect(getLocalStorageItem("test-key")).toBeNull();
    });

    it("localStorage 접근 중 에러가 발생하면 null을 반환한다", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("localStorage is unavailable");
      });

      expect(getLocalStorageItem("test-key")).toBeNull();
    });
  });

  describe("setLocalStorageItem과 getLocalStorageItem 통합 동작", () => {
    it("저장한 값을 동일하게 조회한다", () => {
      const value = {
        name: "Kim",
        roles: ["admin", "user"],
      };

      setLocalStorageItem("test-key", value);

      expect(getLocalStorageItem("test-key")).toEqual(value);
    });
  });
});

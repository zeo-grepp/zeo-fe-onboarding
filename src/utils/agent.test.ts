import { afterEach, describe, expect, it, vi } from "vitest";
import { isChromiumBrowser } from "./agent";

describe("isChromiumBrowser", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("navigator가 없으면 false를 반환한다", () => {
    vi.stubGlobal("navigator", undefined);

    expect(isChromiumBrowser()).toBe(false);
  });

  describe("userAgentData.brands가 있는 경우", () => {
    it("Chromium brand가 있으면 true를 반환한다", () => {
      vi.stubGlobal("navigator", {
        userAgentData: {
          brands: [
            { brand: "Not_A Brand", version: "99" },
            { brand: "Chromium", version: "120" },
            { brand: "Google Chrome", version: "120" },
          ],
        },
        userAgent: "",
      });

      expect(isChromiumBrowser()).toBe(true);
    });

    it("Chromium brand가 없으면 false를 반환한다", () => {
      vi.stubGlobal("navigator", {
        userAgentData: {
          brands: [
            { brand: "Not_A Brand", version: "99" },
            { brand: "Google Chrome", version: "120" },
          ],
        },
        userAgent: "Mozilla/5.0 Chrome/120.0.0.0",
      });

      expect(isChromiumBrowser()).toBe(false);
    });
  });

  describe("userAgentData.brands가 없는 경우", () => {
    it.each([
      "Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 Chromium/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 CriOS/120.0.0.0 Mobile/15E148 Safari/604.1",
    ])("userAgent가 Chromium 계열이면 true를 반환한다", (userAgent) => {
      vi.stubGlobal("navigator", {
        userAgent,
      });

      expect(isChromiumBrowser()).toBe(true);
    });

    it.each([
      "Mozilla/5.0 Firefox/120.0",
      "Mozilla/5.0 FxiOS/120.0 Mobile/15E148 Safari/605.1.15",
      "Mozilla/5.0 Safari/605.1.15",
    ])("userAgent가 Chromium 계열이 아니면 false를 반환한다", (userAgent) => {
      vi.stubGlobal("navigator", {
        userAgent,
      });

      expect(isChromiumBrowser()).toBe(false);
    });

    it.each([
      "Mozilla/5.0 Chrome/120.0 Firefox/120.0",
      "Mozilla/5.0 Chrome/120.0 FxiOS/120.0",
    ])(
      "Firefox 계열이면 Chromium 문자열이 있어도 false를 반환한다",
      (userAgent) => {
        vi.stubGlobal("navigator", { userAgent });

        expect(isChromiumBrowser()).toBe(false);
      },
    );

    it("userAgentData는 있지만 brands가 없으면 userAgent를 사용한다", () => {
      vi.stubGlobal("navigator", {
        userAgentData: {},
        userAgent: "Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36",
      });

      expect(isChromiumBrowser()).toBe(true);
    });
  });
});

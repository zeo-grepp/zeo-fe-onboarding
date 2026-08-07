import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { debounce } from "./debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("delay가 지나기 전에는 callback을 호출하지 않는다", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 300);

    debounced("hello");
    vi.advanceTimersByTime(299);

    expect(callback).not.toHaveBeenCalled();
  });

  it("delay가 지나면 callback을 호출한다", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 300);

    debounced("hello");
    vi.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith("hello");
  });

  it("delay 안에 여러 번 호출되면 마지막 호출만 실행한다", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 300);

    debounced("first");
    vi.advanceTimersByTime(100);

    debounced("second");
    vi.advanceTimersByTime(100);

    debounced("third");
    vi.advanceTimersByTime(299);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith("third");
  });

  it("callback이 실행된 이후 새로운 호출도 다시 delay만큼 지연한다", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 300);

    debounced("first");
    vi.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledTimes(1);

    debounced("second");
    vi.advanceTimersByTime(299);

    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1);

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith("second");
  });

  it("delay를 생략하면 기본값으로 300ms를 사용한다", () => {
    const callback = vi.fn();
    const debounced = debounce(callback);

    debounced();

    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledOnce();
  });
});

export const isChromiumBrowser = () => {
  if (typeof navigator === "undefined") return false;

  const navigatorWithUAData = navigator;

  if (navigatorWithUAData.userAgentData?.brands) {
    return navigatorWithUAData.userAgentData.brands.some(({ brand }) =>
      /Chromium/i.test(brand),
    );
  }

  return (
    /Chrome|Chromium|CriOS/i.test(navigator.userAgent) &&
    !/Firefox|FxiOS/i.test(navigator.userAgent)
  );
};

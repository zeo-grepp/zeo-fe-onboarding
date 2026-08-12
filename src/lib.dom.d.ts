declare global {
  interface Screen {
    isExtended?: boolean;

    addEventListener(
      type: "change",
      listener: (this: Screen, ev: Event) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;

    removeEventListener(
      type: "change",
      listener: (this: Screen, ev: Event) => any,
      options?: boolean | EventListenerOptions,
    ): void;
  }

  interface NavigatorUABrandVersion {
    brand: string;
    version: string;
  }

  interface NavigatorUAData {
    brands: NavigatorUABrandVersion[];
  }

  interface Navigator {
    userAgentData?: NavigatorUAData;
  }
}

export {};

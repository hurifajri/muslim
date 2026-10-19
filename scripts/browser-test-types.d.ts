/** Shared contract for the Node-driven browser regression modules. */
export type BrowserTestContext = Readonly<{
  browser: (...args: string[]) => string;
  check: (body: string) => string;
  waitFor: (expression: string) => string;
  base: string;
}>;

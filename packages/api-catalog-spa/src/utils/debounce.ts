/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export const debounce = (func: any, timeout = 500): any => {
  let timer: NodeJS.Timeout | undefined;
  return (...args: unknown[]) => {
    clearTimeout(timer as NodeJS.Timeout);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
};

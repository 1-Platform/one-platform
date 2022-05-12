/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export const debouncePromise = (func: any, timeout = 500): any => {
  let timer: NodeJS.Timeout | undefined;
  return (...args: unknown[]) =>
    new Promise((resolve, reject) => {
      clearTimeout(timer as NodeJS.Timeout);
      timer = setTimeout(() => {
        try {
          resolve(func(...args));
        } catch (error) {
          reject(error);
        }
      }, timeout);
    });
};

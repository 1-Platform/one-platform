/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * This function is used to convert any function to callback function
 * Why: To pass function to event handlers on fly neatly
 * @param fn : function to be callback
 * @param primaryArgs: primary set of arguments or explicit
 * @returns  the callback function with arguments
 */
export const callbackify = (fn: any, ...primaryArgs: any[]) => {
  return (...cbArgs: any[]) => fn(...primaryArgs, ...cbArgs);
};

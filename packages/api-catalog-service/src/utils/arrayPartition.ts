/**
 * This function is used to filter an array and based on filtering
 * Obtain two array of passing and failing condition
 */
export const arrayPartition = <T extends unknown>(
  arr: T[],
  cb: (arg0: T) => boolean,
): [T[], T[]] => {
  const pass: T[] = [];
  const fail: T[] = [];
  arr.forEach((el) => (cb(el) ? pass.push(el) : fail.push(el)));

  return [pass, fail];
};

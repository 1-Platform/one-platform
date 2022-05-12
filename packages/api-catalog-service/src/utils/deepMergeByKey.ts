const isObject = (item: unknown) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

export const deepMergeByKey = (
  source: Record<string, any>,
  target: Record<string, any>,
  cmpKey: string,
): Record<string, any> => {
  let finalTarget: Record<string, any> = {};

  if (isObject(source) && isObject(target)) {
    if (source?.[cmpKey] === target?.[cmpKey]) {
      finalTarget = { ...source, ...target };
    }

    Object.keys(source).forEach((key) => {
      if (isObject(source[key]) && isObject(target[key])) {
        const tmpTarget = deepMergeByKey(source[key], target[key], cmpKey);
        finalTarget[key] = tmpTarget;
      } else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
        const sourceEl = source[key];

        const lookUpTable: Record<string, number> = {};
        sourceEl.forEach((el: any, index: number) => {
          lookUpTable[el[cmpKey]] = index;
        });

        target[key].forEach((el: any, index: number) => {
          if (Boolean(el[cmpKey]) && typeof lookUpTable[el[cmpKey]] === 'number') {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const tmpTarget = deepMergeByKey(
              source[key][lookUpTable[el.id]],
              target[key][index],
              cmpKey,
            );
            finalTarget[key][index] = tmpTarget;
          }
        });
      }
    });
  }
  return finalTarget;
};

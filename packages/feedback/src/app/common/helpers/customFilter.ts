/**
 * customFilter used to search the input text on
 * objlist on every property.
 * @param {any[]} objList is the array of object
 * @param {string} text is the search text
 * @returns {any[]} the array of object where the text is present
 */
export const customFilter = (objList, text) => {
  if (undefined === text || text === '') {
    return objList;
  }
  return objList.filter(product => {
    let flag;
    for (const prop in product) {
      if (product.hasOwnProperty(prop)) {
        flag = false;
        if (product[prop]) {
          flag = product[prop].toString().toLowerCase().indexOf(text.toLowerCase()) > -1;
        }
        // tslint:disable-next-line:curly
        if (flag) break;
      }
    }
    return flag;
  });
};

export const omitTypename = (key, value) => (key === '__typename' ? undefined : value);

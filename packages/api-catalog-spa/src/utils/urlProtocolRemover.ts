/**
 * This function is used to remove any protocal from a url like http or https
 * @param {String} url
 * @returns {String} host + pathname
 */
export const urlProtocolRemover = (url: string): string => {
  try {
    const { host, pathname } = new URL(url);
    const path = pathname === '/' ? '' : pathname;
    return host + path;
  } catch {
    return '';
  }
};

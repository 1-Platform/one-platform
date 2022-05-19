export const loadThirdPartyScript = (
  scriptURL: string,
  scriptId: string,
  callback?: () => void,
  errCallback?: () => void
) => {
  const existingScript = document.getElementById('googleMaps');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = scriptURL;
    script.id = scriptId;
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
    script.onerror = () => {
      if (errCallback) errCallback();
    };
  }
  if (existingScript && callback) callback();
};

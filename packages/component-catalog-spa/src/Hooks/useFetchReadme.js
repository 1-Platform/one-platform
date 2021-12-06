import { useEffect, useState } from "react";

const useFetchReadme = (componentLink) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const abortErrorSetter = (err) => {
    if (err.name === 'AbortError') {
      console.warn('Fetch Aborted!');
    } else {
      setIsPending(false);
      setError(err.name);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    (async function () {
      try {
        const componentsDir = await fetch(componentLink, { signal });
        const componentDirJSON = await componentsDir.json();
  
        const imagesDir = await fetch(componentDirJSON.find(item => item.name === 'docs').url, { signal });
        const imagesDirJSON = await imagesDir.json();
        setImages(imagesDirJSON.filter(item => item.name.endsWith('.png') || item.name.endsWith('.jpg')));
    
        const readmeRawUrl = await fetch(componentDirJSON.find(item => item.name === 'README.md').download_url, { signal })
        const readmeText = await readmeRawUrl.text()
        setData(readmeText);
        setIsPending(false)
      } catch (err) {
        abortErrorSetter(err);
      }
    })();
    return () => {
      setIsPending(true);
      setData(null);
      setError(null);
      setImages([]);
      return abortController.abort();
    };
  }, [componentLink]);
  return {
    data,
    images,
    isPending,
    error,
  };
};

export default useFetchReadme;

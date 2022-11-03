import { useLayoutEffect, useState } from "react";

interface IDynamicScrollSpyOptions {
  callback?: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
  containerClass: string,
}

export const useDynamicScrollSpy = ({ containerClass, callback, options }: IDynamicScrollSpyOptions) => {

  const [intersectingEntries, setIntersectingEntries] = useState<IntersectionObserverEntry[]>([]);

  useLayoutEffect(() => {
    const sections = document.querySelectorAll(containerClass);

    const observer = new IntersectionObserver((entries, ...args) => {
      callback?.(entries, ...args);
      setIntersectingEntries(entries.filter(entry => entry.isIntersecting));
    }, options);

    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    }
  }, [callback, containerClass, options]);

  return intersectingEntries;
}

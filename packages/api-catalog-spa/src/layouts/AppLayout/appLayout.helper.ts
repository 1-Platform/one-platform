import { config } from 'config';
import { BreadCrumbLink } from './types';

const urlLookUpTable: Record<string, BreadCrumbLink> = {};

export const handleBreadCrumbLinkGenerator = (url: string): BreadCrumbLink[] => {
  const currentUrl = url.slice(config.baseURL.length);
  const breadCrumbLinks: BreadCrumbLink[] = [];

  currentUrl.split('/').forEach((urlSub) => {
    if (urlSub && urlLookUpTable?.[urlSub]) {
      breadCrumbLinks.push(urlLookUpTable[urlSub]);
    }
  });

  return breadCrumbLinks;
};

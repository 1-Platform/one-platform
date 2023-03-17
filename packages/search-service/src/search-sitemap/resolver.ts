import { Request } from 'express';
import { SiteMaps } from './schema';

export const getSiteMap = async (req: Request) => {
  const { contentType } = req.query;

  const sitemapData = (await SiteMaps.find()).map((item) => ({
    url: item.url,
    contentType: item.contentType,
    lastModified: new Date().toISOString(),
  }));

  const filteredSitemapData = contentType
    ? sitemapData.filter((item) => item.contentType === contentType)
    : sitemapData;

  return {
    count: filteredSitemapData.length,
    data: filteredSitemapData,
  };
};

import { HTTPDataSource, Request } from 'apollo-datasource-http';
import { Pool } from 'undici';
import {
  CreateWebsiteDTO,
  TMatamoProject,
  TMatomoRes,
  TUserActionByPageURLData,
  TUserActionsData,
  TUserGeographyData,
  TUserHistoryDTO,
  TUserMetricsDTO,
  TUserVisitorData,
  TUserVisitorFrequencyData,
  UpdateWebsiteDTO,
} from './types';

export class MatomoAPI extends HTTPDataSource<IContext> {
  token: string;

  constructor(baseURL: string, token: string, pool: Pool) {
    // global client options
    super(baseURL, {
      pool,
      clientOptions: {
        bodyTimeout: 5000,
        headersTimeout: 2000,
      },
      requestOptions: {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    });
    this.token = token;
  }

  async onRequest(request: Request<unknown>): Promise<void> {
    request.path = `${request.path}?format=json&module=API`;
  }

  async createWebsite({ appID, currency, urls = [] }: CreateWebsiteDTO) {
    const params = new URLSearchParams({
      method: 'SitesManager.addSite',
      token_auth: this.token,
      siteName: appID,
      currency,
      excludeUnknownUrls: '1',
    });
    urls.forEach((url) => params.append('urls', url));

    const data = await this.post<TMatomoRes<{ value: number }>>('/index.php', {
      body: params.toString(),
    });

    return data.body;
  }

  async getAllWebsites() {
    const params = new URLSearchParams({
      method: 'SitesManager.getAllSites',
      token_auth: this.token,
    });
    return this.post<TMatomoRes<TMatamoProject[]>>('/index.php', {
      body: params.toString(),
    });
  }

  async getWebsiteBySiteId(idSite: string) {
    const url = new URLSearchParams({
      method: 'SitesManager.getSiteFromId',
      token_auth: this.token,
      idSite,
    });

    const data = await this.post<TMatomoRes<TMatamoProject>>('/index.php', {
      body: url.toString(),
    });

    return data.body;
  }

  async updateWebsite(idSite: string, { currency, urls = [] }: UpdateWebsiteDTO) {
    const params = new URLSearchParams({
      method: 'SitesManager.updateSite',
      token_auth: this.token,
      idSite,
    });

    if (currency) params.set('currency', currency);
    urls.forEach((url) => params.append('urls', url));

    const data = await this.post<TMatomoRes<{ value: number }>>('/index.php', {
      body: params.toString(),
    });

    return data.body;
  }

  async deleteWebsite(idSite: string) {
    return this.post('/index.php', {
      query: {
        method: 'SitesManager.deleteSite',
        token_auth: this.token,
        idSite,
      },
    });
  }

  async getUserVisitMetrics(idSite: string, filter: TUserMetricsDTO = {}) {
    const body = new URLSearchParams({
      idSite,
      token_auth: this.token,
      method: 'API.getProcessedReport',
      period: filter?.period || 'day',
      date: filter?.date || 'yesterday',
      apiModule: 'VisitsSummary',
      apiAction: 'get',
    }).toString();

    return this.post<TMatomoRes<TUserVisitorData>>('/index.php', {
      body,
    });
  }

  async getUserVisitFrequencyMetrics(idSite: string, filter: TUserMetricsDTO = {}) {
    const body = new URLSearchParams({
      idSite,
      token_auth: this.token,
      method: 'API.getProcessedReport',
      period: filter?.period || 'day',
      date: filter?.date || 'yesterday',
      apiModule: 'VisitFrequency',
      apiAction: 'get',
    }).toString();

    return this.post<TMatomoRes<TUserVisitorFrequencyData>>('/index.php', {
      body,
    });
  }

  async getUserGeographyMetrics(idSite: string, filter: TUserHistoryDTO = {}) {
    const body = new URLSearchParams({
      idSite,
      token_auth: this.token,
      method: 'API.getProcessedReport',
      period: filter?.period || 'day',
      date: filter?.date || 'yesterday',
      apiModule: 'UserCountry',
      apiAction: filter.type || 'getCountry',
    }).toString();

    return this.post<TMatomoRes<TUserGeographyData>>('/index.php', {
      body,
    });
  }

  async getUserDeviceMetrics(idSite: string, filter: TUserHistoryDTO = {}) {
    const body = new URLSearchParams({
      idSite,
      token_auth: this.token,
      method: 'API.getProcessedReport',
      period: filter?.period || 'day',
      date: filter?.date || 'yesterday',
      apiModule: 'DevicesDetection',
      apiAction: filter.type || 'getType',
    }).toString();

    return this.post<TMatomoRes<TUserGeographyData>>('/index.php', {
      body,
    });
  }

  async getUserActionMetrics(idSite: string, filter: TUserMetricsDTO = {}) {
    const body = new URLSearchParams({
      idSite,
      token_auth: this.token,
      method: 'API.getProcessedReport',
      period: filter?.period || 'day',
      date: filter?.date || 'yesterday',
      apiModule: 'Actions',
      apiAction: 'get',
    }).toString();

    return this.post<TMatomoRes<TUserActionsData>>('/index.php', {
      body,
    });
  }

  async getUserActionByPageURLMetrics(idSite: string, filter: TUserMetricsDTO = {}) {
    const body = new URLSearchParams({
      idSite,
      token_auth: this.token,
      method: 'API.getProcessedReport',
      period: filter?.period || 'day',
      date: filter?.date || 'yesterday',
      apiModule: 'Actions',
      apiAction: 'getPageUrls',
    }).toString();

    return this.post<TMatomoRes<TUserActionByPageURLData>>('/index.php', {
      body,
    });
  }
}

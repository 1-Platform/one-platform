import { HTTPDataSource } from 'apollo-datasource-http';
import { OutageAPI } from './types';

export class OutageStatusAPI extends HTTPDataSource {
  constructor(baseURL: string) {
    // global client options
    super(baseURL, {
      clientOptions: {
        bodyTimeout: 5000,
        headersTimeout: 2000,
      },
    });
  }

  async getOutageStatusList() {
    const data = await this.get<OutageAPI>('/api/v2/components.json');
    return data.body.components.filter(({ group_id }) => !group_id);
  }
}

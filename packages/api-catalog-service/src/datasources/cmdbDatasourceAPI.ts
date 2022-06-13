import { HTTPDataSource } from 'apollo-datasource-http';
import { CMDBAPI } from './types';

export class CMDBDataSourceAPI extends HTTPDataSource {
  constructor(baseURL: string, username: string, password: string) {
    // global client options
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    super(baseURL, {
      clientOptions: {
        bodyTimeout: 5000,
        headersTimeout: 2000,
      },
      requestOptions: {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    });
  }

  async getCMDBApps(name = '', appID = '', limit = 20) {
    const res = await this.get<CMDBAPI>('/api/now/table/cmdb_ci_business_app', {
      query: {
        sysparm_limit: limit,
        sysparm_query: `nameLIKE${name}^u_application_idLIKE${appID}`,
      },
    });
    return res.body.result;
  }
}

const fetch = require('node-fetch');
import { HttpsProxyAgent } from 'https-proxy-agent';
global.Headers = fetch.Headers;

class IndexHelper {
    private static SearchGroupHelperInstance: IndexHelper;
    constructor() { }
    public static indexHelper() {
        if (!IndexHelper.SearchGroupHelperInstance) {
            IndexHelper.SearchGroupHelperInstance = new IndexHelper();
        }
        return IndexHelper.SearchGroupHelperInstance;
    }
    public auth() {
        let headers = new Headers();
        let body = new URLSearchParams();
        body.append("grant_type", "client_credentials");
        body.append("client_id", `${process.env.CLIENT_ID}`);
        body.append("client_secret", `${process.env.CLIENT_SECRET}`);
        return fetch(`${process.env.SSO_URL}`, {
            method: `POST`,
            headers,
            body: body,
        }).then((response: any) => response.json())
            .then((result: any) => result)
            .catch((err: any) => {
                throw err;
            });
    }

    public async index ( body: any ) {
        const authData: any = await this.auth();
        let headers = new Headers();
        headers.append(`Authorization`, `Bearer ${authData.access_token}`);
        headers.append(`Content-Type`, `application/json`);
        headers.append(`Accept`, `application/json`);
        return fetch(`${process.env.HYDRA_API}/index`, {
            method: `POST`,
            headers,
            body: JSON.stringify(body),
            agent: process.env.NODE_ENV !== 'production' ? new HttpsProxyAgent(`${process.env.AKAMAI_API}`) : null,
        } ).then( ( response: SearchResponseCode ) => {
            return { 'status': response.status };
        }).catch((err: any) => {
            throw err;
        } );
    }

    public async manageIndex ( data: any, mode: string ) {
        if (mode === 'index') {
            return this.index(data);
        } else if (mode === 'delete') {
            return this.delete(data);
        }
    }

    public async delete(body: any) {
        const authData: any = await this.auth();
        let headers = new Headers();
        headers.append(`Authorization`, `Bearer ${authData.access_token}`);
        headers.append(`Content-Type`, `application/json`);
        headers.append(`Accept`, `application/json`);
        return fetch(`${process.env.HYDRA_API}/delete`, {
            method: `DELETE`,
            headers,
            body: JSON.stringify(body),
            agent: process.env.NODE_ENV !== 'production' ? new HttpsProxyAgent(`${process.env.AKAMAI_API}`) : null,
        } ).then( ( response: SearchResponseCode ) => {
            return { 'status': response.status };
        }).catch((err: any) => {
            throw err;
        });
    }

    public async search(params: any) {
        const authData: any = await this.auth();
        let headers = new Headers();
        headers.append(`Authorization`, `Bearer ${authData.access_token}`);
        headers.append(`Content-Type`, `application/json`);
        headers.append(`Accept`, `application/json`);
        return fetch(`${process.env.SEARCH_API}?q=${params.query}&start=${params.start}&rows=${params.rows}&sort=timestamp desc`, {
            method: `GET`,
            headers,
        }).then((response: any) => response.json())
            .then(async (result: SearchResponseType) => {
                result.response.docs = result.response.docs.map((doc: any) => {
                    Object.keys(doc).forEach((key: string) => {
                        if (key !== 'tags') {
                            doc[key] = doc[key].toString();
                        }
                    });
                    return doc;
                }) || [];
                return result;
            }).catch((err: any) => {
                throw err;
            });
    }
}

export const SearchIndexHelper = IndexHelper.indexHelper();

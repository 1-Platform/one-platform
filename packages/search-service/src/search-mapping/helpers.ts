const fetch = require('node-fetch');
global.Headers = fetch.Headers;

class APITemplateHelper {
    private static SearchGroupHelperInstance: APITemplateHelper;
    constructor() { }
    public static templateHelper() {
        if (!APITemplateHelper.SearchGroupHelperInstance) {
            APITemplateHelper.SearchGroupHelperInstance = new APITemplateHelper();
        }
        return APITemplateHelper.SearchGroupHelperInstance;
    }

    public objectStringMapper(object: any, param: string) {
        let indexProp = param.replace(/\[(\w+)\]/g, '.$1');
        indexProp = indexProp.replace(/^\./, '');
        let indexList = indexProp.split('.');
        indexList.forEach((element: any) => {
            if (element in object) {
                object = object[element];
            } else {
                return;
            }
        });
        return object;
    }

    public listHomeType() {
        let headers = new Headers();
        let body = JSON.stringify({
            query: `query ListHomeType {
                        listHomeType {
                            _id
                            name
                        }
                    }`,
            variables: null
        });
        headers.append(`Authorization`, `${process.env.GATEWAY_AUTH_TOKEN}`);
        headers.append(`Content-Type`, `application/json`);
        return fetch(`${process.env.API_GATEWAY}`, {
            method: `POST`,
            headers,
            body: body,
        }).then((response: any) => response.json())
            .then((result: any) => result.data.listHomeType)
            .catch((err: any) => {
                throw err;
            });
    }

    public fetchApi(authorizationHeader: any, apiUrl: any, query: any, variables: any, mode: any) {
        let headers = new Headers();
        let body = JSON.stringify({
            query,
            variables
        });
        headers.append(`Authorization`, `${authorizationHeader || process.env.GATEWAY_AUTH_TOKEN}`);
        headers.append(`Content-Type`, `application/json`);
        return fetch(apiUrl, {
            method: mode || `POST`,
            headers,
            body: body,
        })
        .then((result: any) => result.json())
        .then((result: any) => result.data)
        .catch((err: any) => {
            throw err;
        });
    }
}

export const TemplateHelper = APITemplateHelper.templateHelper();

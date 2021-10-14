import { fetch } from "cross-fetch";
import { API_GATEWAY, GATEWAY_AUTH_TOKEN } from "../setup/env";

class APITemplateHelper {
  _headers: HeadersInit = {
    Authorization: GATEWAY_AUTH_TOKEN,
    "Content-Type": "application/json",
  };

  private static SearchGroupHelperInstance: APITemplateHelper;
  constructor() {}
  public static templateHelper() {
    if (!APITemplateHelper.SearchGroupHelperInstance) {
      APITemplateHelper.SearchGroupHelperInstance = new APITemplateHelper();
    }
    return APITemplateHelper.SearchGroupHelperInstance;
  }

  public objectStringMapper(object: any, param: string) {
    let indexProp = param.replace(/\[(\w+)\]/g, ".$1");
    indexProp = indexProp.replace(/^\./, "");
    let indexList = indexProp.split(".");
    indexList.forEach((element: any) => {
      if (element in object) {
        object = object[element] || "";
      } else {
        return;
      }
    });
    return object;
  }

  public listApps() {
    const body = JSON.stringify({
      query: /* GraphQL */ `
        query Apps {
          apps {
            id
            name
          }
        }
      `,
      variables: {},
    });
    return fetch(API_GATEWAY, {
      method: `POST`,
      headers: this._headers,
      body,
    })
      .then((response: any) => response.json())
      .then((result: any) => result.data.apps)
      .catch((err: any) => {
        throw err;
      });
  }

  public fetchApi(
    authorizationHeader: any,
    apiUrl: any,
    query: any,
    param: any,
    mode: any
  ) {
    const body = JSON.stringify({
      query,
      param,
    });
    return fetch(apiUrl ?? API_GATEWAY, {
      method: mode ?? `POST`,
      headers: {
        ...this._headers,
        ...(authorizationHeader ? { Authorization: authorizationHeader } : {}),
      },
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

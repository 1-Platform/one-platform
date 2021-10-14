import { HttpsProxyAgent } from "https-proxy-agent";
import {
  AKAMAI_API,
  CLIENT_ID,
  CLIENT_SECRET,
  ENABLE_HYDRA_PROXY,
  HYDRA_API,
  SEARCH_API,
  SSO_URL,
} from "../setup/env";
import axios from "axios";

const proxyAgent =
  ENABLE_HYDRA_PROXY === "true"
    ? { httpsAgent: new HttpsProxyAgent(AKAMAI_API) }
    : {};

export async function auth() {
  const body = new URLSearchParams();
  body.append("grant_type", "client_credentials");
  body.append("client_id", CLIENT_ID);
  body.append("client_secret", CLIENT_SECRET);

  const res = await axios.post<SSOAuthResponse>(SSO_URL, body);

  if (res.status >= 300) {
    throw res.data;
  }
  return res.data;
}

function getHeaders(access_token?: string) {
  return {
    Authorization: `Bearer ${access_token ?? ""}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export async function index(body: any, retries = 3): Promise<any> {
  const { access_token } = await auth();

  const res = await axios.request<IndexResponse>({
    url: HYDRA_API + "/index",
    method: "POST",
    headers: getHeaders(access_token),
    data: body,
    ...proxyAgent,
  });

  if (res.status >= 300) {
    console.error("Indexing failed with error:", res.data);
    if (retries > 0) {
      return await index(body, retries - 1);
    }
  }
  return { status: res.status, response: res.data };
}

export async function deleteIndex(body: any) {
  const { access_token } = await auth();

  const res = await axios.request<DeleteIndexResponse>({
    url: HYDRA_API + "/delete",
    method: "DELETE",
    headers: getHeaders(access_token),
    data: { ...body },
    ...proxyAgent,
  });

  return { status: res.status, response: res.data };
}

export async function search(params: any) {
  const { access_token } = await auth();
  const url = new URL(SEARCH_API);
  url.searchParams.append("q", params.query);
  url.searchParams.append("start", params.start);
  url.searchParams.append("rows", params.rows);
  url.searchParams.append("sort", "timestamp desc");

  const res = await axios.get<SearchResponse>(url.toString(), {
    headers: getHeaders(access_token),
  });

  if (res.status >= 300) {
    throw res.data;
  }

  const result = res.data;
  /* Converting all the document fields to string */
  result.response.docs =
    result?.response?.docs?.map((doc: any) => {
      Object.keys(doc).forEach((key) => {
        if (key !== "tags") {
          doc[key] = doc[key].toString();
        }
      });
      return doc;
    }) ?? [];

  return result;
}

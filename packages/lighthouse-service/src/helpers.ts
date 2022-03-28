/* eslint-disable class-methods-use-this */
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { camelCase } from 'lodash';
import fetch, { Headers } from 'node-fetch';
import Logger from './lib/logger';

const redisOptions: Redis.RedisOptions = {
  host: process.env.REDIS_URL,
  port: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
  retryStrategy: (times: any) => Math.min(times * 50, 2000),
} as any;

export const pubsub = new RedisPubSub({
  publisher: new Redis(redisOptions),
  subscriber: new Redis(redisOptions),
});

const handleFetchError = (response:any) => {
  if (!response.ok) {
    throw response;
  }
  return response;
};

class LHCIHelper {
  private static LHCIHelperInstance: LHCIHelper;

  public static lhciHelper() {
    if (!LHCIHelper.LHCIHelperInstance) {
      LHCIHelper.LHCIHelperInstance = new LHCIHelper();
    }
    return LHCIHelper.LHCIHelperInstance;
  }

  fetchProfileFavicon(email: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return fetch(`${process.env.GITLAB_URL}/api/v4/avatar?email=${email}`, {
      method: 'GET',
      headers,
    })
      .then(handleFetchError)
      .then((res: any) => res.json())
      .then((result: any) => result)
      .catch((error: any) => {
        throw new Error(error);
      });
  }

  fetchProjects(serverBaseUrl: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return fetch(`${serverBaseUrl}/v1/projects`, {
      method: 'GET',
      headers,
      redirect: 'follow',
    })
      .then(handleFetchError)
      .then((res: any) => res.json())
      .then((result: LighthouseProjectType) => result)
      .catch((error: any) => {
        throw new Error(error);
      });
  }

  fetchProjectDetails(serverBaseUrl: string, buildToken: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return fetch(`${serverBaseUrl}/v1/projects/lookup`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ token: buildToken }),
      redirect: 'follow',
    })
      .then(handleFetchError)
      .then((res: any) => res.json())
      .then((result: LighthouseProjectType) => result)
      .catch((error: any) => {
        throw new Error(error);
      });
  }

  fetchProjectBuilds(
    serverBaseUrl: string,
    projectID: string,
    branch: string,
    limit: number,
  ) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return fetch(
      `${serverBaseUrl}/v1/projects/${projectID}/builds?branch=${branch}&limit=${limit}`,
      {
        method: 'GET',
        headers,
        redirect: 'follow',
      },
    )
      .then(handleFetchError)
      .then((res: any) => res.json())
      .then((result: LighthouseProjectType) => result)
      .catch((error: any) => {
        throw new Error(error);
      });
  }

  fetchProjectLHR(serverBaseUrl: string, projectID: string, buildID: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return fetch(
      `${serverBaseUrl}/v1/projects/${projectID}/builds/${buildID}/runs`,
      {
        method: 'GET',
        headers,
        redirect: 'follow',
      },
    )
      .then(handleFetchError)
      .then((res: any) => {
        if (!res.ok) {
          throw res;
        }
        return res;
      })
      .then((res: any) => res.json())
      .then((results: any) => {
        const scores: LighthouseScoreType[] = [];
        results.forEach((value: any) => {
          const lhr = JSON.parse(value.lhr);
          const data: any = {};
          Object.keys(lhr.categories).forEach((category: any) => {
            data[camelCase(category)] = lhr.categories[category].score;
          });
          scores.push(data);
        });
        return scores;
      })
      .catch((error: any) => {
        throw new Error(error);
      });
  }

  fetchProjectBranches(serverBaseUrl: string, projectID: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return fetch(`${serverBaseUrl}/v1/projects/${projectID}/branches`, {
      method: 'GET',
      headers,
      redirect: 'follow',
    })
      .then(handleFetchError)
      .then((res: any) => res.json())
      .then((result: LighthouseProjectType) => result)
      .catch((error: any) => {
        throw new Error(error);
      });
  }

  /**
   * function to create LH Project
   * @param {PropertyModel} $project: input project document
   * @returns {Object}: Mutated document as object
   */
  createLHProject(project: any) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const raw = JSON.stringify(project);

    return fetch(`${process.env.SERVER_BASE_URL}/v1/projects`, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    })
      .then((response: any) => response.json())
      .catch((error: Error) => {
        Logger.error(error);
      });
  }
}

export const lhci = LHCIHelper.lhciHelper();

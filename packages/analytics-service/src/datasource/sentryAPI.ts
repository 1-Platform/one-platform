import { HTTPDataSource } from 'apollo-datasource-http';
import { Pool } from 'undici';

import { CrashlyticOptionInput } from 'graph/analyticsConfig/types';
import {
  TSentryProject,
  ProjectKey,
  ProjectStatOptions,
  TSentryProjectStats,
  TSentryTeam,
} from './types';

export class SentryAPI extends HTTPDataSource {
  orgName: string;

  teamName: string;

  constructor(baseURL: string, token: string, orgName: string, teamName: string, pool: Pool) {
    // global client options
    super(baseURL, {
      pool,
      clientOptions: {
        bodyTimeout: 5000,
        headersTimeout: 2000,
      },
      requestOptions: {
        headers: {
          Authorization: token,
        },
      },
    });

    this.orgName = orgName;
    this.teamName = teamName;
  }

  async getTeams() {
    return this.get<TSentryTeam[]>(`/api/0/organizations/${this.orgName}/teams/`);
  }

  async getProjects(team: string) {
    return this.get<TSentryProject[]>(`/api/0/teams/${this.orgName}/${team}/projects/`);
  }

  async getAProject(projectId: string) {
    return this.get<TSentryProject>(`/api/0/projects/${this.orgName}/${projectId}/`);
  }

  async getAProjectClientKeys(projectId: string) {
    return this.get<ProjectKey[]>(`/api/0/projects/${this.orgName}/${projectId}/keys/`);
  }

  async createAProject(name: string, platform: string) {
    return this.post<TSentryProject>(`/api/0/teams/${this.orgName}/${this.teamName}/projects/`, {
      body: {
        name,
        platform,
      },
    });
  }

  async getProjectStats(projectId: string, options: CrashlyticOptionInput) {
    return this.get<TSentryProjectStats>(`/api/0/organizations/${this.orgName}/stats_v2/`, {
      query: { ...(options as ProjectStatOptions), category: 'error', project: projectId },
    });
  }
}

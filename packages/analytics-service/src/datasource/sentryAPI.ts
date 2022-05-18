import { HTTPDataSource } from 'apollo-datasource-http';
import { Pool } from 'undici';

import { CrashlyticOptionInput } from 'graph/analyticsConfig/types';
import { Project, ProjectKey, ProjectStatOptions, ProjectStats, Team } from './types';

export class SentryAPI extends HTTPDataSource {
  orgName: string;

  constructor(baseURL: string, token: string, orgName: string, pool: Pool) {
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
  }

  async getTeams() {
    return this.get<Team[]>(`/api/0/organizations/${this.orgName}/teams/`);
  }

  async getProjects(team: string) {
    return this.get<Project[]>(`/api/0/teams/${this.orgName}/${team}/projects/`);
  }

  async getAProject(projectId: string) {
    return this.get<Project>(`/api/0/projects/${this.orgName}/${projectId}/`);
  }

  async getAProjectClientKeys(projectId: string) {
    return this.get<ProjectKey[]>(`/api/0/projects/${this.orgName}/${projectId}/keys/`);
  }

  async createAProject(name: string, platform: string) {
    try {
      // checking app exist or not
      await this.getAProject(name);
      return undefined;
    } catch (error) {
      return this.post(`/api/0/teams/${this.orgName}/one-platform/projects/`, {
        body: {
          name,
          platform,
        },
      });
    }
  }

  async getProjectStats(projectId: string, options: CrashlyticOptionInput) {
    return this.get<ProjectStats>(`/api/0/organizations/${this.orgName}/stats_v2/`, {
      query: { ...(options as ProjectStatOptions), category: 'error', project: projectId },
    });
  }
}

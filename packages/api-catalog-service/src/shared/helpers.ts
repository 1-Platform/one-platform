/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable class-methods-use-this */
import { createHash } from 'crypto';
import { createTransport } from 'nodemailer';
import uniq from 'lodash/uniq';
import { NamespaceModel } from '../namespace/schema';
import { API_GATEWAY, GATEWAY_AUTH_TOKEN, SMTP_HOST } from '../setup/env';

const fetch = require('node-fetch');

(global as any).Headers = fetch.Headers;

class APICatalogHelper {
  private static APICatalogHelperInstance: APICatalogHelper;

  public static apiCatalogHelper() {
    if (!APICatalogHelper.APICatalogHelperInstance) {
      APICatalogHelper.APICatalogHelperInstance = new APICatalogHelper();
    }
    return APICatalogHelper.APICatalogHelperInstance;
  }

  public buildUserQuery(userIds: string[]) {
    let queryParams = '';
    userIds.forEach((userId: string) => {
      queryParams = queryParams.concat(`
            rhatUUID_${(userId as string).replace(
    /-/g,
    '',
  )}:getUsersBy(rhatUUID:"${userId}") {
                  cn
                  mail
                  uid
                  rhatUUID
                  rhatJobTitle
                }
            `);
    });
    return `query GetUserBy {
            ${queryParams}
        }`;
  }

  public async fetchUserProfile(query: string): Promise<Record<string, UserType>> {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Authorization', `${GATEWAY_AUTH_TOKEN}`);
    const body = JSON.stringify({
      query,
      variables: null,
    });
    return fetch(API_GATEWAY, {
      method: 'POST',
      headers,
      body,
    })
      .then((response: any) => response.json())
      .then((result: any) => Object.keys(result.data).reduce((userRecord, key) => {
        const user = result.data[key][0];
        return { ...userRecord, [user.rhatUUID]: user };
      }, {}))
      .catch((err: Error) => {
        throw err;
      });
  }

  private getAllUuidOfANamespaceDoc(namespaces:NamespaceModel[]) {
    const userIds: string[] = [];
    namespaces.forEach((namespace) => {
      if (namespace.createdBy) {
        userIds.push(namespace.createdBy as string);
      }
      if (namespace.updatedBy) {
        userIds.push(namespace.updatedBy as string);
      }
      namespace.owners.forEach(({ mid, group }) => {
        if (group === 'USER') {
          userIds.push(mid);
        }
      });
    });
    return uniq(userIds);
  }

  public async formatNamespaceDoc(namespaces: NamespaceModel[] = []) {
    if (namespaces.length === 0) return [];
    // Fetch user information associated with this records.
    const userIds: string[] = this.getAllUuidOfANamespaceDoc(namespaces);
    // Build a single user query for the namespace
    const userQuery = this.buildUserQuery(userIds);
    const userData = await this.fetchUserProfile(
      userQuery,
    );
    // Assign the parsed user information with the fields.
    return namespaces.map((namespace) => {
      const nsRecord = namespace.toObject({ virtuals: true });
      if (namespace.createdBy) {
        nsRecord.createdBy = userData[namespace?.createdBy as string];
      }
      if (namespace.updatedBy) {
        nsRecord.updatedBy = userData[namespace?.updatedBy as string];
      }
      nsRecord.owners = nsRecord.owners.map(({ mid, group }) => (group === 'USER'
        ? {
          group,
          user: userData[mid],
        }
        : { email: mid, group })) as any;
      return nsRecord;
    });
  }

  public introspectionQuery() {
    return `
            query IntrospectionQuery {
            __schema {
                queryType { name }
                mutationType { name }
                subscriptionType { name }
                types {
                ...FullType
                }
                directives {
                name
                description

                locations
                args {
                    ...InputValue
                }
                }
            }
            }
            fragment FullType on __Type {
            kind
            name
            description
            fields(includeDeprecated: true) {
                name
                description
                args {
                ...InputValue
                }
                type {
                ...TypeRef
                }
                isDeprecated
                deprecationReason
            }
            inputFields {
                ...InputValue
            }
            interfaces {
                ...TypeRef
            }
            enumValues(includeDeprecated: true) {
                name
                description
                isDeprecated
                deprecationReason
            }
            possibleTypes {
                ...TypeRef
            }
            }
            fragment InputValue on __InputValue {
            name
            description
            type { ...TypeRef }
            defaultValue
            }
            fragment TypeRef on __Type {
            kind
            name
            ofType {
                kind
                name
                ofType {
                kind
                name
                ofType {
                    kind
                    name
                    ofType {
                    kind
                    name
                    ofType {
                        kind
                        name
                        ofType {
                        kind
                        name
                        ofType {
                            kind
                            name
                        }
                        }
                    }
                    }
                }
                }
            }
            }`;
  }

  public async fetchSchema(
    category: ApiCategory,
    schemaEndpoint: string,
    apiHeaders: HeaderType[],
  ) {
    const headers = apiHeaders?.reduce(
      (obj, item) => Object.assign(obj, { [(item as any).key]: (item as any).value }),
      {},
    ) || {};
    return fetch(schemaEndpoint, {
      method: category === 'GRAPHQL' ? 'POST' : 'GET',
      headers,
      body:
        category === 'GRAPHQL'
          ? JSON.stringify({ query: this.introspectionQuery() })
          : null,
    })
      .then((response: any) => response.text())
      .catch((err: Error) => err);
  }

  public async manageApiHash(namespace: Omit<NamespaceType, 'owners'>) {
    let apiSchemaResult = await this.fetchSchema(
      namespace.category as ApiCategory,
      namespace.schemaEndpoint as string,
      namespace.headers as HeaderType[],
    );
    let parsedGQLSchema;
    if (namespace.category === 'GRAPHQL') {
      parsedGQLSchema = JSON.parse(apiSchemaResult);
      parsedGQLSchema.extensions
        ? (apiSchemaResult = delete parsedGQLSchema.extensions)
        : null;
    }
    return (
      (await createHash('sha256').update(apiSchemaResult).digest('base64'))
      || null
    );
  }

  public emailConfig() {
    return createTransport({
      host: SMTP_HOST,
      port: 587,
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
      logger: true,
      debug: false,
    });
  }
}
export default APICatalogHelper.apiCatalogHelper();

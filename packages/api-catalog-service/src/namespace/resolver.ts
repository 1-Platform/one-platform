import { uniq } from 'lodash';
import { apiCatalogHelper } from '../shared/helpers';
import { Namespace } from './schema';
export const NamespaceResolver = {
    Query: {
        listNamespaces ( root: any, { limit, offset }: ListNamespacesArgs, ctx: any ) {
            return Namespace.find().limit(limit || 10).skip(offset || 0).exec().then( async ( namespaces: NamespaceType[] ) => {
                if ( namespaces.length ) {
                    // Fetch user information associated with this records.
                    let userIds: string[] = [];
                    namespaces.map( ( namespace: NamespaceType ) => {
                        if ( namespace.createdBy ) {
                            userIds.push( namespace.createdBy );
                        }
                        if ( namespace.updatedBy ) {
                            userIds.push( namespace.updatedBy );
                        }
                    } );
                    userIds = uniq( userIds );
                    // Build a single user query for the namespace
                    const userQuery = await apiCatalogHelper.buildUserQuery( userIds );
                    const userData: UserType[] = await apiCatalogHelper.fetchUserProfile( userQuery );

                    // Assign the parsed user information with the fields.
                    return namespaces.map( namespace => {
                        if ( namespace.createdBy ) {
                            namespace.createdBy = userData.find( user => user?.rhatUUID === namespace?.createdBy )?.mail;
                        }
                        if ( namespace.updatedBy ) {
                            namespace.updatedBy = userData.find( user => user?.rhatUUID === namespace?.updatedBy )?.mail;
                        }
                        return namespace;
                    } );
                } else {
                    return namespaces;
                }
            } );
        },
        getNamespaceById ( root: any, { id }: GetNamespaceByIdArgs, ctx: any ) {
            let userIds: string[] = [];
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                return Namespace.findById(id)
                    .exec()
                    .then(async (namespace) => {
                        if (namespace) {
                            if (namespace.createdBy) {
                                userIds.push(namespace.createdBy);
                            }
                            if (namespace.updatedBy) {
                                userIds.push(namespace.updatedBy);
                            }
                            userIds = uniq(userIds);
                            // Build a single user query for the namespace
                            const userQuery = await apiCatalogHelper.buildUserQuery(userIds);
                            const userData: UserType[] =
                      await apiCatalogHelper.fetchUserProfile(userQuery);
                            // Assign the parsed user information with the fields.
                            if (namespace.createdBy) {
                                namespace.createdBy = userData.find((user) => user?.rhatUUID === namespace?.createdBy)?.mail;
                            }
                            if (namespace.updatedBy) {
                                namespace.updatedBy = userData.find((user) => user?.rhatUUID === namespace?.updatedBy)?.mail;
                            }
                            return namespace;
                        } else {
                            return null;
                        }
                    });
            } else {
                throw new Error('Please provide valid id');
            }
        },
        async fetchAPISchema ( root: any, { category, schemaEndpoint, headers }: FetchApiSchemaArgs, ctx: any ) {
            return await apiCatalogHelper.fetchSchema(category as ApiCategory, schemaEndpoint as string, headers as HeaderType[]);
        },
    },
    Mutation: {
        async createNamespace ( root: any, { payload }: CreateNamespaceArgs, ctx: any ) {
            ( !payload?.createdOn ) ? payload.createdOn = new Date() : null;
            (payload as any).hash = await apiCatalogHelper.manageApiHash(payload);

            return await new Namespace( payload ).save();
        },
        updateNamespace ( root: any, { id, payload }: UpdateNamespaceArgs, ctx: any ) {
            ( !payload?.updatedOn ) ? payload.updatedOn = new Date() : null;
            return Namespace.findByIdAndUpdate( id, payload, {
                new: true
            } ).exec();
        },
        deleteNamespace ( root: any, { id }: DeleteNamespaceArgs, ctx: any ) {
            return Namespace.findByIdAndRemove( id ).exec();
        },
        async addNamespaceSubscriber ( root: any, { id, payload }: AddNamespaceSubscriberArgs, ctx: any ) {
            return await Namespace.findOneAndUpdate(
                {
                    'id': id,
                },
                {
                    '$push': {
                        'subscribers': payload
                    }
                },
                { upsert: true, new: true }
            ).exec();
        },
        async removeNamespaceSubscriber ( root: any, { id, payload }: RemoveNamespaceSubscriberArgs, ctx: any ) {
            return await Namespace.findOneAndUpdate(
                {
                    'id': id,
                },
                {
                    '$pull': {
                        'subscribers': payload
                    }
                },
                { multi: true }
            ).exec();
        }
    }
};

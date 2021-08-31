import { Namespace } from './schema';
import { apiCatalogHelper } from '../shared/helpers';
import { uniq } from 'lodash';

export const NamespaceResolver = {
    Query: {
        listNamespaces ( root: any, args: any, ctx: any ) {
            return Namespace.find().lean().then( async ( namespaces: NamespaceType[] ) => {
                if ( namespaces.length ) {
                    // Fetch user information associated with this records.
                    let userIds: string[] = [];
                    namespaces.map( ( namespace: NamespaceType ) => {
                        namespace.createdBy ?
                            userIds.push( namespace.createdBy )
                            : null;
                        namespace.updatedBy ?
                            userIds.push( namespace.updatedBy )
                            : null;
                    } );
                    userIds = uniq( userIds );
                    // Build a single user query for the namespace
                    const userQuery = await apiCatalogHelper.buildUserQuery( userIds );
                    const userData: UserType[] = await apiCatalogHelper.fetchUserProfile( userQuery );

                    // Assign the parsed user information with the fields.
                    return namespaces.map( namespace => {
                        namespace.createdBy ?
                            namespace.createdBy = userData.filter( user => user.rhatUUID === namespace.createdBy )[ 0 ].mail
                            : null;
                        namespace.updatedBy ?
                            namespace.updatedBy = userData.filter( user => user.rhatUUID === namespace.updatedBy )[ 0 ].mail
                            : null;
                        return namespace;
                    } );
                } else {
                    return namespaces;
                }
            } );
        },
        getNamespaceById ( root: any, { _id }: GetNamespaceByIdArgs, ctx: any ) {
            let userIds: string[] = [];
            return Namespace.find( { '_id': _id } ).lean().then( async ( namespace: NamespaceType[] ) => {
                if ( namespace.length ) {
                    ( namespace[ 0 ].createdBy ) ?
                        userIds.push( namespace[ 0 ].createdBy )
                        : null;
                    ( namespace[ 0 ].updatedBy ) ?
                        userIds.push( namespace[ 0 ].updatedBy )
                        : null;
                    userIds = uniq( userIds );

                    // Build a single user query for the namespace
                    const userQuery = await apiCatalogHelper.buildUserQuery( userIds );
                    const userData: UserType[] = await apiCatalogHelper.fetchUserProfile( userQuery );
                    // Assign the parsed user information with the fields.
                    ( namespace[ 0 ].createdBy ) ?
                        namespace[ 0 ].createdBy = userData.filter( user =>
                            user.rhatUUID === namespace[ 0 ].createdBy )[ 0 ].mail
                        : null;
                    ( namespace[ 0 ].updatedBy ) ?
                        namespace[ 0 ].updatedBy = userData.filter( user =>
                            user.rhatUUID === namespace[ 0 ].updatedBy )[ 0 ].mail
                        : null;
                    return namespace[ 0 ];
                } else {
                    return namespace;
                }
            } );
        }
    },
    Mutation: {
        async createNamespace ( root: any, { payload }: CreateNamespaceArgs, ctx: any ) {
            const promises: any = [];
            ( !payload?.createdOn ) ? payload.createdOn = new Date() : null;
            const hashPromise = new Promise( async ( resolve, reject ) => {
                await payload.environments.forEach( async ( environment: any, index: number ) => {
                    environment.hash = await apiCatalogHelper.manageApiHash( payload.category, environment );
                    if ( payload.environments.length === index + 1 ) {
                        resolve( environment );
                    }
                } );
            } ).catch( ( err: Error ) => {
                throw err;
            } );
            promises.push( hashPromise );
            return await Promise.all( promises ).then( () => new Namespace( payload ).save() );
        },
        updateNamespace ( root: any, { _id, payload }: UpdateNamespaceArgs, ctx: any ) {
            ( !payload?.updatedOn ) ? payload.updatedOn = new Date() : null;
            return Namespace.findByIdAndUpdate( _id, payload, {
                new: true
            } ).exec();
        },
        deleteNamespace ( root: any, { _id }: DeleteNamespaceArgs, ctx: any ) {
            return Namespace.findByIdAndRemove( _id ).exec();
        },
    }
};

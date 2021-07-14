/* GraphQL Resolver implementation */

import { IResolvers } from 'apollo-server';
import { Microservices } from '.';
import uniqueIdFromPath from '../../utils/unique-id-from-path';

export default <IResolvers<Microservice, IAppsContext>>{
  Query: {
    services: () => {
      return Microservices.find().exec();
    },
    myServices: ( parent, args, { rhatUUID } ) => {
      if ( !rhatUUID ) {
        throw new Error( 'Cannot fetch myServices. Unauthenticated request.' );
      }
      return Microservices.find( { ownerId: rhatUUID } ).exec();
    },
    findServices: ( parent, { selectors }, ctx ) => {
      return Microservices.find( { ...selectors, _id: selectors.id } ).exec();
    },
    service: ( parent, { id, serviceId }, { rhatUUID } ) => {
      if ( !id && !serviceId ) {
        throw new Error( 'Please provide atleast one argument for id or serviceId' );
      }
      return Microservices.findOne( { serviceId, _id: id } ).exec();
    },
  },
  Mutation: {
    createService: ( parent, { service }, { rhatUUID } ) => {
      if ( !rhatUUID ) {
        throw new Error( 'Cannot create new service. Unauthenticated request.' );
      }
      return new Microservices( {
        ...service,
        ownerId: rhatUUID,
        createdBy: rhatUUID,
        updatedBy: rhatUUID,
      } ).save();
    },
    updateService: ( parent, { id, service }, { rhatUUID } ) => {
      if ( !Microservices.isAuthorized( id, rhatUUID ) ) {
        throw new Error( 'User not authorized to update the service' );
      }
      if ( service.name ) {
        service.serviceId = uniqueIdFromPath( service.name );
      }
      return Microservices.findByIdAndUpdate( id, {
        ...service,
        updatedBy: rhatUUID,
        updatedOn: new Date(),
      }, { new: true } ).exec();
    },
    deleteService: ( parent, { id }, { rhatUUID } ) => {
      if ( !Microservices.isAuthorized( id, rhatUUID ) ) {
        throw new Error( 'User not authorized to delete the service' );
      }
      return Microservices.findByIdAndRemove( id ).exec();
    },
  },
}

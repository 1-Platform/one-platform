/* GraphQL Resolver implementation */

import { IResolvers } from '@graphql-tools/utils';
import Microservices from './model';
import uniqueIdFromPath from '../../utils/unique-id-from-path';

const MicroservicesResolver = <IResolvers<Microservice, IAppsContext>>{
  Query: {
    services: () => Microservices.find().exec(),
    myServices: (parent, args, { rhatUUID }) => {
      if (!rhatUUID) {
        throw new Error('Cannot fetch myServices. Unauthenticated request.');
      }
      return Microservices.find({ ownerId: rhatUUID }).exec();
    },
    findServices: (parent, { selectors }) => {
      const serviceSelector = selectors;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const _id = serviceSelector.id;
      delete serviceSelector.id;

      return Microservices.find({
        ...serviceSelector,
        ...(_id && { _id }),
      }).exec();
    },
    service: (parent, { id, serviceId }) => {
      if (!id && !serviceId) {
        throw new Error('Please provide atleast one argument for id or serviceId');
      }
      return Microservices.findOne({
        ...(serviceId && { serviceId }),
        ...(id && { _id: id }),
      }).exec();
    },
  },
  Mutation: {
    createService: (parent, { service }, { rhatUUID }) => {
      if (!rhatUUID) {
        throw new Error('Cannot create new service. Unauthenticated request.');
      }
      return new Microservices({
        ...service,
        ownerId: rhatUUID,
        createdBy: rhatUUID,
        updatedBy: rhatUUID,
      }).save();
    },
    updateService: (parent, { id, service }, { rhatUUID }) => {
      const serviceInfo = service;
      if (!Microservices.isAuthorized(id, rhatUUID)) {
        throw new Error('User not authorized to update the service');
      }
      if (serviceInfo.name) {
        serviceInfo.serviceId = uniqueIdFromPath(service.name);
      }
      return Microservices.findByIdAndUpdate(id, {
        ...service,
        updatedBy: rhatUUID,
        updatedOn: new Date(),
      }, { new: true }).exec();
    },
    deleteService: (parent, { id }, { rhatUUID }) => {
      if (!Microservices.isAuthorized(id, rhatUUID)) {
        throw new Error('User not authorized to delete the service');
      }
      return Microservices.findByIdAndRemove(id).exec();
    },
  },
};

export { MicroservicesResolver as default };

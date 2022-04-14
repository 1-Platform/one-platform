/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { agenda } from '../scripts';
import { SearchMaps } from './schema';

export const SearchMapResolver = {
  Query: {
    listSearchMap(root: any, args: any, ctx: any) {
      return SearchMaps
        .find()
        .exec();
    },
    getSearchMap ( root: any, { id }: any, ctx: any ) {
      return SearchMaps
        .findById( id )
        .exec();
    },
    getSearchMapsByApp ( root: any, { appId }: any, ctx: any ) {
      return SearchMaps
        .find( { appId } )
        .exec();
    },
    async triggerSearchMap(root: any, args: any, ctx: any) {
      await agenda.now('indexing script', {});
      return 'Indexing Search Maps has been triggered.';
    },
  },
  Mutation: {
    async createSearchMap(root: any, { searchMap }: any, { uuid }: any) {
      return new SearchMaps({
        ...searchMap,
        createdBy: uuid,
        updatedBy: uuid
      })
        .save();
    },
    updateSearchMap(root: any, { appId, searchMap }: any, { uuid }: any) {
      return SearchMaps
        .findOneAndUpdate({ appId }, {
          ...searchMap,
          updatedBy: uuid,
          updatedOn: new Date()
        }, { new: true })
        .exec();
    },
    deleteSearchMap(root: any, { id }: any, ctx: any) {
      return SearchMaps
        .findByIdAndRemove(id)
        .exec();
    },
  },
};

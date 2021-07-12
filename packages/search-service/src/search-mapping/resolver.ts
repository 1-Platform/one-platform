import { SearchMap } from './schema';
import { SearchMapCron } from './cron';

export const SearchMapResolver = {
    Query: {
        listSearchMap(root: any, args: any, ctx: any) {
            return SearchMap.find().exec().then((res: SearchMapMode[]) => res);
        },
        getSearchMap(root: any, args: any, ctx: any) {
            return SearchMap.findById(args._id).exec();
        },
        triggerSearchMap ( root: any, args: any, ctx: any ) {
            const searchMapCron = new SearchMapCron();
            searchMapCron.searchMapTrigger();
            return 'Indexing Search Maps has been triggered.';
        }
    },
    Mutation: {
        async createSearchMap(root: any, args: any, ctx: any) {
            const data = new SearchMap(args.input);
            return data.save();
        },
        updateSearchMap(root: any, args: any, ctx: any) {
            return SearchMap.findByIdAndUpdate( args.input._id, args.input, { new: true } ).exec();
        },
        deleteSearchMap(root: any, args: any, ctx: any) {
            return SearchMap.findByIdAndRemove(args._id)
                .then((response: any) => response)
                .catch((error: Error) => error);
        },
    }
}

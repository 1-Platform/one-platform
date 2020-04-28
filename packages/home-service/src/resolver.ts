import { Home } from './schema';

export const HomeResolver = {
  Query: {
    // queries
    listHomeType(root: any, args: any, ctx: any) {
      return Home.find()
      .then(response => response)
      .catch(err => err);
    },
    getHomeType(root: any, args: any, ctx: any) {
      // fetch the id from args.id
      return Home.findById(args._id)
      .then(response => response)
      .catch(err => err);
    },
    getHomeTypeBy(root: any, args: any, ctx: any) {
      return Home.find(args.input).exec();
    }
  },
  Mutation: {
    // mutations
    createHomeType(root: any, args: any, ctx: any) {
      const data = new Home(args.input);
      return data.save()
        .then(response => response)
        .catch(err => err);
    },
    updateHomeType(root: any, args: any, ctx: any) {
      return Home.findById(args.input._id)
      .then(response => {
        return Object.assign(response, args.input)
          .save()
          .then((user: any) => user);
      })
      .catch((err: any) => err);
    },
    deleteHomeType(root: any, args: any, ctx: any) {
      return Home.findByIdAndRemove(args._id)
      .then(response => response)
      .catch(err => err);
    },

  }
};

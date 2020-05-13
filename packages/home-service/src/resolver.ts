import { Home } from './schema';

export const HomeResolver = {
  Query: {
    // fetch all homeType
    listHomeType(root: any, args: any, ctx: any) {
      return Home.find()
      .then(response => response)
      .catch(err => err);
    },
    // fetch the id from args.id
    getHomeType(root: any, args: any, ctx: any) {
      return Home.findById(args._id)
      .then(response => response)
      .catch(err => err);
    },
    getHomeTypeBy(root: any, args: any, ctx: any) {
      return Home.find(args.input).exec();
    }
  },
  Mutation: {
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
          .then((data: any) => data);
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

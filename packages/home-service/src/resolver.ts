import { Home } from './schema';
import { HomeHelper } from './helpers';

export const HomeResolver = {
  Query: {
    listHomeType(root: any, args: any, ctx: any) {
      return Home.find().lean()
      .then( (response) => {
        const query = `${HomeHelper.buildGqlQuery(response)}`;
        return HomeHelper.getUserDetails(query).then((userDetails: any) => {
          return HomeHelper.stitchHomeType(response, userDetails.data);
        });
      })
      .catch(err => err);
    },
    getHomeType(root: any, args: any, ctx: any) {
      return Home.findById(args._id).lean()
      .then( (response: HomeType | null) => {
        if (response !== null) {
          const query = `${HomeHelper.buildGqlQuery([response])}`;
          return HomeHelper.getUserDetails(query).then((userDetails: any) => {
            return HomeHelper.stitchHomeType([response], userDetails.data);
          });
        }
      })
      .catch(err => err);
    },
    getHomeTypeBy(root: any, args: any, ctx: any) {
      return Home.find(args.input).lean()
      .then( (response) => {
        const builtQuery = `${HomeHelper.buildGqlQuery(response)}`;
        return HomeHelper.getUserDetails(builtQuery).then((userDetails: any) => {
          return HomeHelper.stitchHomeType(response, userDetails.data);
        });
      })
      .catch(err => err);
    },
    getHomeTypeByUser(root: any, args: any, ctx: any) {
      return Home.find({'owners': {'$in': [ args.rhuuid ]}}).lean()
      .then( (response) => {
        const builtQuery = `${HomeHelper.buildGqlQuery(response)}`;
        return HomeHelper.getUserDetails(builtQuery).then((userDetails: any) => {
          return HomeHelper.stitchHomeType(response, userDetails.data);
        });
      })
      .catch(err => err);
    }
  },
  Mutation: {
    createHomeType(root: any, args: any, ctx: any) {
      const data = new Home(args.input);
      return data.save()
        .then((response: HomeType | null | any) => {
          if (response !== null) {
            const resp =  { ...{ ...response }._doc };
            const query = `${HomeHelper.buildGqlQuery([resp])}`;
            return HomeHelper.getUserDetails(query).then((userDetails: any) => {
              return HomeHelper.stitchHomeType([resp], userDetails.data);
            });
          }
        })
        .catch(err => err);
    },
    updateHomeType(root: any, args: any, ctx: any) {
      return Home.findById(args.input._id)
      .then((response: HomeType | null) => {
        return Object.assign(response, args.input)
          .save()
          .then((data: any) => {
            const resp = { ...{ ...data }._doc };
            if (resp !== null) {
              const query = `${HomeHelper.buildGqlQuery([resp])}`;
              return HomeHelper.getUserDetails(query).then((userDetails: any) => {
                return HomeHelper.stitchHomeType([resp], userDetails.data);
              });
            }
          });
      })
      .catch((err: any) => err);
    },
    deleteHomeType(root: any, args: any, ctx: any) {
      return Home.findByIdAndRemove(args._id)
      .then((response: HomeType | null | any) => {
        if (response !== null) {
          const resp =  { ...{ ...response }._doc };
          const query = `${HomeHelper.buildGqlQuery([resp])}`;
          return HomeHelper.getUserDetails(query).then((userDetails: any) => {
            return HomeHelper.stitchHomeType([resp], userDetails.data);
          });
        }
      })
      .catch(err => err);
    },
  }
};

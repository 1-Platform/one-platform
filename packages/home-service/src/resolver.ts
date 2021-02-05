import { Home } from './schema';
import { HomeHelper } from './helpers';

export const HomeResolver = {
  Query: {
    listHomeType(root: any, args: any, ctx: any) {
      return Home.find().lean()
      .then( (response: HomeType[]) => {
        const query = `${HomeHelper.buildGqlQuery(response)}`;
        return HomeHelper.getUserDetails(query).then((userDetails: any) => {
          return HomeHelper.stitchHomeType(response, userDetails.data);
        });
      })
      .catch((err: Error) => err);
    },
    getHomeType(root: any, args: any, ctx: any) {
      return Home.findById(args._id).lean()
      .then( (response: HomeType | null) => {
        if (response !== null) {
          const query = `${HomeHelper.buildGqlQuery([response])}`;
          return HomeHelper.getUserDetails(query).then((userDetails: any) => {
            return HomeHelper.stitchHomeType([response], userDetails.data)[0];
          });
        }
      })
      .catch((err: Error) => err);
    },
    getHomeTypeBy(root: any, args: any, ctx: any) {
      return Home.find(args.input).lean()
      .then( (response: HomeType[]) => {
        const builtQuery = `${HomeHelper.buildGqlQuery(response)}`;
        return HomeHelper.getUserDetails(builtQuery).then((userDetails: any) => {
          return HomeHelper.stitchHomeType(response, userDetails.data);
        });
      })
      .catch((err: Error) => err);
    },
    getHomeTypeByUser(root: any, args: any, ctx: any) {
      return Home.find({'owners': {'$in': [ args.rhuuid ]}}).lean()
      .then( (response: HomeType[]) => {
        const builtQuery = `${HomeHelper.buildGqlQuery(response)}`;
        return HomeHelper.getUserDetails(builtQuery).then((userDetails: any) => {
          return HomeHelper.stitchHomeType(response, userDetails.data);
        });
      })
      .catch((err: Error) => err);
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
              const homeResponse = HomeHelper.stitchHomeType([resp], userDetails.data)[0];
              if(homeResponse.active) {
                const documentInput = HomeHelper.formatSearchInput(homeResponse);
                const indexInput = {
                  'input': {
                    'dataSource': 'oneportal',
                    'documents': documentInput
                  }
                };
                HomeHelper.manageSearchIndex(indexInput,'index');
              }
              return homeResponse;
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
                const homeResponse = HomeHelper.stitchHomeType([resp], userDetails.data)[0];
                if(homeResponse.active) {
                  const searchInput = HomeHelper.formatSearchInput(homeResponse);
                  HomeHelper.manageSearchIndex(searchInput,'index');
                }
                return homeResponse;
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
          let id = {
            'id': args._id
          };
          HomeHelper.manageSearchIndex(id, 'delete');
          const resp =  { ...{ ...response }._doc };
          const query = `${HomeHelper.buildGqlQuery([resp])}`;
          return HomeHelper.getUserDetails(query).then((userDetails: any) => {
            return HomeHelper.stitchHomeType([resp], userDetails.data)[0];
          });
        }
      })
      .catch(err => err);
    },
    updateHomeIndex(root: any, args: any, ctx: any) {
      let documentInput:any=[];
      return Home.find().lean()
      .then( (response: any) => {
        const query = `${HomeHelper.buildGqlQuery(response)}`;
        return HomeHelper.getUserDetails(query).then(async (userDetails: any) => {
          const homeResponse: Array<any> = HomeHelper.stitchHomeType(response, userDetails.data);
          await homeResponse.map(async (response: any) => {
            if(response.active) {
              documentInput.push(HomeHelper.formatSearchInput(response));
            }
          });
          const indexInput = {
            'input': {
              'dataSource': 'oneportal',
              'documents': documentInput
            }
          };
          const indexResponse = await HomeHelper.manageSearchIndex(indexInput ,'index');
          return {
            status: indexResponse
          };
        });
      })
      .catch((err: Error) => err);
    }
  }
};

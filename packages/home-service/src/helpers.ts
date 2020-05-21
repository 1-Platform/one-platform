// write your helper functions here
const fetch = require('node-fetch');

class HomeAPIHelper {
    userFragment = `
                fragment user on UserType {
                    _id
                    name
                    title
                    uid
                    rhatUUID
                    memberOf
                    isActive
                    timestamp {
                        createdAt
                        createdBy {
                                kerberosID
                                name
                        }
                    }
                }`;


    buildGqlQuery(response: HomeType[]) {
        return response.map((resp: HomeType) => {
            let query = [];
            if (resp.owners.length) {
                query = (resp.owners as any).map((rhatUUID: string) => `${resp.name}_owner_${rhatUUID.replace(/-/g, '')}:getUsersBy(rhatUUID: "${rhatUUID}"){ ...user }`);
            }
            if (!!resp.createdBy) {
                query.push(`${resp.name}_createdBy:getUsersBy(rhatUUID: "${resp.createdBy}"){ ...user }`);
            }
            if (!!resp.updatedBy) {
                query.push(`${resp.name}_updatedBy:getUsersBy(rhatUUID: "${resp.updatedBy}"){ ...user }`);
            }
            return query;
        });
    }

    getUserDetails(query: string) {
        const body = `
            ${this.userFragment}
            query {
                ${query}
        }`;
        return fetch(`${process.env.USER_SERVICE_SERVICE_API}`, {
            method: 'post',
            body: JSON.stringify({query: body}),
            headers: { 'Content-Type': 'application/json' },
        })
        .then((res: any) => res.json());
    }
    stitchHomeType(response: HomeType[] | any, userDetails: any) {
        return response.map((resp: HomeType) => {
            Object.assign(resp.owners, ...Object.entries(userDetails)
            .reduce((accumulator: any, user) => {
                if (user[0].startsWith(`${resp.name}_owner_`)) {
                    accumulator.push(user[1]);
                }
                return accumulator;
            }, []));
            return resp;
        });
    }
}

export const HomeHelper = new HomeAPIHelper();

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
            apiRole
            createdBy
            createdOn
            updatedBy
            updatedOn
        }`;
        /**
         * Builds the graphql query according to the owners array in the homeType
         * @param response homeType(array of homeType) database response
         */
        buildGqlQuery(response: HomeType[]) {
        return response.map((resp: any) => {
            let query = [];
            if (resp.owners.length) {
                query = resp.owners.map((rhatUUID: string) => `owner_${resp._id}_${rhatUUID.replace(/-/g, '')}:getUsersBy(rhatUUID: "${rhatUUID}"){ ...user }`);
            }
            if (!!resp.createdBy) {
                query.push(`createdBy_${resp._id}:getUsersBy(rhatUUID: "${resp.createdBy}"){ ...user }`);
            }
            if (!!resp.updatedBy) {
                query.push(`updatedBy_${resp._id}:getUsersBy(rhatUUID: "${resp.updatedBy}"){ ...user }`);
            }
            return query;
        });
    }
    /**
     * Fetches user details from the user-service using node-fetch
     * @param query gql query which would fetch information from the user-service
     */
    getUserDetails(query: string) {
        const body = `
            ${this.userFragment}
            query {
                ${query}
        }`;
        return fetch(`http://${process.env.USER_SERVICE_SERVICE_HOST}:${process.env.USER_SERVICE_SERVICE_PORT}/graphql`, {
            method: 'post',
            body: JSON.stringify({query: body}),
            headers: { 'Content-Type': 'application/json' },
        })
        .then((res: any) => res.json());
    }
    /**
     * Replaces the owners array(owners: string[]) with populated userType (owners: userType[])
     * @param response Database response
     * @param userDetails UserDetails which are fetched from user-service
     */
    stitchHomeType(response: HomeType[] | any, userDetails: any) {
        return response.map((data: any) => {
            if (userDetails[`createdBy_${data._id}`]) {
                const resp = { ...{ ...data }._doc, createdBy: userDetails[`createdBy_${data._id}`][0] };
                if (resp.owners.length) {
                    Object.assign(
                        resp.owners,
                        Object.entries(userDetails).reduce((accumulator: any, user: any) => {
                            if (user[0].startsWith(`owner_${resp._id}`)) {
                                accumulator.push(...user[1]);
                            }
                            return accumulator;
                        }, [])
                    );
                }
                if (userDetails[`updatedBy_${data._id}`]) {
                    return { ...resp, updatedBy: userDetails[`updatedBy_${data._id}`][0] };
                }
                return resp;
            }
            return data;
        });
    }
}

export const HomeHelper = new HomeAPIHelper();

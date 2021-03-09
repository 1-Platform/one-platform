import { SearchMap } from "./schema";
import { TemplateHelper } from "./helpers";
import { SearchIndexHelper } from "../search-config/helpers";
import * as _ from "lodash";

export class SearchMapCron {
    public async searchMapTrigger () {
        let mappedList: any = [];
        let statusList: any = [];
        const searchMapList = await SearchMap.find();
        const apps = await TemplateHelper.listApps();
        console.log( apps );
        await searchMapList.map( async ( searchMap: any, configIndex: any ) => {
            console.log( searchMap.apiConfig );
            // const apiResponse = await TemplateHelper.fetchApi( searchMap.apiConfig.authorizationHeader, searchMap.apiConfig.apiUrl, searchMap.apiConfig.query, searchMap.apiConfig.param || null, searchMap.apiConfig.mode );
            // await apiResponse[Object.keys(apiResponse)[0]].map(async (data: any) => {
            //     let mappedField: any = {};
            //     await searchMap.fields.map(async (field: any, index: any) => {
            //         mappedField[field.to] = await TemplateHelper.objectStringMapper(data, field.from);
            //         if ( searchMap.fields.length === index + 1 ) {
            //             mappedField.tags = apps.filter( ( app: any ) => app.id === searchMap.appId )[ 0 ].name;;
            //             mappedField.contentType = apps.filter( ( app: any ) => app.id === searchMap.appId )[0].name;
            //             mappedField.icon = searchMap.preferences.iconUrl;
            //             searchMap.preferences.searchUrlParams.map((urlParam: any) => {
            //                 searchMap.preferences.searchUrlTemplate = searchMap.preferences.searchUrlTemplate.replace(urlParam, data[urlParam]);
            //             });
            //             mappedField.uri = process.env.CLIENT_URL + searchMap.preferences.searchUrlTemplate;
            //             console.log( mappedField );
            //             mappedList.push(mappedField);
            //         }
            //     });
            // });
            // const searchInput = {
            //     dataSource: "oneportal",
            //     documents: _.uniqBy(mappedList, 'id')
            // };
            // const response = await SearchIndexHelper.index(searchInput);
            // statusList.push({ status: response.status });
            // if (searchMapList.length === configIndex + 1) {
            //     console.info('Index Status -', statusList);
            // }
        });
    }
}

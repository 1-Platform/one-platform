import { SearchMap } from "./schema";
import { TemplateHelper } from "./helpers";
import { SearchIndexHelper } from "../search-config/helpers";
import * as _ from "lodash";

export class SearchMapCron {
    public async searchMapTrigger() {
        let mappedList: any = [];
        let statusList: any = [];
        const searchConfigList = await SearchMap.find();
        await searchConfigList.map(async (searchConfig: any, configIndex: any) => {
            const apiResponse = await TemplateHelper.fetchApi(searchConfig.apiConfig.authorizationHeader, searchConfig.apiConfig.apiUrl, searchConfig.apiConfig.body, searchConfig.apiConfig.param || null, searchConfig.apiConfig.mode);
            await apiResponse[Object.keys(apiResponse)[0]].map(async (data: any) => {
                let mappedField: any = {};
                await searchConfig.fields.map(async (field: any, index: any) => {
                    mappedField[field.to] = await TemplateHelper.objectStringMapper(data, field.from);
                    if (searchConfig.fields.length === index + 1) {
                        mappedField.tags = searchConfig.name;
                        mappedField.contentType = data.name;
                        mappedField.icon = searchConfig.preferences.iconUrl;
                        searchConfig.preferences.searchUrlParams.map((urlParam: any) => {
                            searchConfig.preferences.searchUrlTemplate = searchConfig.preferences.searchUrlTemplate.replace(urlParam, data[urlParam]);
                        });
                        mappedField.uri = process.env.CLIENT_URL + searchConfig.preferences.searchUrlTemplate;
                        mappedList.push(mappedField);
                    }
                });
            });
            const searchInput = {
                dataSource: "oneportal",
                documents: _.uniqBy(mappedList, 'id')
            };
            const response = await SearchIndexHelper.index(searchInput);
            statusList.push({ status: response.status });
            if (searchConfigList.length === configIndex + 1) {
                console.info('Index Status -', statusList);
            }
        });
    }
}

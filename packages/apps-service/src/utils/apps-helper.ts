const fetch = require( 'node-fetch' );
(global as any).Headers = fetch.Headers;

class AppsHelper {
    private static FeedbackHelperInstance: AppsHelper;
    constructor () { }
    public static AppsHelper () {
        if ( !AppsHelper.FeedbackHelperInstance ) {
            AppsHelper.FeedbackHelperInstance = new AppsHelper();
        }
        return AppsHelper.FeedbackHelperInstance;
    }
    public formatSearchInput ( data: any ) {
        return {
            'input': {
                'dataSource': process.env.SEARCH_DATA_SOURCE,
                'documents': {
                    'id': data._id,
                    'title': data.name,
                    'abstract': data.description,
                    'description': data.description,
                    'icon': ``,
                    'uri': data.path,
                    'tags': `Apps`,
                    'contentType': 'Apps',
                    'createdBy': data?.createdBy || '',
                    'createdDate': data?.createdOn || new Date(),
                    'lastModifiedBy': data?.updatedBy || '',
                    'lastModifiedDate': data?.updatedOn || new Date()
                }
            }
        }
    }
    // Helper function to create/update/delete data to feedback microservice
    public manageSearchIndex ( data: any, mode: string ) {
        let query: string = `
                mutation ManageIndex($input: SearchInput, $mode: String!) {
                    manageIndex(input: $input, mode: $mode) {
                        status
                    }
                }
            `;
        let headers = new Headers();
        headers.append( `Authorization`, `${ process.env.GATEWAY_AUTH_TOKEN }` );
        headers.append( `Content-Type`, `application/json` );
        return fetch( `${ process.env.API_GATEWAY }`, {
            method: `POST`,
            headers,
            body: JSON.stringify({
                query: query,
                variables: {
                    input: mode === 'index'? data?.input : data,
                    mode
                }
            } ),
        } ).then( ( response: any ) => {
            return response.json();
        } )
            .then( ( result: any ) => {
                const succesStatusCodes = [ 200, 204 ];
                if ( succesStatusCodes.includes(result.data?.manageIndex?.status) ) {
                    console.info('Sucessfully completed the index updation.')
                } else if ( !succesStatusCodes.includes(result.data?.manageIndex?.status) ) {
                    console.info('Error in index updation.');
                }
            })
            .catch((err: Error) => {
                throw err;
            });
    }
}

export default AppsHelper.AppsHelper();

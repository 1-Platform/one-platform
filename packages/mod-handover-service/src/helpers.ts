const jsforce = require( 'jsforce' );

// SFDC Integration
class SFDCApiHelper {
    private static SFDCHelperInstance: SFDCApiHelper;
    sfdcUser: string | any = process.env.SFDC_USER;
    sfdcPass: string | any = process.env.SFDC_PASS;
    constructor () { }
    public static getApiInstance () {
        if ( !SFDCApiHelper.SFDCHelperInstance ) {
            SFDCApiHelper.SFDCHelperInstance = new SFDCApiHelper();
        }
        return SFDCApiHelper.SFDCHelperInstance;
    }

    // Helper function to fetch case from SFDC
    public getSFDCCase ( case_no: string ) {
        return new Promise( ( resolve, reject ) => {
            const conn = new jsforce.Connection();
            conn.login( this.sfdcUser, this.sfdcPass, ( _err: any, _res: any ) => {
                if ( _err ) {
                    return console.error( _err );
                }
                conn.query( `select Account.Name from Case where CaseNumber = '${ case_no }'`, ( err: any, res: any ) => {
                    if ( err ) {
                        return console.error( err );
                    }
                    if ( res.done ) {
                        const records = res.records;
                        if ( records.length ) {
                            const result = { account_name: records[ 0 ].Account.Name };
                            resolve( result );
                        } else {
                            const result = { account_name: '' };
                            resolve( result );
                        }
                    }
                } );
            } );
        } );
    }
}

export const SFDCAPIHelper = SFDCApiHelper.getApiInstance();

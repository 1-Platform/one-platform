const { writeFile } = require( 'fs' );
const { argv } = require( 'yargs' );
// read environment variables from .env file
require( 'dotenv' ).config();
// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction
    ? `./src/environments/environment.prod.ts`
    : `./src/environments/environment.ts`;
const environmentFileContent = `
export const environment = {
   production: ${ isProduction },
   API_URL: '${ process.env.API_URL }',
   WS_URL: '${ process.env.WS_URL }',
   LH_SERVER_URL: '${process.env.LH_SERVER_URL}'
};
`;
// write the content to the respective file
writeFile( targetPath, environmentFileContent, function ( err ) {
    if ( err ) {
        console.log( err );
    }
    console.log( `Wrote variables to ${ targetPath }` );
} );

import fs from 'fs';
import { stitchSchemas } from '@graphql-tools/stitch';
import remoteSchema from './remote-schema';

export const microservices = loadConfig();

export async function stitchedSchemas() {
  const schemas = await Promise.all( microservices.map( service => {
    console.log( `Loading microservice: ${ service.name }` );
    return remoteSchema( service )
      .catch( err => {
        console.error( '[Error]:', err.message );
        console.log( '... Skipping:', service.name );
        return '';
      } );
  } ) );

  if ( schemas.every( schema => !schema ) ) {
    console.error( '[Error]: Could not load any microservice.' );
    process.exit( 1 );
  }

  return stitchSchemas( { schemas } );
}

function loadConfig (): [ { name: string, uri: string, subscriptionsUri: string, } ] {
  console.log( 'Loading the config from', (process.env.CONFIG_PATH || 'config.json') );
  const configPath = process.env.CONFIG_PATH || 'config.json';
  try {
    const configFile = fs.readFileSync( configPath );
    return JSON.parse( configFile.toString() );
  } catch ( err ) {
    console.log( '[ERROR]: Could not load the microservices config' );
    throw err;
  }
}

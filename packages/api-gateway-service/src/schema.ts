import fs from 'fs';
import { stitchSchemas } from 'graphql-tools';
import { getRemoteSchema } from './helpers';

export async function stitchedSchemas () {
  const microservices = loadConfig();
  const schemas = await Promise
    .all( microservices
      .map( service => {
        console.log( `Loading microservice: ${ service.name }` );
        return getRemoteSchema( service )
          .catch( err => {
            console.log( '[Error]:', err.message );
            console.log( '... Gateway will continue without:', service.name );
            return '';
          } );
      } ) );
  return stitchSchemas( { schemas } );
}

function loadConfig (): [{ name: string, uri: string, subscriptionsUri: string, }] {
  const configPath = process.env.CONFIG || 'config.json';
  try {
    const configFile = fs.readFileSync( configPath );
    return JSON.parse( configFile.toString() );
  } catch ( err ) {
    console.log( '[ERROR]: Could not load the microservices config' );
    throw err;
  }
}

console.log( 'Copying .env.example to .env for the services: Started' );
const fs = require( 'fs' );
const path = require( 'path' );
const { COPYFILE_EXCL } = fs.constants;
const dir = 'packages';
fs.readdir( dir, (err, list) => {
    const services = list.filter( folder => folder.endsWith( '-service' ) );
    services.forEach(service => {
        const pathToEnv = dir + '/' + service + '/';
        fs.copyFile( pathToEnv + '.env.example', pathToEnv + '.env', COPYFILE_EXCL, ( error ) => error );
        path.dirname( service );
    })
} );
console.log( 'Copying .env.example to .env for the services: Completed' );

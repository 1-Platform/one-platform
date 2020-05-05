const fetch = require( 'node-fetch' );

/* This consists of the list of microservices which needs to be part of the gateway */
export const serviceList = [
  { name: 'User Group', url: process.env.USER_GROUP }
];

/* Function to fetch the public key from internal IDP */
export const publicKey = () => {
  return fetch( process.env.INTERNAL_IDP )
    .then( ( res: any ) => res.json() )
    .then( ( res: any ) => {
      return `-----BEGIN PUBLIC KEY-----
${ res.public_key }
-----END PUBLIC KEY-----`;
    } );
};

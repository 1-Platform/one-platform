const fetch = require( 'node-fetch' );

/* This consists of the list of microservices which needs to be part of the gateway */
export const serviceList = [
  { name: 'User Service', url: `http://${ process.env.USER_SERVICE_SERVICE_HOST }:8080/graphql` },
  { name: 'Home Service', url: `http://${ process.env.HOME_SERVICE_SERVICE_HOST }:8080/graphql` },
  { name: 'Feedback Service', url: `http://${ process.env.FEEDBACK_SERVICE_SERVICE_HOST }:8080/graphql` },
  { name: 'Notification Service', url: `http://${ process.env.NOTIFICATION_SERVICE_SERVICE_HOST }:8080/graphql` },
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

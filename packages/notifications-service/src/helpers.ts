import fetch from 'node-fetch';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { createTransport } from 'nodemailer';
import * as Twig from 'twig';

const redisOptions: Redis.RedisOptions = {
  host: process.env.REDIS_SERVICE_HOST,
  port: Number.parseInt( process.env.REDIS_SERVICE_PORT || '6379', 10 ),
  retryStrategy: ( times: any ) => {
    return Math.min( times * 50, 2000 );
  }
};
export const pubsub = new RedisPubSub( {
  publisher: new Redis( redisOptions ),
  subscriber: new Redis( redisOptions ),
} );

/* Nodemailer Setup */
export const nodemailer = createTransport( {
  host: 'smtp.corp.redhat.com',
  port: 587,
  secure: false,
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  },
  logger: false,
  transactionLog: false,
  debug: false, // include SMTP traffic in the logs
  disableFileAccess: true,
  disableUrlAccess: true,
} );

export const GqlHelper = {
  fragments: {
    homeType: /* GraphQL */`fragment homeType on HomeType {
      _id name link icon entityType active owners { uid name }
    }`,
  },
  execSimpleQuery ( { queries, fragments }: GraphQLQueryInput ) {
    const body = {
      query: /* GraphQL */`
        ${ fragments?.join( '\n' ) }
        query GetNotificationSources {
          ${queries.join( '\n' ) }
        }`,
    };
    return fetch(
      `http://${ process.env.HOME_SERVICE_SERVICE_HOST }:${ process.env.HOME_SERVICE_SERVICE_PORT }/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify( body )
      }
    )
      .then( (res: any) => res.json() )
      .catch( (err: any) => {
        throw new Error( '[UserServiceApiError]: ' + err );
      } );
  }
};

export function validateAndFormatRecipients ( recipients: Array<EmailRecipient | string> ) {
  const EmailRegExp = RegExp( /\S+@\S+/ );

  return recipients.reduce( ( acc, recipient ) => {
    if ( typeof recipient === 'string' && EmailRegExp.test(recipient) ) {
      acc.push( recipient );
    } else {
      const { preferredName, email } = recipient as EmailRecipient;
      if ( EmailRegExp.test( email ) ) {
        if ( preferredName ) {
          acc.push( `"${ preferredName }" <${ email }>` );
        } else {
          acc.push( email );
        }
      }
    }
    return acc;
  }, [] as string[] );
}

export function findTwigVariables ( template: Twig.Template ): Set<string> {
  return ( <any> template ).tokens
    .reduce( ( acc: Set<string>, token: any ) => {
      if ( token.type === 'output' ) {
        token?.stack?.reduce( ( acc2: any, expr: any ) => {
          if ( expr.type === 'Twig.expression.type.variable' ) {
            acc.add( expr.value );
          }
        }, [] );
      }
      return acc;
    }, new Set() );
}

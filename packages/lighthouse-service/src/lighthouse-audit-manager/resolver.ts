import { spawn } from 'child_process';
import { pubsub, lhci } from "../helpers";

export const LighthouseAuditResolver = {
  Query: {
    async fetchScore ( root: any, args: any, ctx: any ) {
      return await lhci.fetchProjectLHR( args.projectID, args.buildID );
    },
    async fetchProjectDetails ( root: any, args: any, ctx: any ) {
      return await lhci.fetchProjectDetails( args.buildToken );
    }
  },
  Mutation: {
    async auditWebsite ( root: any, args: any, ctx: any ) {
      const profile = await lhci.fetchProfileFavicon ( args.property.authorEmail );
      const LHCI_BUILD_CONTEXT__COMMIT_MESSAGE = `${ args.property.commitMessage || `Benchmark Commit by ${ args.property.authorName }` }`;
      const LHCI_BUILD_CONTEXT__AUTHOR = `${ args.property.authorName } <${ args.property.authorEmail }>`;
      const LHCI_BUILD_CONTEXT__CURRENT_HASH = new Date().getTime().toString( 16 ).split( '' ).reverse().join( '' );

      const lhciScript = spawn( ` cd /tmp && mkdir ${ LHCI_BUILD_CONTEXT__CURRENT_HASH } && cd ${ LHCI_BUILD_CONTEXT__CURRENT_HASH } && export LHCI_BUILD_CONTEXT__CURRENT_HASH=${ LHCI_BUILD_CONTEXT__CURRENT_HASH } &&
      export LHCI_BUILD_CONTEXT__COMMIT_TIME="${ new Date().toString() }" &&
      export LHCI_BUILD_CONTEXT__CURRENT_BRANCH="${ args.property.currentBranch || process.env.CURRENT_BRANCH }" &&
      export LHCI_BUILD_CONTEXT__COMMIT_MESSAGE="${ LHCI_BUILD_CONTEXT__COMMIT_MESSAGE }" &&
      export LHCI_BUILD_CONTEXT__AUTHOR="${ LHCI_BUILD_CONTEXT__AUTHOR }" &&
      export LHCI_BUILD_CONTEXT__AVATAR_URL="${ profile.avatar_url }" &&
      lhci autorun --collect.settings.chromeFlags='--no-sandbox --ignore-certificate-errors' --collect.url=${ args.property.sites } --upload.serverBaseUrl=${ args.property.serverBaseUrl || process.env.SERVER_BASE_URL } --assert.preset=${ args.property.preset || `lighthouse:recommended` } --upload.token=${ args.property.buildToken }`, {
        shell: true
      } );
      lhciScript.stdout.on( 'data', async data => {
        console.log( data.toString() );
        pubsub.publish( 'AUTORUN', { autorun: LHCI_BUILD_CONTEXT__CURRENT_HASH + data.toString() } ).catch( err => console.error( err ) );
      } );

      lhciScript.stderr.on( 'data', ( data ) => {
        console.error( data.toString() );
        pubsub.publish( 'AUTORUN', { autorun: LHCI_BUILD_CONTEXT__CURRENT_HASH + data.toString() } ).catch( err => console.error( err ) );
      } );

      lhciScript.on( 'exit', ( code ) => {
        console.log( `Process exited with code ${ code }` );
        pubsub.publish( 'AUTORUN', { autorun: LHCI_BUILD_CONTEXT__CURRENT_HASH + code } ).catch( err => console.error( err ) );
      } );
      return LHCI_BUILD_CONTEXT__CURRENT_HASH;
    },
  },
  Subscription: {
    autorun: {
      subscribe: () => pubsub.asyncIterator( "AUTORUN" )
    }
  }
};

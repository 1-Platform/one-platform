import { SFDCAPIHelper } from './helpers';
import * as pg from 'pg';
import moment from 'moment';

const nodemailer = require( 'nodemailer' );

const modConnectionString = `postgres://${ process.env.DB_USER }:${ process.env.DB_PASSWORD }@${ process.env.DB_HOST }/${ process.env.MOD_DB_NAME }`;

const modSfdcConnectionString = `postgres://${ process.env.DB_USER }:${ process.env.DB_PASSWORD }@${ process.env.DB_HOST }/${ process.env.SFDC_DB_NAME }`;

export const ModHandoverResolver = {
  Query: {
    listAllHandovers ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modConnectionString );
      Client.connect();
      return Client.query( `select * from handovers;` )
        .then( res => {
          Client.end();
          return res.rows;
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    listHandover ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modConnectionString );
      Client.connect();
      return Client.query( `select * from handovers where handover_id=${ args.handover_id };` )
        .then( res => {
          Client.end();
          return res.rows[ 0 ];
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    listHandoverByDate ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modConnectionString );
      Client.connect();
      return Client.query( `SELECT * FROM handovers where date >= '" ${ args.date } " 00:00:00' and date <= '" ${ args.date } " 23:59:59';` )
        .then( res => {
          Client.end();
          return res.rows;
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    listCasesByHandover ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modConnectionString );
      Client.connect();
      return Client.query( `select * from cases where handover_id=${ args.handover_id } order by case_type;` )
        .then( res => {
          Client.end();
          return res.rows;
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    listUnassignedCount ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modSfdcConnectionString );
      Client.connect();
      return Client.query( `select count(casenumber) from cases_shift_tracker where internal_status__c='Unassigned' and id = (select max(id) from cases_shift_tracker);` )
        .then( res => {
          Client.end();
          return res.rows[ 0 ];
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    listAllPlatformCount ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modSfdcConnectionString );
      Client.connect();
      return Client.query( `SELECT (SELECT Count(casenumber)
                          FROM   cases_shift_tracker
                          WHERE  fts__c = true
                                AND id = (SELECT Max(id)
                                          FROM   cases_shift_tracker))     AS fts_count,
                        (SELECT Count(casenumber)
                          FROM   cases_shift_tracker
                          WHERE  customer_escalation__c = true
                                AND id = (SELECT Max(id)
                                          FROM   cases_shift_tracker))     AS rme_count,
                        (SELECT Count(casenumber)
                          FROM   cases_shift_tracker
                          WHERE  internal_status__c = 'Unassigned'
                                AND id = (SELECT Max(id)
                                          FROM   cases_shift_tracker))     AS unassigned_count,
                        (SELECT Count(casenumber)
                          FROM   cases_shift_tracker
                          WHERE  fts__c = true
                                AND status = 'Waiting on Red Hat'
                                AND id = (SELECT Max(id)
                                          FROM   cases_shift_tracker))     AS worh_count,
                        (SELECT Count(casenumber)
                          FROM   cases_shift_tracker
                          WHERE  internal_status__c = 'Unassigned'
                                AND status = 'Waiting on Red Hat'
                                AND tactical__c = true
                                AND id = (SELECT Max(id)
                                          FROM   cases_shift_tracker) - 1) AS irt_count,
                        (SELECT Count(casenumber)
                          FROM   cases_shift_tracker
                          WHERE  fts__c = true
                                AND status = 'Waiting on Customer'
                                AND id = (SELECT Max(id)
                                          FROM   cases_shift_tracker))     AS woc_count,
                        (SELECT Count(casenumber)
                          FROM   cases_shift_tracker
                          WHERE  internal_status__c = 'Unassigned'
                                AND severity__c < 3
                                AND id = (SELECT Max(id)
                                          FROM   cases_shift_tracker))     AS
                        unassigned_ncq_count,
                        (SELECT Count(casenumber)
                          FROM   cases_shift_tracker
                          WHERE  sbt__c < 0
                                AND severity__c < 2
                                AND id = (SELECT Max(id)
                                          FROM   cases_shift_tracker))     AS
                        urgent_sev_1_breaches_count,
                        (SELECT time
                          FROM   cases_shift_tracker
                          WHERE  id = (SELECT Max(id)
                                      FROM   cases_shift_tracker)
                          LIMIT  1)                                         AS time
                  FROM   cases_shift_tracker
                  LIMIT  1;`)
        .then( res => {
          Client.end();
          return res.rows[ 0 ];
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    listAllETCount ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modSfdcConnectionString );
      Client.connect();
      return Client.query( `SELECT (SELECT Count(casenumber)
                          FROM   et_cases_shift_tracker
                          WHERE  fts__c = true
                                AND id = (SELECT Max(id)
                                          FROM   et_cases_shift_tracker))     AS fts_count,
                        (SELECT Count(casenumber)
                          FROM   et_cases_shift_tracker
                          WHERE  customer_escalation__c = true
                                AND id = (SELECT Max(id)
                                          FROM   et_cases_shift_tracker))     AS rme_count,
                        (SELECT Count(casenumber)
                          FROM   et_cases_shift_tracker
                          WHERE  internal_status__c = 'Unassigned'
                                AND id = (SELECT Max(id)
                                          FROM   et_cases_shift_tracker))     AS unassigned_count
                        ,
                        (SELECT Count(casenumber)
                          FROM   et_cases_shift_tracker
                          WHERE  fts__c = true
                                AND status = 'Waiting on Red Hat'
                                AND id = (SELECT Max(id)
                                          FROM   et_cases_shift_tracker))     AS worh_count,
                        (SELECT Count(casenumber)
                          FROM   et_cases_shift_tracker
                          WHERE  internal_status__c = 'Unassigned'
                                AND status = 'Waiting on Red Hat'
                                AND tactical__c = true
                                AND id = (SELECT Max(id)
                                          FROM   et_cases_shift_tracker) - 1) AS irt_count,
                        (SELECT Count(casenumber)
                          FROM   et_cases_shift_tracker
                          WHERE  fts__c = true
                                AND status = 'Waiting on Customer'
                                AND id = (SELECT Max(id)
                                          FROM   et_cases_shift_tracker))     AS woc_count,
                        (SELECT Count(casenumber)
                          FROM   et_cases_shift_tracker
                          WHERE  internal_status__c = 'Unassigned'
                                AND severity__c < 3
                                AND id = (SELECT Max(id)
                                          FROM   et_cases_shift_tracker))     AS
                        unassigned_ncq_count,
                        (SELECT Count(casenumber)
                          FROM   et_cases_shift_tracker
                          WHERE  sbt__c < 0
                                AND severity__c < 2
                                AND id = (SELECT Max(id)
                                          FROM   et_cases_shift_tracker))     AS
                        urgent_sev_1_breaches_count,
                        (SELECT time
                          FROM   et_cases_shift_tracker
                          WHERE  id = (SELECT Max(id)
                                      FROM   et_cases_shift_tracker)
                          LIMIT  1)                                            AS time
                  FROM   et_cases_shift_tracker
                  LIMIT  1; `)
        .then( res => {
          Client.end();
          return res.rows[ 0 ];
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    listAllAPSCount ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modSfdcConnectionString );
      Client.connect();
      return Client.query( `SELECT (SELECT Count(casenumber)
                            FROM   aps_cases_shift_tracker
                            WHERE  fts__c = true
                                  AND id = (SELECT Max(id)
                                            FROM   aps_cases_shift_tracker))     AS fts_count,
                          (SELECT Count(casenumber)
                            FROM   aps_cases_shift_tracker
                            WHERE  customer_escalation__c = true
                                  AND id = (SELECT Max(id)
                                            FROM   aps_cases_shift_tracker))     AS rme_count,
                          (SELECT Count(casenumber)
                            FROM   aps_cases_shift_tracker
                            WHERE  internal_status__c = 'Unassigned'
                                  AND id = (SELECT Max(id)
                                            FROM   aps_cases_shift_tracker))     AS
                          unassigned_count,
                          (SELECT Count(casenumber)
                            FROM   aps_cases_shift_tracker
                            WHERE  fts__c = true
                                  AND status = 'Waiting on Red Hat'
                                  AND id = (SELECT Max(id)
                                            FROM   aps_cases_shift_tracker))     AS worh_count,
                          (SELECT Count(casenumber)
                            FROM   aps_cases_shift_tracker
                            WHERE  internal_status__c = 'Unassigned'
                                  AND status = 'Waiting on Red Hat'
                                  AND tactical__c = true
                                  AND id = (SELECT Max(id)
                                            FROM   aps_cases_shift_tracker) - 1) AS irt_count,
                          (SELECT Count(casenumber)
                            FROM   aps_cases_shift_tracker
                            WHERE  fts__c = true
                                  AND status = 'Waiting on Customer'
                                  AND id = (SELECT Max(id)
                                            FROM   aps_cases_shift_tracker))     AS woc_count,
                          (SELECT Count(casenumber)
                            FROM   aps_cases_shift_tracker
                            WHERE  internal_status__c = 'Unassigned'
                                  AND severity__c < 3
                                  AND id = (SELECT Max(id)
                                            FROM   aps_cases_shift_tracker))     AS
                          unassigned_ncq_count,
                          (SELECT Count(casenumber)
                            FROM   aps_cases_shift_tracker
                            WHERE  sbt__c < 0
                                  AND severity__c < 2
                                  AND id = (SELECT Max(id)
                                            FROM   aps_cases_shift_tracker))     AS
                          urgent_sev_1_breaches_count,
                          (SELECT time
                            FROM   aps_cases_shift_tracker
                            WHERE  id = (SELECT Max(id)
                                        FROM   aps_cases_shift_tracker)
                            LIMIT  1)                                             AS time
                    FROM   aps_cases_shift_tracker
                    LIMIT  1; `)
        .then( res => {
          Client.end();
          return res.rows[ 0 ];
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    listCaseSBRs ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modSfdcConnectionString );
      Client.connect();
      return Client.query( `SELECT distinct sbr_group__c FROM cases_shift_tracker WHERE casenumber = '${ args.casenumber }';` )
        .then( res => {
          Client.end();
          if ( res.rows.length ) {
            return res.rows;
          } else {
            return null;
          }
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    listTotalHandoverCount ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modConnectionString );
      Client.connect();
      return Client.query( `select count(*) from handovers where handover_id::text LIKE '${ moment().year() }%';` )
        .then( res => {
          Client.end();
          return res.rows[ 0 ];
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    listSFDCCase ( root: any, args: any, ctx: any ) {
      return SFDCAPIHelper.getSFDCCase( args.casenumber );
    },
  },
  Mutation: {
    createHandover ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modConnectionString );

      function createNewHandover ( cols: any ) {
        // Setup static beginning of query
        const query = [ 'INSERT into handovers ' ];
        query.push( '(' );

        // Create another array storing each set command
        // and assigning a number value for parameterized query
        let set: any = [];
        Object.keys( cols ).forEach( function ( key, i ) {
          set.push( key );
        } );

        query.push( set.join( ', ' ) );

        query.push( ') VALUES (' );

        set = [];
        const colsArr: any = [];
        Object.keys( cols ).forEach( function ( key, i ) {
          set.push( '$' + ( i + 1 ) );
          colsArr.push( cols[ key ] );
        } );

        query.push( set.join( ', ' ) );

        // Add the WHERE statement to look up by id
        query.push( ');' );

        // Create a complete query string
        const completeQuery = query.join( ' ' );

        const queryObject = {
          'columns': colsArr,
          'query': completeQuery
        };

        // Return a complete query object
        return queryObject;
      }
      // Setup the query
      const queryObj = createNewHandover( args.input );

      const queryText = queryObj.query;
      const queryCols = queryObj.columns;
      Client.connect();
      return Client.query( queryText, queryCols )
        .then( res => {
          Client.end();
          return args.input;
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    updateHandover ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modConnectionString );
      function updateHandoverByID ( handover_id: any, cols: any ) {
        // Setup static beginning of query
        const query = [ 'UPDATE handovers ' ];
        query.push( 'SET' );
        // Create another array storing each set command and assigning a number value for parameterized query
        const set: any = [];
        const colsArr: any = [];
        Object.keys( cols ).forEach( function ( key, i ) {
          set.push( `"${ key }"=$${ i + 1 }` );
          colsArr.push( cols[ key ] );
        } );
        query.push( set.join( ', ' ) );

        // Add the WHERE statement to look up by id
        query.push( 'WHERE handover_id = ' + handover_id + ';' );

        // Create a complete query string
        const completeQuery = query.join( ' ' );

        const queryObject = {
          'columns': colsArr,
          'query': completeQuery
        };

        // Return a complete query object.
        return queryObject;
      }
      // Setup the query
      const queryObj = updateHandoverByID( args.input.handover_id, args.input );
      const queryText = queryObj.query;
      const queryCols = queryObj.columns;
      Client.connect();
      return Client.query( queryText, queryCols )
        .then( res => {
          Client.end();
          console.log( 'w', res );
          return args.input;
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    removeHandover ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modConnectionString );
      Client.connect();
      return Client.query( `DELETE FROM handovers where handover_id=${ args.handover_id };DELETE FROM cases where handover_id=${ args.handover_id };` )
        .then( res => {
          Client.end();
          return { 'handover_id': args.handover_id };
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    createCase ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modConnectionString );

      function createNewCase ( cols: any ) {
        // Setup static beginning of query
        const query = [ 'INSERT into cases ' ];
        query.push( '(' );

        // Create another array storing each set command
        // and assigning a number value for parameterized query
        let set: any = [];
        Object.keys( cols ).forEach( function ( key, i ) {
          set.push( key );
        } );

        query.push( set.join( ', ' ) );

        query.push( ') VALUES (' );

        set = [];
        const colsArr: any = [];
        Object.keys( cols ).forEach( function ( key, i ) {
          set.push( '$' + ( i + 1 ) );
          colsArr.push( cols[ key ] );
        } );

        query.push( set.join( ', ' ) );

        // Add the WHERE statement to look up by id
        query.push( ');' );

        // Create a complete query string
        const completeQuery = query.join( ' ' );

        const queryObject = {
          'columns': colsArr,
          'query': completeQuery
        };

        // Return a complete query object
        return queryObject;
      }
      // Setup the query
      const queryObj = createNewCase( args.input );

      const queryText = queryObj.query;
      const queryCols = queryObj.columns;
      Client.connect();
      return Client.query( queryText, queryCols )
        .then( res => {
          Client.end();
          return args.input;
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    updateCase ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modConnectionString );

      function updateHandoverByID ( case_id: any, cols: any ) {
        // Setup static beginning of query
        const query = [ 'UPDATE cases ' ];
        query.push( 'SET' );

        // Create another array storing each set command
        // and assigning a number value for parameterized query
        const set: any = [];
        const colsArr: any = [];
        Object.keys( cols ).forEach( function ( key, i ) {
          set.push( `"${ key }"=$${ i + 1 }` );
          colsArr.push( cols[ key ] );
        } );
        query.push( set.join( ', ' ) );

        // Add the WHERE statement to look up by id
        query.push( 'WHERE case_id = ' + case_id + ';' );

        // Create a complete query string
        const completeQuery = query.join( ' ' );

        const queryObject = {
          'columns': colsArr,
          'query': completeQuery
        };

        // Return a complete query object.
        return queryObject;
      }
      // Setup the query
      args.input.date = new Date( args.input.date );
      const queryObj = updateHandoverByID( args.input.case_id, args.input );

      const queryText = queryObj.query;
      const queryCols = queryObj.columns;
      Client.connect();
      return Client.query( queryText, queryCols )
        .then( res => {
          Client.end();
          return args.input;
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    removeCase ( root: any, args: any, ctx: any ) {
      const Client = new pg.Client( modConnectionString );
      Client.connect();
      return Client.query( `DELETE FROM cases where case_id=${ args.case_id };` )
        .then( res => {
          Client.end();
          return args.input;
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
    },
    sendHandoverEmail ( root: any, args: any, ctx: any ) {
      let subject: String;
      let content: String;
      if ( args.input.handover.handover_type === 'Application Platform Support' ) {
        subject = 'APS HandOver: ' + args.input.handover.handover_region + ' ' + new Date( args.input.handover.date ).toDateString();
      } else if ( args.input.handover.handover_type === 'Enterprise Cloud Support' ) {
        subject = 'ECS HandOver: ' + args.input.handover.handover_region + ' ' + new Date( args.input.handover.date ).toDateString();
      } else {
        subject = 'MoD HandOver: ' + args.input.handover.handover_region + ' ' + new Date( args.input.handover.date ).toDateString();
      }
      if ( args.input.handover.handover_type === 'Application Platform Support' ) {
        content =
          `
Handover Region:  ${args.input.handover.handover_region }

Handover Type: ${args.input.handover.handover_type }

Watchlist / Escalated Cases: ${args.input.handover.watchlist }

Proactive Cases: ${args.input.handover.proactive_cases }

Sensitive Accounts: ${args.input.handover.sensitive_accounts }

FTS:  ${args.input.handover.fts_count }  ACE: ${ args.input.handover.ace_count }  IRT: ${ args.input.handover.irt_count }  RME: ${ args.input.handover.rme_count }

WoRH: ${args.input.handover.rme_countWoRH }: ${ args.input.handover.worh_count }  WoC: ${ args.input.handover.woc_count } Unassigned: ${ args.input.handover.unassigned_count }

Unassigned NCQ (Sev. 1 & 2): ${args.input.handover.unassigned_ncq_sev_1_2_count } Urgent Sev. 1 Breaches: ${ args.input.handover.urgent_severity_1_breaches_count }

Handover Notes: ${args.input.handover.handover_notes }
           `;
      } else {
        content =
          `
Handover Region: ${args.input.handover.handover_region }

Handover Type: ${args.input.handover.handover_type }

FTS: ${ args.input.handover.fts_count }  ACE: ${ args.input.handover.ace_count }  IRT: ${ args.input.handover.irt_count }  RME: ${ args.input.handover.rme_count }

WoRH: ${args.input.handover.worh_count }

WoC: ${args.input.handover.woc_count }

Unassigned: ${args.input.handover.unassigned_count }

Unassigned NCQ (Sev. 1 & 2): ${args.input.handover.unassigned_ncq_sev_1_2_count }

Urgent Sev.1 Breaches: ${args.input.handover.urgent_severity_1_breaches_count }

Handover Notes: ${args.input.handover.handover_notes }

`;
      }

      args.input.cases.map( ( data: CaseType, index: number ) => {
        if ( index > 0 ) {
          if ( data.case_type === args.input.cases[ index - 1 ].case_type ) {
            content = content + `
Case No.:  ${data.case_no }
------------------------------`;
          } else {
            content = content + `
----------------------
${data.case_type }
----------------------

Case No.:  ${data.case_no }
----------------------------`;
          }
        } else {
          content = content + `
----------------------
${data.case_type } :
----------------------

Case No.:  ${data.case_no }
----------------------------`;
        }

        if ( data.account_name ) {
          content = content + `
Account Name: ${data.account_name }`;
        }

        if ( data.sbr_names ) {
          content = content + `
SBR(s): ${data.sbr_names }`;
        }

        if ( data.case_notes ) {
          content = content + `
Case Notes: ${data.case_notes }
`;
        }
      } );
      content = content + `
View Details: ${process.env.MOD_CLIENT }/mod-handovers/details/${ args.input.handover.handover_id }

Sent from One Portal: ${process.env.MOD_CLIENT }
`;
      nodemailer.transporter.sendMail( {
        from: `${ args.input.handover.manager_first_name } ${ args.input.handover.manager_last_name } <${ args.input.handover.manager_email }>`,
        to: args.input.emailRecipient.to,
        cc: args.input.emailRecipient.cc,
        subject: subject,
        text: content,
      }, ( err: Error, replay: any ) => {
        if ( err ) {
          console.log( err );
        } else {
          return { 'message': 'Email Sent' };
        }
      } );
    }
  }
};

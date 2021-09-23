import { cloneDeep, isEmpty, isString } from 'lodash';

interface IOptions {
  stringify?: boolean;
  fallback?: any;
}

/**
 * Get a nested value from an object/array using a string selector
 * @param data the input data object
 * @param prop the property selector
 * @param options additional options for response
 * @returns the object matching the selector, or null if nothing found
 */
export default function getValueBySelector ( data: any, prop: string, opts: IOptions = { stringify: false } ): any | null {
  const { stringify, fallback } = opts;
  const propsArray = prop
    .replace( /\[(\w+)\]/g, '.$1' )
    .replace( /^\./, '' )
    .split( '.' );

  let cursor = cloneDeep( data );
  try {
    const res = propsArray.reduce( ( value, propName ) => {
      if ( propName in cursor ) {
        cursor = cursor[ propName ];
        return cursor;
      }
      console.log( 'throwing...' );
      throw new Error( `${ propName } is not a property of ${typeof cursor}` );
    }, null);

    if ( !isEmpty(res) && !isString(res) && stringify ) {
      return JSON.stringify( res );
    }
    return res;
  } catch ( err ) {
    // tslint:disable-next-line: no-console
    console.debug( err );
    if (fallback) {
      return fallback;
    }
    throw err;
  }
}

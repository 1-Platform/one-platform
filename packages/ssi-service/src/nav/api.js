export function listApps () {
  return fetch( `${ process.env.APPS_BASE_API }/templates/assets/mocks/apps.json` )
    .then( res => res.json() );
};

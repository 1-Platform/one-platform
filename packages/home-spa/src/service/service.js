export const getHomeTypeBySPA = `
query HomePageQuery {
  apps {
    id
    applicationType
    name
    icon
    isActive
    path
  }
}`;

export const getContactUsTeamDetails = `
query ContactUsQuery{
  group (cn:"one-portal-devel") {
    members {
      cn
      rhatJobTitle
    }
  }
}
`;

function handleError ( response ) {
   if (!response.ok) {
     throw Error(response.statusText);
   }
   return response;
}

export function getData(query) {
  const fetchOptions = {
    method: 'post',
    headers: {
      Authorization: `Bearer ${window.OpAuthHelper?.jwtToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  };
  return fetch( process.env.API_URL, fetchOptions )
    .then( handleError )
    .then( ( res ) => res.json() )
    .catch( ( err ) => { console.error( err ); } );
}

export const addApp = (appData) => {
  const fetchOptions = {
    method: 'post',
    headers: {
      Authorization: `Bearer ${window.OpAuthHelper?.jwtToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: 'mutation QuickDeploy($app: CreateAppInput!){ createApp(app: $app) { id name path } }',
      variables: {
        app: {
          name: appData.name,
          path: appData.path,
          description: appData.description,
          isActive: true,
          applicationType: 'HOSTED',
        }
      }
    }),
  };
  return fetch(process.env.API_URL, fetchOptions)
    .then( handleError )
    .then((res) => res.json());
};

export function deploySPA(formData) {
  const fetchOptions = {
    method: 'post',
    headers: {
      Authorization: `apikey ${process.env.SPASHIP_API_KEY}`,
    },
    body: formData,
  };
  return fetch(process.env.SPASHIP_API_URL, fetchOptions)
    .then( handleError )
    .then((res) => res.json());
}

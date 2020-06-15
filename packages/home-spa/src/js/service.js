const listHomeType = `
query {
  listHomeType {
      _id
      name
      description
      link
      icon
      entityType
      colorScheme
      videoUrl
      }
  }`;

const fetchOptions = {
  method: "post",
  headers: {
    "Content-Type": "application/json",
    "Authorization": window.OpAuthHelper?.jwtToken ? 'Bearer ' + window.OpAuthHelper.jwtToken : '',
  },
  body: JSON.stringify({
    query: listHomeType
  })
};


export const getData = () => {
  return fetch(process.env.API_URL, fetchOptions)
  .then(res => res.json());
};
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
      active
      }
  }`;

export function getData() {
  const fetchOptions = {
    method: "post",
    headers: {
      Authorization: `Bearer ${ window.OpAuthHelper?.jwtToken }`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: listHomeType
    })
  };
  return fetch(process.env.API_URL, fetchOptions)
    .then(res => res.json());
};

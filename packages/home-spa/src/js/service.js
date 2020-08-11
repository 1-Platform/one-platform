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

export const getData = (token) => {
  const fetchOptions = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      // @ts-ignore
      "Authorization": token,
    },
    body: JSON.stringify({
      query: listHomeType
    })
  };
  return fetch(process.env.API_URL, fetchOptions)
  .then(res => res.json());
};

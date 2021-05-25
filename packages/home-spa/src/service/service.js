const getHomeTypeBySPA = `
query HomePageQuery {
  getHomeTypeBy(input: {
    entityType: "spa"
  }) {
      _id
      name
      description
      link
      icon
      entityType
      colorScheme
      active
      applicationType
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
      query: getHomeTypeBySPA
    })
  };
  return fetch(process.env.API_URL, fetchOptions)
    .then(res => res.json());
};

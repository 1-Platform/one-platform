const getHomeTypeBySPA = `
query HomePageQuery {
  apps {
    id
    applicationType
    name
    icon
    isActive
    entityType
    path
  }
}`;

export function getData() {
  const fetchOptions = {
    method: 'post',
    headers: {
      Authorization: `Bearer ${ window.OpAuthHelper?.jwtToken }`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: getHomeTypeBySPA
    })
  };
  return fetch(process.env.API_URL, fetchOptions)
    .then(res => res.json());
}

export function deploySPA(formData) {
  const fetchOptions = {
    method: 'post',
    headers: {
      Authorization: '',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  }
  return fetch(process.env.DEPLOY_URL, fetchOptions)
    .then(res => res.json());
}

export const getData = () => {
  return fetch(process.env.API_URL).then(response => response.json());
};
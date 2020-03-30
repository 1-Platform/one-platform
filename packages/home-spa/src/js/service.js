import '@babel/polyfill';

export const getData = async () => {
  let response = await fetch(process.env.API_URL);
  let data = await response.json();
  return data;
};
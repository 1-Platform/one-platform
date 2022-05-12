export const isValidGraphqlSchema = (introspectionData: string): boolean => {
  try {
    JSON.parse(introspectionData);
    return true;
  } catch {
    return false;
  }
};

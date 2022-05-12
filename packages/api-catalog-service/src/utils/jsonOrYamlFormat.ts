import yaml from 'js-yaml';

export const jsonOrYamlFormat = (file: string): string => {
  try {
    JSON.parse(file);
    return 'json';
  } catch {
    try {
      yaml.load(file);
      return 'yaml';
    } catch (error) {
      throw Error('Invalid format');
    }
  }
};

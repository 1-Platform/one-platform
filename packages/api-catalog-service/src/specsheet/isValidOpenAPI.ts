import OpenApiDiff from 'openapi-diff';

export const isValidOpenAPI = async (openAPIspec: string): Promise<boolean> => {
  try {
    await OpenApiDiff.diffSpecs({
      sourceSpec: {
        content: openAPIspec,
        location: 'source.json',
        format: 'auto-detect' as any,
      },
      destinationSpec: {
        content: openAPIspec,
        location: 'destination.json',
        format: 'auto-detect' as any,
      },
    });

    return true;
  } catch (error) {
    return false;
  }
};

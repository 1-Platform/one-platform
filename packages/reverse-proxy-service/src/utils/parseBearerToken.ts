export function parseBearerToken(
  authorization: string | undefined
): string | undefined {
  if (!authorization) {
    return undefined;
  }
  const [authType, token] = authorization.split(' ');
  if (authType !== 'Bearer' || !token) {
    return undefined;
  }
  return token;
}

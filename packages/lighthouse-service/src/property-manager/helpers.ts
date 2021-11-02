import fetch, { Headers } from 'node-fetch';
import Logger from '../lib/logger';
import { PropertyModel } from './schema';

export const getUserProfile = async (
  rhUUID: string,
): Promise<UserProfileType> => {
  const userQuery = `query GetUsers{
      getUsersBy(rhatUUID:"${rhUUID}") {
          cn
          mail
          uid
          rhatUUID
        }
  }
    `;
  const headers = new Headers();
  const body = JSON.stringify({
    query: userQuery,
    variables: null,
  });
  headers.append('Authorization', `${process.env.GATEWAY_AUTH_TOKEN}`);
  headers.append('Content-Type', 'application/json');
  const user = await fetch(`${process.env.API_GATEWAY}`, {
    method: 'POST',
    headers,
    body,
  });
  const res = await user.json();
  return res.data.getUsersBy[0];
};

/**
 * This helper fn is used to convert mongoose doc to a mutable object
 * And replaced rhUUId created by field with user details
 * @param {PropertyModel} propertyDocument: input property document
 * @returns {Object}: Mutated document as object
 */
export const populateMongooseDocWithUser = async (
  propertyDocument: PropertyModel | null,
) => {
  const property = propertyDocument?.toObject({ virtuals: true });
  if (!property) return {};

  const user = await getUserProfile(property.createdBy as string);
  property.createdBy = user;
  property.updatedBy = user;
  return property;
};

/**
 * Helper function to create LH Project
 * @param {PropertyModel} $project: input project document
 * @returns {Object}: Mutated document as object
 */
export const createLHProject = (project: any) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(project);

  return fetch(`${process.env.SERVER_BASE_URL}/v1/projects`, {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  })
    .then((response: any) => response.json())
    .catch((error: Error) => {
      Logger.error(error);
    });
};

import fetch, { Headers } from 'node-fetch';
import { LHSpaConfigModel } from './schema';

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
  if (!res.ok) {
    throw new Error(res);
  }
  return res.data.getUsersBy[0];
};

/**
 * This helper fn is used to convert mongoose doc to a mutable object
 * And replaced rhUUId created by field with user details from user-group service
 * @param {LHSpaConfigModel} propertyDocument: input property document
 * @returns {Object}: Mutated document as object
 */
export const populateMongooseDocWithUser = async (
  lhSpaConfigDoc: LHSpaConfigModel,
) => {
  const doc = { ...lhSpaConfigDoc };
  /**
   * if the fetch fails inorder to not break the query returning an empty object
   */
  try {
    const user = await getUserProfile(lhSpaConfigDoc.createdBy as string);
    doc.createdBy = user;
    doc.updatedBy = user;
  } catch (error) {
    doc.createdBy = {};
    doc.updatedBy = {};
  }
  return doc;
};

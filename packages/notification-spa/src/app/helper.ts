import { UserMock } from './mocks/user.mock';

// This function will change after
export const getUserDetails = () => {
    return UserMock;
  };
export const UserProfile = getUserDetails();

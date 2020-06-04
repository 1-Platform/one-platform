const getUserDetails = () => {
  try {
    return (window as any).OpAuthHelper.getUserInfo();
  } catch (err) {
    console.error(err);
  }
};
export const UserProfile = getUserDetails();

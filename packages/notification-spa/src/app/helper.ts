const getUserDetails = () => {
  try {
    return window.OpAuthHelper?.getUserInfo();
  } catch (err) {
    console.error(err);
  }
};
export const UserProfile = getUserDetails();

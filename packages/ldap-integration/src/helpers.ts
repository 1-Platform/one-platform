import { createClient } from 'ldapjs';


class UserGroupApiHelper {
  private static UserGroupHelperInstance: UserGroupApiHelper;
  ldapHost: string | any = process.env.LDAP_HOST;
  ldapBase: string | any = process.env.LDAP_BASE;
  constructor() { }
  public static getApinstance() {
    if (!UserGroupApiHelper.UserGroupHelperInstance) {
      UserGroupApiHelper.UserGroupHelperInstance = new UserGroupApiHelper();
    }
    return UserGroupApiHelper.UserGroupHelperInstance;
  }

  // Helper function to fetch user/group profile from LDAP
  public getProfilesBy(profile_param: string) {
    return new Promise((resolve, reject) => {
      const ldapClient = createClient({ url: this.ldapHost });
      const search_options: Object = {
        scope: `sub`,
        filter: `${profile_param}`,
        attributes: `*`
      };
      let profile: LdapType;
      ldapClient.search(this.ldapBase, search_options, (err, response) => {
        response.on(`searchEntry`, (entry) => {
          profile = entry.object;
        });
        response.on(`error`, (error: Error) => {
          console.error(`LDAP error: ` + error.message);
        });
        response.on(`end`, (result: any) => {
          resolve(profile);
        });
      });
    });
  }
}

export const UserGroupAPIHelper = UserGroupApiHelper.getApinstance();

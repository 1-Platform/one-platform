import { Router, Request, Response, NextFunction } from 'express';
import { request } from 'http';
import { UserGroupAPIHelper } from './helpers';
/**
 * @class LdapAPI
 */

class LdapAPI {
  private static instance: LdapAPI;
  router: Router = Router();

  public static getInstance() {
    if (!LdapAPI.instance) {
      LdapAPI.instance = new LdapAPI();
    }
    return LdapAPI.instance;
  }

  /**
   * Initializing Constructor
  */
  constructor() {
    // Binding the functions on class instance for all APIs
    this.router.get('/user/:uid', this.getUser.bind(this));
    this.router.get('/group/:cn/members', this.getGroupMembers.bind(this));
  }
  // API to fetch the user information from ldap
  public getUser(req: Request, res: Response, next: NextFunction) {
    UserGroupAPIHelper.getProfilesBy(`(uid=${req.params.uid})`).then((response: any) => {
      res.json(response);
      next();
      return;
    });
  }

  // API to fetch the member information who is the part of the rover group
  public getGroupMembers(req: Request, res: Response, next: NextFunction) {
    const groupMembers: any = [];
    UserGroupAPIHelper.getProfilesBy(`(cn=${req.params.cn})`)
      .then((response: any) => {
        response.uniqueMember.map((member: any) => {
          groupMembers.push(member.substring(member.indexOf('uid=') + 4, member.indexOf(',')));
        });
      })
      .then(() => {
        return groupMembers.map((user: string) => {
          return UserGroupAPIHelper.getProfilesBy(`(uid=${user})`)
            .catch(err => {
              console.log('error', err);
              throw err;
            });
        });
      })
      .then(userPromise => Promise.all(userPromise))
      .then(users => {
        res.json(users);
        next();
      })
      .catch(err => {
        throw err;
      });
  }
}

export default LdapAPI.getInstance().router;


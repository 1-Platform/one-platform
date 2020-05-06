export interface IUserDetails {
  _id: string;
  name: string;
  title: string;
  apiRole: string;
  memberOf: { name: string }[];
}

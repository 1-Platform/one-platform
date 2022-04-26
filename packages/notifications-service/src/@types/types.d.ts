interface IGQLContext {
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
  };
  parsedToken: any;
}

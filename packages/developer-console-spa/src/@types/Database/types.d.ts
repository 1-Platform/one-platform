declare namespace Project {
  declare type DatabaseConfig = {
    isEnabled: boolean;
    databases: Database[];
  };
  declare type Database = {
    name: string;
    description: string;
    permissions: {
      admins: string[];
      users: string[];
    };
  }
}

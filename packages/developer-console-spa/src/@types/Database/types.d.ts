declare namespace App {
  declare type DatabaseConfig = {
    isEnabled: boolean;
    databases: Database[];
  };
  declare type Database = {
    name: string;
    descriptions: string;
    permissions: {
      admins: string[];
      users: string[];
    };
  };
}

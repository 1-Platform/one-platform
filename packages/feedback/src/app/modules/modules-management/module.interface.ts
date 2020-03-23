export interface Timestamp {
    createdAt: string;
    createdBy: {
      kerberosID: string;
      name: string;
      email: string;
    };
    modifiedAt?: string;
    modifiedBy?: {
      kerberosID: string;
      name: string;
      email: string;
    };
  }
  
  export interface Module {
    _id: string;
    name: string;
    description: string;
    path: string;
    supportedFeatures: string;
    enableModuleSelection: Boolean;
    category: string;
    owner: {
      kerberosID: string;
      name: string;
      email: string;
    };
    references?: {
      userGuide: string;
      videoLink: string;
    };
    parent?: string | Module;
    timestamp: Timestamp;
  }
  
  export interface ModulesResponse {
    listModules: Module[];
  }
  export interface ModuleResponse {
    getModule: Module;
  }
  
  export interface GetModulesByNameResponse {
    getModulesBy: Module[];
  }
  
  export interface GetModulesByResponse {
    getModulesBy: Module[];
  }
  
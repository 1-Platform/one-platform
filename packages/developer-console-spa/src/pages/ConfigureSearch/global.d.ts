import 'little-state-machine';

declare module 'little-state-machine' {
  interface GlobalState {
    appId: string;
    savedStepId: number;
    formData: Partial<Project.SearchConfig>;
  }
}

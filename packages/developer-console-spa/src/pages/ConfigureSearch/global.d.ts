import 'little-state-machine';

declare module 'little-state-machine' {
  interface GlobalState {
    projectId: string;
    savedStepId: number;
    formData: Partial<Project.SearchConfig>;
  }
}

import { GlobalState } from 'little-state-machine';

export default function saveState (state: GlobalState, payload: Partial<GlobalState>) {
  return {
    ...state,
    ...payload
  }
}

export function overrideState ( state: GlobalState, payload: Partial<GlobalState> ) {
  return {
    ...payload as GlobalState
  };
}

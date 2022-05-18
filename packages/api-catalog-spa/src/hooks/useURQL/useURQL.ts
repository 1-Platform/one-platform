import { useContext } from 'react';
import { Client, Context } from 'urql';

export const useURQL = (): Client => {
  return useContext(Context);
};

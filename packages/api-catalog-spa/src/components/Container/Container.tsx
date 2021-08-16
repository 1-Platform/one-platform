import { FC } from 'react';
import style from './container.module.scss';

/**
 * This component is responsible for centering layout
 * Limiting the width to a particular value in big screen
 */
export const Container: FC = ({ children }) => {
  return <div className={style.container}>{children}</div>;
};

import { css } from '@patternfly/react-styles';
import { FC } from 'react';
import style from './container.module.scss';

/**
 * This component is responsible for centering layout
 * Limiting the width to a particular value in big screen
 */
type Props = {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'fluid';
  className?: string;
};
export const Container: FC<Props> = ({ children, size, className }) => {
  return (
    <div className={css(size ? style[`container-${size}`] : style.container, className)}>
      {children}
    </div>
  );
};

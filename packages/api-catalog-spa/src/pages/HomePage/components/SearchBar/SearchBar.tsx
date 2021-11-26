import { forwardRef } from 'react';
import { css } from '@patternfly/react-styles';

import styles from './searchBar.module.scss';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}

export const SearchBar = forwardRef<HTMLInputElement, Props>(
  ({ onChange, className, ...props }, ref): JSX.Element => {
    return (
      <div className={css(styles['search-bar--container'], className)}>
        <span className={styles['search-bar--input-group']}>
          <input
            {...props}
            onChange={(e) => onChange(e.target.value)}
            ref={ref}
            className={styles['search-bar--input']}
          />
          <span className={styles['search-bar--input-icon-group']}>
            <svg width="24" height="24" fillRule="evenodd" clipRule="evenodd">
              <path
                d="M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5z"
                stroke="white"
              />
            </svg>
          </span>
        </span>
      </div>
    );
  }
);

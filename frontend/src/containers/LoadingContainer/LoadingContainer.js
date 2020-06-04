import React from 'react';
import cx from 'classnames';

import { Icon } from '../../components';

export const LoadingContainer = ({
  loading,
  children,
  className,
  size,
  ...rest
}) => {
  return loading ? (
    <div
      className={cx('w-auto my-auto text-center p-4 mx-auto', className)}
      {...rest}
    >
      <Icon name="spinner" spin size={size} />
    </div>
  ) : (
    children
  );
};

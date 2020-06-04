import React from 'react';
import cx from 'classnames';
import FontAwesome from 'react-fontawesome';

export default ({ color, ...rest }) => (
  <FontAwesome className={cx({ [`icon-${color}`]: color })} {...rest} />
);

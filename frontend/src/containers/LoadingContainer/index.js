import PropTypes from 'prop-types';
import { LoadingContainer } from './LoadingContainer';

LoadingContainer.propTypes = {
  size: PropTypes.string,
};

LoadingContainer.defaultProps = {
  size: '3x',
};

export { LoadingContainer };

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Routes from './screens';

class MainRoutes extends Component {
  render() {
    return (
      <Fragment>
        <ToastContainer />
        <div className="app-content">
          <Routes />
        </div>
      </Fragment>
    );
  }
}

MainRoutes.propTypes = {
  currentUser: PropTypes.object,
};

MainRoutes.defaultProps = {
  currentUser: null,
};

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps, null)(MainRoutes);

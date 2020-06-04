import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Row, Col, Table, Modal } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

import { perPage, limit } from '../../../../constants/common';
import { userListRequest, userDeleteRequest } from '../redux/actions';
import { LoadingContainer } from '../../../../containers';

const UserMain = () => {
  const dispatch = useDispatch();
  const userList = useSelector(state => state.app.userState.users.list);
  const totalCount = useSelector(state => state.app.userState.users.totalCount);
  const loading = useSelector(state => state.app.userState.users.loading);
  const currentUser = useSelector(state => state.auth.currentUser);

  const [deletedId, setDeletedId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    dispatch(userListRequest({ limit, skip }));
  }, [dispatch, skip]);

  const handleRemove = deletedId => () => {
    setDeletedId(deletedId);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    dispatch(userDeleteRequest(deletedId));
    setShowConfirm(false);
  };

  const handleCancel = () => setShowConfirm(false);

  const handlePageClick = data => {
    let selected = data.selected;
    let skip = Math.ceil(selected * perPage);
    setSkip(skip);
  };

  const renderConfirmDialog = () => {
    return (
      <Modal show={showConfirm} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Deleting the User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser['_id'] === deletedId
            ? 'You can not delete yourself'
            : 'Do you really want to remove this user?'}
        </Modal.Body>
        <Modal.Footer>
          {currentUser['_id'] !== deletedId && (
            <Button variant="danger" onClick={handleConfirm}>
              Remove
            </Button>
          )}
          <Button variant="primary" onClick={handleCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderUserList = users => {
    if (!users.length) {
      return (
        <tr>
          <td>No users to show!</td>
        </tr>
      );
    }

    return users.map((user, index) => (
      <tr key={user['_id']}>
        <td>{index + 1 + skip}</td>
        <td>
          {user.firstName}
          &nbsp;
          {user.lastName}
        </td>
        <td>{user.email}</td>
        <td>{user.role}</td>
        <td>
          <Button as={Link} variant="info" to={`/users/${user['_id']}`}>
            Edit
          </Button>
          &nbsp;
          <Button variant="danger" onClick={handleRemove(user['_id'])}>
            Remove
          </Button>
        </td>
      </tr>
    ));
  };
  return (
    <Container className="pt-5">
      <Row className="card-header">
        <Col sm={6}>
          <h3>Users</h3>
        </Col>
        <Col sm={6} className="d-flex justify-content-end align-items-center">
          <Button as={Link} variant="primary" to="/users/new">
            Add
          </Button>
        </Col>
      </Row>
      {renderConfirmDialog()}
      <LoadingContainer loading={loading}>
        <Table className="my-4" responsive>
          <thead>
            <tr>
              <th>Num</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderUserList(userList)}</tbody>
        </Table>
      </LoadingContainer>
      {!!totalCount && (
        <div className="card-footer d-flex">
          <ReactPaginate
            previousLabel={'previous'}
            nextLabel={'next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={Math.ceil(totalCount / limit)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>
      )}
    </Container>
  );
};

export { UserMain };

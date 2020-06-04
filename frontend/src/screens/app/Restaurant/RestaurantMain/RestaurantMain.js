import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Button, Container, Row, Col, Table, Modal } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';

import { LoadingContainer } from '../../../../containers';
import { userListRequest } from '../../User/redux/actions';
import {
  restaurantListRequest,
  restaurantDeleteRequest,
} from '../redux/actions';

import { perPage, limit, MARKS } from '../../../../constants/common';
import { isAdmin, isOwner, isUser } from '../../../../utils/permission';

const RestaurantMain = () => {
  const dispatch = useDispatch();
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setDeleteConfirm] = useState(false);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(5);
  const [skip, setSkip] = useState(0);
  const currentUser = useSelector(state => state.auth.currentUser);
  const restaurants = useSelector(
    state => state.app.restaurantState.restaurants.list,
  );
  const totalCount = useSelector(
    state => state.app.restaurantState.restaurants.totalCount,
  );
  const loading = useSelector(
    state => state.app.restaurantState.restaurants.loading,
  );

  useEffect(() => {
    dispatch(restaurantListRequest({ limit, skip }));
    isAdmin(currentUser) &&
      dispatch(
        userListRequest({ limit, skip: undefined, filter: { role: 'owner' } }),
      );
  }, [currentUser, dispatch]);

  const onDelete = deleteId => () => {
    setDeleteId(deleteId);
    setDeleteConfirm(true);
  };

  const onFilterChange = range => {
    const filters = { from: range[0], to: range[1] };
    setFrom(range[0]);
    setTo(range[1]);
    setTimeout(
      () => dispatch(restaurantListRequest({ limit, skip, filters })),
      1000,
    );
  };

  const handleConfirm = () => {
    dispatch(restaurantDeleteRequest(deleteId));
    setDeleteConfirm(false);
  };

  const handlePageClick = data => {
    let selected = data.selected;
    let skip = Math.ceil(selected * perPage);
    setSkip(skip);
    const filters = { from, to };
    setTimeout(
      () => dispatch(restaurantListRequest({ limit, skip, filters })),
      1000,
    );
  };
  const handleCancel = () => setDeleteConfirm(false);

  const renderConfirmDialog = () => {
    return (
      <Modal show={showDeleteConfirm} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Removing a Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to remove this Restaurant?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleConfirm}>
            Remove
          </Button>
          <Button variant="primary" onClick={handleCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderRestaurants = restaurants => {
    if (!totalCount) {
      return (
        <tr>
          <td colSpan="6">No Restaurants</td>
        </tr>
      );
    }

    return restaurants.map((restaurant, index) => (
      <tr key={restaurant._id}>
        <td>{index + 1 + skip}</td>
        <td>{restaurant.name}</td>
        {!isOwner(currentUser) && (
          <td>
            {!restaurant.user
              ? '-'
              : `${restaurant.user.firstName} ${restaurant.user.lastName}`}
          </td>
        )}
        <td>
          {restaurant.avgRating === null ? (
            'No rate'
          ) : (
            <div className="d-flex align-items-center">
              <StarRatings
                rating={restaurant.avgRating}
                isSelectable={false}
                starRatedColor="rgb(255, 180, 0)"
                starDimension="20px"
                starSpacing="1px"
              />
              <span>&nbsp;({restaurant.ratingCount})</span>
            </div>
          )}
        </td>
        <td>
          {isUser(currentUser) && (
            <Button
              variant="info"
              as={Link}
              to={`/restaurants/${restaurant._id}/reviews/new`}
            >
              Comment
            </Button>
          )}
          &nbsp;&nbsp;
          <Button
            as={Link}
            variant="success"
            to={`/restaurants/${restaurant._id}/reviews`}
          >
            Details
          </Button>
          &nbsp;&nbsp;
          {isAdmin(currentUser) && (
            <Button
              as={Link}
              variant="info"
              to={`/restaurants/${restaurant._id}`}
            >
              Edit
            </Button>
          )}
          &nbsp;&nbsp;
          {isAdmin(currentUser) && (
            <Button variant="danger" onClick={onDelete(restaurant._id)}>
              Delete
            </Button>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          {renderConfirmDialog()}
          <Row className="card-header">
            <Col sm={6}>
              <h2>Restaurants</h2>
            </Col>
            <Col
              sm={6}
              className="d-flex justify-content-end align-items-center"
            >
              {!isUser(currentUser) && (
                <Button varaint="default" as={Link} to="/restaurants/new">
                  Add
                </Button>
              )}
            </Col>
          </Row>
          <Row className="my-4">
            <Col sm={4}>
              <h4>Filter by Rate</h4>
            </Col>
            <Col sm={8}>
              <Range
                defaultValue={[0, 5]}
                min={0}
                max={5}
                marks={MARKS}
                value={[from, to]}
                pushable
                onChange={onFilterChange}
              />
            </Col>
          </Row>
          <LoadingContainer loading={loading}>
            <Table>
              <thead>
                <tr>
                  <th>Num</th>
                  <th>Name</th>
                  {!isOwner(currentUser) && <th>Owner</th>}
                  <th>Average Rate</th>
                  <th />
                </tr>
              </thead>
              <tbody>{renderRestaurants(restaurants)}</tbody>
            </Table>
          </LoadingContainer>
        </Col>
      </Row>
      {!!restaurants.length && (
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

export { RestaurantMain };

import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Select from 'react-select';
import get from 'lodash/get';
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { Icon } from '../../../../components';
import { LoadingContainer } from '../../../../containers';
import { isAdmin } from '../../../../utils/permission';
import {
  restaurantLoadRequest,
  updateRestaurantField,
  restaurantSaveRequest,
  loadNewRestaurant,
} from '../redux/actions';

import { userListRequest } from '../../User/redux/actions';

const RestaurantEdit = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const users = useSelector(state => state.app.userState.users.list);
  const userLoading = useSelector(state => state.app.userState.users.loading);
  const restaurant = useSelector(
    state => state.app.restaurantState.restaurant.data,
  );
  const currentUser = useSelector(state => state.auth.currentUser);
  const loading = useSelector(
    state => state.app.restaurantState.restaurant.loading,
  );

  const loadRestaurant = useCallback(() => {
    if (id === 'new') {
      dispatch(loadNewRestaurant());
    } else {
      dispatch(restaurantLoadRequest(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    loadRestaurant(id);
    isAdmin(currentUser) &&
      dispatch(userListRequest({ filters: { role: 'owner' } }));
  }, [loadRestaurant, dispatch, id]);

  const onSubmit = event => {
    event.preventDefault();
    dispatch(restaurantSaveRequest());
  };

  const onUpdateField = field => event => {
    dispatch(updateRestaurantField(field, event.target.value));
  };

  const onOwnerChange = event => {
    dispatch(updateRestaurantField('user', event.value));
  };

  const arrangeUserOptions = () => {
    const owners = users && users.filter(user => user.role === 'owner');
    return owners.map(owner => ({
      value: owner._id,
      label: `${owner.firstName} ${owner.lastName}`,
    }));
  };

  return (
    <LoadingContainer loading={loading && userLoading}>
      <Container className="h-50">
        <Row className="h-100 align-items-center justify-content-center">
          <Col sm={5}>
            <Card>
              <Card.Header className="text-center">
                {restaurant._id ? 'Edit Restaurant' : 'New Restaurant'}
              </Card.Header>
              <Card.Body>
                <Form onSubmit={onSubmit}>
                  <Form.Group as={Row}>
                    <Col sm={3} className="d-flex align-items-center">
                      Name
                    </Col>
                    <Col sm={9}>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <Icon name="home" />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          value={get(restaurant, 'name', '')}
                          onChange={onUpdateField('name')}
                          placeholder="Name"
                          required
                        />
                      </InputGroup>
                    </Col>
                  </Form.Group>
                  {isAdmin(currentUser) && (
                    <Form.Group as={Row}>
                      <Col sm={3}>Owner :</Col>
                      <Col sm={9}>
                        <Select
                          options={arrangeUserOptions()}
                          value={arrangeUserOptions().filter(
                            item => item.value === restaurant.user,
                          )}
                          isSearchable={false}
                          onChange={onOwnerChange}
                          placeholder="Please choose an Owner"
                        />
                      </Col>
                    </Form.Group>
                  )}
                  <Col className="d-flex align-items-center justify-content-end">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isAdmin(currentUser) && !restaurant.user}
                    >
                      Save
                    </Button>
                    &nbsp;
                    <Button as={Link} variant="danger" to="/restaurants">
                      Cancel
                    </Button>
                  </Col>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </LoadingContainer>
  );
};

export { RestaurantEdit };

import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
} from 'react-bootstrap';
import get from 'lodash/get';
import Select from 'react-select';

import { Icon } from '../../../../components';
import {
  userLoadRequest,
  updateUserField,
  userSaveRequest,
  loadNewUser,
} from '../redux/actions';
import { LoadingContainer } from '../../../../containers';

const UserEdit = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const loadUser = useCallback(() => {
    if (id === 'new') {
      dispatch(loadNewUser());
    } else {
      dispatch(userLoadRequest(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    id && loadUser(id);
  }, [id, loadUser]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(userSaveRequest());
  };

  const onUpdateField = field => e => {
    dispatch(updateUserField(field, e.target.value));
  };

  const onRoleChange = e => {
    dispatch(updateUserField('role', e.value));
  };

  const user = useSelector(state => state.app.userState.user.data);
  const currentUser = useSelector(state => state.auth.currentUser);
  const loading = useSelector(state => state.app.userState.loading);

  const options = [
    { value: 'user', label: 'User' },
    { value: 'owner', label: 'Owner' },
    { value: 'admin', label: 'Admin' },
  ];

  const selectedValue = !options.filter(
    option => option.value === user['role'],
  )[0]
    ? options[0]
    : options.filter(option => option.value === user['role'])[0];

  return (
    <LoadingContainer loading={loading}>
      <Container className="h-75">
        <Row className="h-100 align-items-center justify-content-center">
          <Col xs={5}>
            <Card>
              <Card.Header className="text-center">
                {user['_id'] ? 'Edit User' : 'New User'}
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group as={Row}>
                    <Col xs={3}>
                      <Form.Label>First Name</Form.Label>
                    </Col>
                    <Col xs={9}>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <Icon name="user" />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          type="text"
                          placeholder="Input your first name"
                          name="firstName"
                          value={get(user, 'firstName', '')}
                          onChange={onUpdateField('firstName')}
                          required
                        />
                      </InputGroup>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Col xs={3}>
                      <Form.Label>Last Name</Form.Label>
                    </Col>
                    <Col xs={9}>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <Icon name="user" />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          type="text"
                          placeholder="Input your last name"
                          name="lastName"
                          value={get(user, 'lastName', '')}
                          onChange={onUpdateField('lastName')}
                          required
                        />
                      </InputGroup>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Col xs={3}>
                      <Form.Label>Email</Form.Label>
                    </Col>
                    <Col xs={9}>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <Icon name="envelope" />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          type="email"
                          placeholder="Input your email"
                          name="email"
                          value={get(user, 'email', '')}
                          onChange={onUpdateField('email')}
                          required
                        />
                      </InputGroup>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Col xs={3}>
                      <Form.Label>Password</Form.Label>
                    </Col>
                    <Col xs={9}>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <Icon name="key" />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          type="password"
                          placeholder="Input your password"
                          name="password"
                          value={get(user, 'password', '')}
                          onChange={onUpdateField('password')}
                          required
                        />
                      </InputGroup>
                    </Col>
                  </Form.Group>
                  {currentUser.role === 'admin' &&
                    currentUser._id !== user._id && (
                      <Form.Group as={Row}>
                        <Col xs={3}>
                          <Form.Label>Role</Form.Label>
                        </Col>
                        <Col xs={9}>
                          <Select
                            options={options}
                            isSearchable={false}
                            onChange={onRoleChange}
                            value={selectedValue}
                            plaseHolder="Please choose a role"
                          />
                        </Col>
                      </Form.Group>
                    )}
                  <Row>
                    <Col className="d-flex justify-content-end">
                      <Button variant="primary" type="submit" className="mr-2">
                        Save
                      </Button>
                      <Button variant="secondary" as={Link} to="/users">
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </LoadingContainer>
  );
};

export { UserEdit };

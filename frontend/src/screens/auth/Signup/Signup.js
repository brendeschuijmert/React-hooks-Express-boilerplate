import React from 'react';
import { Formik } from 'formik';
import {
  Form,
  Card,
  Container,
  Row,
  Col,
  InputGroup,
  Button,
} from 'react-bootstrap';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { signupRequest } from '../redux/actions';
import { Icon } from '../../../components/Icon';

const schema = Yup.object({
  email: Yup.string()
    .email('Email must be valid')
    .required('Email is required!'),
  password: Yup.string().required('Password is required!'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match.')
    .required('Passwords must match.'),
  firstName: Yup.string().required('The first name is required!'),
  lastName: Yup.string().required('The last name is required!'),
});

const SignupPage = () => {
  const dispatch = useDispatch();
  const handleSubmit = values => {
    const { email, password, firstName, lastName } = values;
    dispatch(signupRequest({ email, password, firstName, lastName }));
  };

  return (
    <Container className="h-75">
      <Row className="h-100 align-items-center justify-content-center">
        <Col xs={5}>
          <Card>
            <Card.Header bg="secondary" className="text-center">
              Register a new account
            </Card.Header>
            <Card.Body>
              <Formik
                validationSchema={schema}
                onSubmit={handleSubmit}
                initialValues={{
                  email: '',
                  password: '',
                  passwordConfirm: '',
                  firstName: '',
                  lastName: '',
                }}
              >
                {({ handleSubmit, handleChange, values, isValid, errors }) => (
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
                            value={values.firstName}
                            onChange={handleChange}
                            isInvalid={!!errors.firstName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.firstName}
                          </Form.Control.Feedback>
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
                            value={values.lastName}
                            onChange={handleChange}
                            isInvalid={!!errors.lastName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.lastName}
                          </Form.Control.Feedback>
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
                            type="text"
                            placeholder="Input your email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
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
                            value={values.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Col xs={3}>
                        <Form.Label>Confirm Password</Form.Label>
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
                            placeholder="Confirm your password"
                            name="passwordConfirm"
                            value={values.passwordConfirm}
                            onChange={handleChange}
                            isInvalid={!!errors.passwordConfirm}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.passwordConfirm}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Col>
                    </Form.Group>
                    <Button
                      block
                      variant="secondary"
                      type="submit"
                      disabled={!isValid}
                    >
                      Register
                    </Button>
                  </Form>
                )}
              </Formik>
              <Row>
                <Col className="d-inline-flex justify-content-center">
                  <Link to={'/auth/login'}>Click here to login</Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export { SignupPage };

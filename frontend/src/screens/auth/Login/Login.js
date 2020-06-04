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
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginRequest } from '../redux/actions';
import { Icon } from '../../../components/Icon';

const schema = yup.object({
  email: yup
    .string()
    .email()
    .required('Email is required!'),
  password: yup.string().required('Password is required!'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const handleSubmit = values => {
    const { email, password } = values;
    dispatch(loginRequest(email, password));
  };

  return (
    <Container className="h-75">
      <Row className="h-100 align-items-center justify-content-center">
        <Col xs={5}>
          <Card>
            <Card.Header className="text-center">Log in</Card.Header>
            <Card.Body>
              <Formik
                validationSchema={schema}
                onSubmit={handleSubmit}
                initialValues={{
                  email: '',
                  password: '',
                }}
              >
                {({ handleSubmit, handleChange, values, isValid, errors }) => (
                  <Form onSubmit={handleSubmit}>
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
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Button
                      block
                      variant="secondary"
                      type="submit"
                      disabled={!isValid}
                    >
                      Log in
                    </Button>
                  </Form>
                )}
              </Formik>
              <Row>
                <Col className="d-inline-flex justify-content-center">
                  <Link to={'/auth/signup'}>Click here to register</Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export { LoginPage };

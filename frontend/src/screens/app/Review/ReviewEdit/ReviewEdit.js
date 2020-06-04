import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import get from 'lodash/get';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StarRatings from 'react-star-ratings';
import { Container, Button, Row, Col, Form, Card } from 'react-bootstrap';

import {
  reviewLoadRequest,
  updateReviewField,
  reviewSaveRequest,
  loadNewReview,
} from '../redux/actions';
import { LoadingContainer } from '../../../../containers';
import { isAdmin, isUser } from '../../../../utils/permission';

const ReviewEdit = () => {
  const dispatch = useDispatch();
  // let history = useHistory();
  const { reviewId, id: restaurantId } = useParams();
  const review = useSelector(state => state.app.reviewState.review.data);
  const currentUser = useSelector(state => state.auth.currentUser);
  const loading = useSelector(state => state.app.reviewState.review.loading);

  const loadReview = useCallback(() => {
    if (reviewId === 'new') {
      dispatch(loadNewReview());
    } else {
      dispatch(reviewLoadRequest(reviewId, restaurantId));
    }
  }, [reviewId, restaurantId, dispatch]);

  useEffect(() => {
    reviewId && loadReview(reviewId);
  }, [loadReview, reviewId]);

  const onSubmit = e => {
    e.preventDefault();
    //todo need to set time out
    dispatch(reviewSaveRequest(restaurantId));
  };

  const onUpdateField = field => evt => {
    dispatch(updateReviewField(field, evt.target.value));
  };

  const onStarClick = nextValue => {
    dispatch(updateReviewField('rate', nextValue));
  };

  const handleDateChange = date => {
    dispatch(updateReviewField('date', date));
  };

  return (
    <LoadingContainer loading={loading}>
      <Container className="h-75">
        <Row className="h-100 align-items-center justify-content-center">
          <Col sm={5}>
            <Card>
              <Card.Header className="text-center">
                {review['_id'] ? 'Edit Review' : 'New Review'}
              </Card.Header>
              <Card.Body>
                <Form onSubmit={onSubmit}>
                  <Form.Group as={Row}>
                    <Col sm={3}>
                      <Form.Label>Rate: {review.rate}</Form.Label>
                    </Col>
                    <Col sm={9}>
                      <StarRatings
                        numberOfStars={5}
                        starRatedColor="rgb(255, 180, 0)"
                        changeRating={onStarClick}
                        rating={get(review, 'rate', 0)}
                        starDimension="20px"
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Col sm={3}>
                      <Form.Label>Visited Date:</Form.Label>
                    </Col>
                    <Col sm={9}>
                      <DatePicker
                        className="form-control"
                        selected={
                          review.date ? new Date(review.date) : new Date()
                        }
                        onChange={handleDateChange}
                        todayButton="Today"
                        dateFormat="MM/dd/yyyy"
                        maxDate={new Date()}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Col sm={3}>
                      <Form.Label>Comment</Form.Label>
                    </Col>
                    <Col sm={9}>
                      <Form.Control
                        as="textarea"
                        value={get(review, 'comment', '')}
                        onChange={onUpdateField('comment')}
                        placeholder="Leave your comment..."
                        rows={10}
                        required
                      />
                    </Col>
                  </Form.Group>
                  {isAdmin(currentUser) && (
                    <Form.Group as={Row}>
                      <Col sm={3}>
                        <Form.Label>Reply</Form.Label>
                      </Col>
                      <Col sm={9}>
                        <Form.Control
                          as="textarea"
                          value={get(review, 'reply', '')}
                          onChange={onUpdateField('reply')}
                          placeholder="Reply to..."
                          rows={2}
                        />
                      </Col>
                    </Form.Group>
                  )}
                  <Col sm={6}>
                    <Button variant="primary" type="submit">
                      Save
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                      variant="secondary"
                      as={Link}
                      to={
                        isUser(currentUser)
                          ? `/restaurants`
                          : `/restaurants/${restaurantId}/reviews`
                      }
                    >
                      Back
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

export { ReviewEdit };

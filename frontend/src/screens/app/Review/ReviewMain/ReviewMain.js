import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import StarRatings from 'react-star-ratings';
import {
  Button,
  Container,
  Row,
  Col,
  Table,
  Modal,
  Form,
} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

import {
  reviewListRequest,
  reviewReplyRequest,
  reviewDeleteRequest,
} from '../redux/actions';
import { LoadingContainer } from '../../../../containers';
import { isAdmin, isOwner, isUser } from '../../../../utils/permission';
import { perPage, limit } from '../../../../constants/common';

const ReviewMain = () => {
  const dispatch = useDispatch();

  const { id } = useParams();

  const reviews = useSelector(state => state.app.reviewState.reviews.list);
  const maxReview = useSelector(
    state => state.app.reviewState.reviews.maxReview,
  );
  const minReview = useSelector(
    state => state.app.reviewState.reviews.minReview,
  );
  const avgRating = useSelector(
    state => state.app.reviewState.reviews.avgRating,
  );
  const totalCount = useSelector(
    state => state.app.reviewState.reviews.totalCount,
  );
  const loading = useSelector(state => state.app.reviewState.reviews.loading);
  const currentUser = useSelector(state => state.auth.currentUser);

  const [showReplyConfirm, setReplyConfirm] = useState(false);
  const [showDeleteConfirm, setDeleteConfirm] = useState(false);
  const [replyText, setText] = useState('');
  const [selectedReviewId, setReviewId] = useState('');
  const [deletedId, setDeletedId] = useState('');
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    dispatch(reviewListRequest({ id, limit, skip }));
  }, [dispatch, id, skip]);

  const handleReplyConfirm = () => {
    if (!!replyText) {
      dispatch(reviewReplyRequest(id, selectedReviewId, replyText));
      setReplyConfirm(false);
    }
  };

  const handleCancel = () => {
    setReplyConfirm(false);
  };

  const handleReplyChange = e => {
    setText(e.target.value);
  };

  const handleReply = reviewId => {
    setText('');
    setReplyConfirm(true);
    setReviewId(reviewId);
  };

  const handleDelete = deletedId => () => {
    setDeleteConfirm(true);
    setDeletedId(deletedId);
  };

  const handleDeleteConfirm = () => {
    dispatch(reviewDeleteRequest(deletedId, id));
    setDeleteConfirm(false);
  };

  const handleDeleteCancel = () => setDeleteConfirm(false);

  const handlePageClick = data => {
    let selected = data.selected;
    let skip = Math.ceil(selected * perPage);
    setSkip(skip);
  };

  const arrangeReviewData = () => {
    if (!totalCount) {
      return [];
    }
    return [
      {
        header: 'Average Rate',
        value: avgRating,
      },
      {
        header: 'Maximum-rated Review',
        review: maxReview,
      },
      {
        header: 'Minimum-rated Review',
        review: minReview,
      },
    ];
  };

  const renderDeleteConfirmModal = () => {
    return (
      <Modal show={showDeleteConfirm} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Removing a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to remove this review?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Remove&nbsp;
          </Button>
          <Button variant="primary" onClick={handleDeleteCancel}>
            Cancel&nbsp;
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderReplyModal = () => {
    return (
      <Modal show={showReplyConfirm} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Reply Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            value={replyText}
            onChange={handleReplyChange}
            placeholder="Reply to..."
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="info"
            onClick={handleReplyConfirm}
            disabled={!replyText.length}
          >
            Submit
          </Button>
          <Button vairant="danger" onClick={handleCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderReview = review => {
    return (
      <tr key={review._id}>
        <td>{moment(review.date).format('MMM DD YYYY')}</td>
        <td>
          <StarRatings
            numberOfStars={5}
            starRatedColor="rgb(255, 180, 0)"
            rating={review.rate}
            starDimension="20px"
            starSpacing="1px"
            isSelectable={false}
          />
        </td>
        <td>{review.comment}</td>
        <td>
          {!review.reply ? (
            isUser(currentUser) ? (
              ''
            ) : (
              <Button
                disabled={review.reply.length !== 0}
                variant="success"
                onClick={() => handleReply(review._id)}
              >
                {review.reply.length !== 0 ? 'Replied' : 'Reply'}
              </Button>
            )
          ) : (
            review.reply
          )}
        </td>
        {!isUser(currentUser) && (
          <td>
            {isAdmin(currentUser) && (
              <Button
                as={Link}
                variant="info"
                to={`/restaurants/${id}/reviews/${review._id}`}
              >
                Edit
              </Button>
            )}
            &nbsp;&nbsp;
            {isAdmin(currentUser) && (
              <Button variant="danger" onClick={handleDelete(review._id)}>
                Remove
              </Button>
            )}
          </td>
        )}
      </tr>
    );
  };

  return (
    <Container className="mt-5">
      <LoadingContainer loading={loading}>
        {!totalCount ? (
          <Row className="card-header">
            <Col sm={6}>
              <h2>No reviews</h2>
            </Col>
            <Col
              sm={6}
              className="d-flex justify-content-end algin-items-center"
            >
              {!isOwner(currentUser) && (
                <Button as={Link} to={`/restaurants/${id}/reviews/new`}>
                  Add
                </Button>
              )}
            </Col>
          </Row>
        ) : (
          <>
            {renderReplyModal()}
            {renderDeleteConfirmModal()}
            <Row className="card-header">
              <Col sm={6}>
                <h2>Review{totalCount !== 1 && 's'}</h2>
              </Col>
              <Col
                sm={6}
                className="d-flex justify-content-end algin-items-center"
              >
                {!isOwner(currentUser) && (
                  <Button
                    className="d-inline-flex align-items-center"
                    as={Link}
                    variant="primary"
                    to={`/restaurants/${id}/reviews/new`}
                  >
                    Add
                  </Button>
                )}
              </Col>
            </Row>
            {arrangeReviewData().map((item, index) => {
              if (index === 0) {
                return (
                  <h3 key={`key_${item.header}`} className="my-4">
                    {`Overall Average Rate (${totalCount} review${
                      totalCount !== 1 ? 's' : ''
                    }): ${item.value.toFixed(2)}`}
                  </h3>
                );
              }
              return (
                <Row key={`key_${item.header}`} className="mb-4">
                  <Col sm={2}>
                    <h4>{item.header}</h4>
                  </Col>
                  <Col sm={10}>
                    <Table className="review-table" striped responsive>
                      <thead>
                        <tr>
                          <th>Visite Date</th>
                          <th>Rate</th>
                          <th>Comment</th>
                          <th>Reply</th>
                          {isAdmin(currentUser) && <th>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>{renderReview(item.review)}</tbody>
                    </Table>
                  </Col>
                  <Col>
                    <hr />
                  </Col>
                </Row>
              );
            })}
            <Row>
              <Col sm={2}>
                <h4>Last Reviews</h4>
              </Col>
              <Col sm={10}>
                <Table className="review-table" striped>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Rate</th>
                      <th>Comment</th>
                      <th>Reply</th>
                      {isAdmin(currentUser) && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>{reviews.map(item => renderReview(item))}</tbody>
                </Table>
              </Col>
            </Row>
          </>
        )}
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

export { ReviewMain };

export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'http://localhost:4000'
    : 'http://localhost:4000';

export const domain = 'restaurant.review';
export const PAGE_LIMIT = 4;
export const TABLE_LIST_LIMIT = 10;
export const MSG_COUNT_LIMIT = 10;

export const ALERT_COUNT = 5;

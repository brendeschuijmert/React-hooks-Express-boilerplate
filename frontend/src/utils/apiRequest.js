import 'whatwg-fetch';
import queryString from 'qs';
import { baseUrl } from '../config';
import store from '../configureStore';

/**
 * API request module
 *
 * @param {*} endpoint
 * @param {string} [method='GET']
 * @param {*} [data={}]
 * @param {boolean} [isToken=false]
 * @returns
 */
async function request(
  endpoint,
  method = 'GET',
  data = {},
  isToken = false,
  isFormData = false,
) {
  return new Promise((resolve, reject) => {
    let qs = '';
    let body;

    if (['GET', 'DELETE'].indexOf(method) > -1) {
      qs = `?${queryString.stringify(data, { arrayFormat: 'bracket' })}`;
    } else {
      body = isFormData ? data : JSON.stringify(data);
    }

    const requestUrl = `${baseUrl}${endpoint}${qs}`;
    const options = {
      method,
      headers: {},
      body,
    };

    if (!isFormData) {
      options.headers['Content-Type'] = 'application/json';
    }

    if (isToken) {
      options.headers.Authorization = `Bearer ${store.getState().auth.token}`;
    }

    fetch(requestUrl, options)
      .then(result => {
        if (result.status >= 200 && result.status < 300) {
          return resolve(result.json());
        }
        return result.json().then(reject);
      })
      .catch(err => reject(err));
  });
}

export default request;

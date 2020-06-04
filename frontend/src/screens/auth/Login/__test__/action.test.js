import * as CONSTANTS from '../../redux/constants';

import { loginRequest, loginSuccess, loginError } from '../../redux/actions';

describe('login Actions', () => {
  describe('login request', () => {
    it('should return the correct type', () => {
      const email = 'admin@admin.com';
      const password = '1234';
      const expectedResult = {
        type: CONSTANTS.LOGIN_REQUEST,
        email,
        password,
      };

      expect(loginRequest(email, password)).toEqual(expectedResult);
    });
  });

  describe('login success', () => {
    it('should return the correct type and the passed data', () => {
      const fixture = {};
      const expectedResult = {
        type: CONSTANTS.LOGIN_SUCCESS,
        payload: fixture,
      };

      expect(loginSuccess(fixture)).toEqual(expectedResult);
    });
  });

  describe('login error', () => {
    it('should return the correct type and the error', () => {
      const expectedResult = {
        type: CONSTANTS.LOGIN_ERROR,
      };

      expect(loginError()).toEqual(expectedResult);
    });
  });
});

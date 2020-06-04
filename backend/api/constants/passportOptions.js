const options = {
  usernameField: 'email',
  hashField: 'password',
  errorMessages: {
    MissingPasswordError: 'No password was given',
    AttemptTooSoonError: 'Account is currently locked. Try again later',
    TooManyAttemptsError:
      'Account locked due to too many failed login attempts',
    NoSaltValueStoredError: 'Authentication not possible. No salt value stored',
    UserExistsError: 'A user with the given email is already registered'
  }
};

module.exports = options;

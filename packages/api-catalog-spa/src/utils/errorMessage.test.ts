import { emailErrorMsg, reqErrorMsg, validURLErrMsg } from './errorMessages';

describe('Error Messages Test', () => {
  test('should have required message', () => {
    const reqMsg = reqErrorMsg('field');

    expect(reqMsg).toEqual('field is required');
  });

  test('should have email error message', () => {
    const emailErrMsg = emailErrorMsg('field');

    expect(emailErrMsg).toEqual('field must be a valid email');
  });

  test('should have url error message', () => {
    const urlErrMsg = validURLErrMsg('field');

    expect(urlErrMsg).toEqual('field must be a valid url');
  });
});

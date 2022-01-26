const ErrorResponse = require('./errorResponse');

describe('Test suite for utils/errorResponse.js', () => {
  it('Test case to check error response object', () => {
    const { statusCode, message } = new ErrorResponse('This is error', 500);

    expect([message, statusCode]).toEqual(['This is error', 500]);
  });
});

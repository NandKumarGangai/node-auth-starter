const { logger, log } = require('./logger');

describe('Test suite for utils/logger.js', () => {
  const loggers = Object.keys(logger);
  it('Every logger should be type of function', () => {
    loggers.forEach(key => {
      expect(typeof logger[key]).toBe('function');
    });
    expect(typeof log).toBe('function');
  });
});

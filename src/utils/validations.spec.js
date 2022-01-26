const { isEmailAllowed, isPasswordAllowed } = require('./validations');

describe('Test suite for utils/validations.js', () => {
  it('Test to check email validation for invalid emails', () => {
    const invalidEmails = [
      'test',
      '123123123',
      '123`12',
      'test @0',
      'test@com',
      'teststststststs.com'
    ];
    invalidEmails.forEach(email => {
      expect(isEmailAllowed(email)).toBe(false);
    });
  });

  it('Test to check email validation for valid emails', () => {
    const validEmails = [
      'test@mail.com',
      '123123123@mail.com',
      'test@comcom.com'
    ];
    validEmails.forEach(email => {
      expect(isEmailAllowed(email)).toBe(true);
    });
  });

  it('Test to check password validation for invalid password', () => {
    const invalidPasswords = [
      'test',
      '123123123',
      '123`12',
      'test @0',
      'test@com',
      'teststststststs.com'
    ];
    invalidPasswords.forEach(email => {
      expect(isPasswordAllowed(email)).toBe(false);
    });
  });

  it('Test to check password validation for valid passwords', () => {
    const validPasswords = [
      'Strongp@ssw0rd',
      'MyStrongerStrongp@ssw0rd'
    ];
    validPasswords.forEach(email => {
      expect(isPasswordAllowed(email)).toBe(true);
    });
  });
});

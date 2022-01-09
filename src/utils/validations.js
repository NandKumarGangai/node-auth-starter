const EMAIL = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

/**
 * @description Password should be min 8 char length and includes
 * atleast a digit, a capital letter, a lowercase letter and a non-alphanumeric
 * @param {*} password password text
 * @returns true if password text is valid otherwise false
 */
const isPasswordAllowed = (password) => {
  return (
    password.length >= 8 &&
    // non-alphanumeric
    /\W/.test(password) &&
    // digit
    /\d/.test(password) &&
    // capital letter
    /[A-Z]/.test(password) &&
    // lowercase letterks
    /[a-z]/.test(password)
  )
};

/**
 * @description Email should match the validation regex
 * @param {*} email email text
 * @returns true if email text is valid otherwise false
 */
const isEmailAllowed = (email) => EMAIL.test(email);

module.exports = {
  EMAIL,
  isPasswordAllowed,
  isEmailAllowed
}
const CREATED_CODE = 201;
const VALID_ERR = 400;
const AUTH_ERR = 401;
const NOT_FOUND_ERR = 404;
const DEFAULT_ERR = 500;

const PATERN_URL = /^(http:\/\/|https:\/\/)(www\.)?[a-zA-Z0-9\-._~:/?#\[\]@!\$&'()*+,;=]+(#\w*)?$/;

module.exports = {
  CREATED_CODE,
  VALID_ERR,
  AUTH_ERR,
  NOT_FOUND_ERR,
  DEFAULT_ERR,
  PATERN_URL,
};

const constants = require('../constant/constants');
const OAuthValidationError = require("../error/OAuthValidationError");
const logger = require("../logger");
const Users = require("../dao/users");
  function validate_user_register_request(req){
    logger.info("Validating all user inputs in registration route");
    validate_user_name(req.body.user_name);
    validate_mobile_number(req.body.mobile);
    validate_password(req.body.password);
    validate_name(req.body.name);
  }

  async function validate_if_user_exists(req) {
    if (await Users.is_existing_user(req.body.mobile, req.body.user_name)) {
      throw new OAuthValidationError("OAREV_1016");
    }
  }

  function validate_name(name){
    if(name === undefined || name === null)
      throw new OAuthValidationError("OAREV_1013");

    if(name.length < constants.MIN_NAME_LEN )
      throw new OAuthValidationError("OAREV_1014");

    if(name.length > constants.MAX_NAME_LEN)
      throw new OAuthValidationError("OAREV_1015");
  }
  
  
  function validate_password(password){
    if(password === undefined || password === null)
      throw new OAuthValidationError("OAREV_1010");

    if(password.length > constants.MAX_PASSWORD_LEN)
      throw new OAuthValidationError("OAREV_1011");

    if(password.length < constants.MIN_PASSWORD_LEN)
      throw new OAuthValidationError("OAREV_1012");

    if(!password.match(constants.PASSWORD_REGEX))
      throw new OAuthValidationError("OAREV_1013");

  }
  
  function  validate_mobile_number(mobile){
    if (mobile === undefined || mobile === null)
      throw new OAuthValidationError("OAREV_1006");

    if (mobile.length > constants.MAX_MOBILE_LEN)
      throw new OAuthValidationError("OAREV_1007");

    if (mobile.length < constants.MIN_MOBILE_LEN)
      throw new OAuthValidationError("OAREV_1008");

    if(!mobile.match(constants.MOBILE_REGEX))
      throw new OAuthValidationError("OAREV_1009");

  }
  
  function validate_user_name(user_name){
    console.log(user_name);
    if(user_name === undefined || user_name === null)
      throw new OAuthValidationError("OAREV_1000");

    user_name = user_name.toLowerCase();
    if(user_name.length > constants.MAX_USERNAME_LEN)
      throw new OAuthValidationError("OAREV_1003");
    if(user_name.length < constants.MIN_USERNAME_LEN)
      throw new OAuthValidationError("OAREV_1004");
    
    if(!user_name.match(constants.USERNAME_REGEX))
      throw new OAuthValidationError("OAREV_1005");
  }




module.exports = { validate_user_register_request: validate_user_register_request, validationMobileNumber: validate_mobile_number, validationName: validate_name,
  validationPassword: validate_password, validationUserName: validate_user_name, validate_if_user_exists };
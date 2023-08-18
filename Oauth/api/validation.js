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
    validate_gender(req.body.gender);
    validate_dob(req.body.dob);
  }

  function validate_gender(gender) {
    if (gender === null)
      throw new OAuthValidationError("OA_1018")
    if (gender !== parseInt(gender, 10) || gender < 0 || gender > 2)
      throw new OAuthValidationError("OA_1018")
  }

  function validate_dob(dob) {
    if (dob === null)
      throw new OAuthValidationError("OA_1019");
    if(!dob.match(constants.DATE_REGEX_YYYY_MM_DD))
      throw new OAuthValidationError("OA_1019");
    const parsed_date = new Date(dob);
    const epoch_time = parsed_date.getTime();
    if(!epoch_time && epoch_time !== 0)
      throw new OAuthValidationError("OA_1019");
  }

  async function validate_if_user_exists(req) {
    if (await Users.is_existing_user(req.body.mobile, req.body.user_name)) {
      throw new OAuthValidationError("OA_1016");
    }
  }

  function validate_name(name){
    if(name === null)
      throw new OAuthValidationError("OA_1013");

    if(name.length < constants.MIN_NAME_LEN )
      throw new OAuthValidationError("OA_1014");

    if(name.length > constants.MAX_NAME_LEN)
      throw new OAuthValidationError("OA_1015");
  }
  
  
  function validate_password(password){
    if(password === null)
      throw new OAuthValidationError("OA_1010");

    if(password.length > constants.MAX_PASSWORD_LEN)
      throw new OAuthValidationError("OA_1011");

    if(password.length < constants.MIN_PASSWORD_LEN)
      throw new OAuthValidationError("OA_1012");

    if(!password.match(constants.PASSWORD_REGEX))
      throw new OAuthValidationError("OA_1021");

  }
  
  function  validate_mobile_number(mobile){
    if (mobile === null)
      throw new OAuthValidationError("OA_1006");

    if (mobile.toString().length > constants.MAX_MOBILE_LEN)
      throw new OAuthValidationError("OA_1007");

    if (mobile.toString().length < constants.MIN_MOBILE_LEN)
      throw new OAuthValidationError("OA_1008");

    if(!mobile.toString().match(constants.MOBILE_REGEX))
      throw new OAuthValidationError("OA_1009");

  }
  
  function validate_user_name(user_name){
    if(user_name === null)
      throw new OAuthValidationError("OA_1020");

    user_name = user_name.toLowerCase();
    if(user_name.length > constants.MAX_USERNAME_LEN)
      throw new OAuthValidationError("OA_1003");
    if(user_name.length < constants.MIN_USERNAME_LEN)
      throw new OAuthValidationError("OA_1004");
    
    if(!user_name.match(constants.USERNAME_REGEX))
      throw new OAuthValidationError("OA_1005");
  }




module.exports = { validate_user_register_request: validate_user_register_request, validationMobileNumber: validate_mobile_number, validationName: validate_name,
  validationPassword: validate_password, validationUserName: validate_user_name, validate_if_user_exists };
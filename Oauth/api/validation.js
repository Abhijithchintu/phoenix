const constants = require('../constant/constants');
const OAuthValidationError = require("../error/OAuthValidationError");
const logger = require("../logger");

  function validateUserRegisterRequest(req){
    logger.info("Validating all user inputs in registration route");

    logger.debug("Validating userName in regitration route");
    validationUserName(req.body.userName);
    logger.info(req.body.userName + " : userName is validated");

    logger.debug("Validating Mobile Number in registration route");
    validationMobileNumber(req.body.mobile);
    logger.info(req.body.mobile + " :mobile number is validated");

    logger.debug("validating password in registration route");
    validationPassword(req.body.password);
    logger.info("Password is validated");

    logger.debug("Validating Name of the User in regitration route");
    validationName(req.body.name);
    logger.info(req.body.name + " : Name of the user is validated");
  }

  function validationName(name){
    if(name === undefined){
      throw new OAuthValidationError("Name is not defined");
    }
    if(name.length < constants.MIN_NAME_LEN ){
      throw new OAuthValidationError("Name is too short, it should contain atleat 3 characters");
    }
    if(name.length > constants.MAX_NAME_LEN){
      throw new OAuthValidationError("Name is too long, it should contain only 40 characters");
    }
  }
  
  
  function validationPassword(password){
    if(password === undefined){
      logger.error("Password not defined");
      throw new OAuthValidationError("Password is undefined");
    }
    if(password.length > constants.MAX_PASSWORD_LEN){
      throw new OAuthValidationError("Password is too long, it should be in the range of (8-31)");
    }
    if(password.length < constants.MIN_PASSWORD_LEN){
      throw new OAuthValidationError("Password is too short, it should be in the range of (8-31)");
    }
    if(!password.match(constants.PASSWORD_REGEX)){
      throw new OAuthValidationError("Password must contain atleast 1 Capital letter, 1 small letter and 1 special character");
    }
  }
  
  function  validationMobileNumber(mobile){
    if(mobile === undefined){
      logger.error("Mobile Number not defined");
      throw new OAuthValidationError("Mobile Number is undefined");
    }
    if(mobile === null){
      logger.error(mobile + " Mobile number is empty");
      throw new OAuthValidationError("Mobile number is empty");
    }
    if(mobile.length > constants.MAX_MOBILE_LEN){
      logger.error(mobile.slice(0,11) + "..." + " is too long");
      throw new OAuthValidationError("Mobile number is too long, it should contain 10 digits");
    }
    if(mobile.length < constants.MIN_MOBILE_LEN){
      logger.error(mobile + " is too short");
      throw new OAuthValidationError("Mobile number is too short, it should contain 10 digits");
    }
    if(!mobile.match(constants.MOBILE_REGEX)){
      logger.error(mobile + " did not match the regex");
      throw new OAuthValidationError("Mobile Number should only contain 10 digts");
    }
  }
  
  function validationUserName(userName){
    if(userName === undefined){
      logger.error("userName not defined");
      throw new OAuthValidationError("User Name is undefined");
    }
    if(userName === null){
      logger.error(userName + " userName is empty")
      throw new OAuthValidationError("User Name is Empty");
    }
    userName = userName.toLowerCase();
    if(userName.length > constants.MAX_USERNAME_LEN){
      logger.error(userName.slice(0-21) + "...." + " is too long");
      throw new OAuthValidationError("User Name is too long, it should be in the range of (8-20)");
    }
    if(userName.length < constants.MIN_USERNAME_LEN){
      logger.error(userName + " is too short");
      throw new OAuthValidationError("User Name is too short, it should be in the range of (8-20)");
    }
  
    
    if(!userName.match(constants.USERNAME_REGEX)){
      logger.error(userName + " did not match the regex");
      throw new OAuthValidationError("User Name should start with an alphabet, it should contain only alphabets and numbers");
    }
  }




module.exports = {validateUserRegisterRequest, validationMobileNumber, validationName, validationPassword, validationUserName};
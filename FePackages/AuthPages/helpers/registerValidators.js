import CONSTANTS from '../constants';

function validateUserName(username) {
	if (
		username.length > CONSTANTS.MAX_USERNAME_LEN ||
		username.length < CONSTANTS.MIN_USERNAME_LEN
	) {
		return CONSTANTS.USERNAME_LEN_ERROR;
	}

	if (!username.match(CONSTANTS.USERNAME_REGEX)) {
		return CONSTANTS.USERNAME_REGEX_ERROR;
	}

	return true;
}

function validateMobileNo(mobileNo) {
	if (!mobileNo.match(CONSTANTS.MOBILE_REGEX)) {
		return CONSTANTS.MOBILE_NUMBER_ERROR;
	}
	return true;
}

function validateYear(year) {
	return year >= CONSTANTS.MIN_YEAR && year <= new Date().getFullYear()
		? true
		: 'Invalid Year';
}

function validatePassword(password) {
	if (
		password.length > CONSTANTS.MAX_PASSWORD_LEN ||
		password.length < CONSTANTS.MIN_PASSWORD_LEN
	) {
		return CONSTANTS.PASSWORD_lEN_ERROR;
	}

	if (!password.match(CONSTANTS.PASSWORD_REGEX)) {
		return CONSTANTS.PASSWORD_REGEX_ERROR;
	}

	return true;
}
export { validateUserName, validateMobileNo, validateYear, validatePassword };

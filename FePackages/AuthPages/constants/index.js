export default Object.freeze({
	MAX_USERNAME_LEN: 20,
	MIN_USERNAME_LEN: 6,
	USERNAME_LEN_ERROR: 'User Name Should be in the range of (8-20)',
	USERNAME_REGEX: /^[a-z][a-z0-9]{7,19}$/,
	USERNAME_REGEX_ERROR:
		'User Name should start with an alphabet, it should contain only alphabets and numbers',
	MOBILE_NUMBER_ERROR: 'Mobile Number should only contain 10 digits',
	MOBILE_REGEX: /[0-9]{10}/,
	MAX_PASSWORD_LEN: 31,
	MIN_PASSWORD_LEN: 8,
	PASSWORD_lEN_ERROR: 'Password Should be in the range of (8-31)',
	PASSWORD_REGEX:
		/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%&*_])[A-Za-z\d!@#$%&*_]{8,31}$/,
	PASSWORD_REGEX_ERROR:
		'Password must contain atleast 1 Capital letter, 1 small letter and 1 special character',
	MIN_YEAR: 1900,
});

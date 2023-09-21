import { useOauthAxios } from '@phoenixfe/hooks';
import { useRouter } from 'next/navigation';
import { setCookieOnBrowser } from '@phoenixfe/utils';

function formatPayload({ formValues = {} }) {
	const {
		user_name,
		mobile,
		name,
		gender,
		dob_day,
		dob_month,
		dob_year,
		password,
	} = formValues || {};

	return {
		user_name,
		mobile,
		name,
		gender: Number(gender),
		password,
		dob: `${dob_year}-${dob_month}-${dob_day}`,
	};
}

const setTokenInCookies = (res) => {
	const { access_token, expires_in } = res?.data || {};

	setCookieOnBrowser({
		cookieName: process.env.NEXT_PUBLIC_OAUTH_TOKEN_NAME,
		cookie: access_token,
		expiresIn: expires_in,
	});
};

function useRegisterUser() {
	const [{ loading, error }, execute] = useOauthAxios({
		url: '/register',
		method: 'post',
	});

	const router = useRouter();

	const registerUser = async (data = {}) => {
		try {
			const res = await execute({
				data: formatPayload({ formValues: data }),
			});

			setTokenInCookies(res);
			router.push('/home');
		} catch (e) {
			console.log('___  e--', e);
		}
	};

	return {
		registerUser,
		loading,
		serverError: error?.response?.data?.error_message || '',
	};
}

export default useRegisterUser;

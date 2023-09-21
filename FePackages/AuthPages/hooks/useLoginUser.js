import { useOauthAxios } from '@phoenixfe/hooks';
import { useRouter } from 'next/navigation';
import { setCookieOnBrowser } from '@phoenixfe/utils';

function formatPayload({ formValues = {} }) {
	const { user_name, password } = formValues || {};

	return {
		user_name,
		password,
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

function useLoginUser() {
	const [{ loading, error }, execute] = useOauthAxios({
		url: '/login',
		method: 'post',
	});

	const router = useRouter();

	const loginUser = async (data = {}) => {
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
		loginUser,
		loading,
		serverError: error?.response?.data?.error_message || '',
	};
}

export default useLoginUser;

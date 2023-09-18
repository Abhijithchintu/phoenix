import Axios from 'axios';
import { getCookieOnClient } from '@phoenixfe/utils';

const instance = Axios.create({
	baseURL: process.env.NEXT_PUBLIC_CHAT_BASE_URL,
});

instance.interceptors.request.use((oldConfig) => {
	const token = getCookieOnClient({
		name: process.env.NEXT_PUBLIC_OAUTH_TOKEN_NAME,
	});

	return {
		...oldConfig,
		headers: {
			'x-access-token': token,
		},
	};
});

export default instance;

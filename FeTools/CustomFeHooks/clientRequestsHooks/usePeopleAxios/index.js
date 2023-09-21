import { makeUseAxios } from 'axios-hooks';

import axiosInstance from './chatAxiosInstance';

const useChatAxios = makeUseAxios({
	axios: axiosInstance,
	cache: false,
	defaultOptions: {
		ssr: false,
		manual: true,
	},
});

export default useChatAxios;

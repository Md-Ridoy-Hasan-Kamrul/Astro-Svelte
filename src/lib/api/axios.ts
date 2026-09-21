import axios, { AxiosError, type AxiosInstance } from 'axios';
import { httpStore } from '../../stores/httpStore';

const DEFAULT_BASE_URL = 'https://api.github.com';

/**
 * Shared Axios client.
 * - Reads auth token from Zustand
 * - Tracks in-flight requests + last error in Zustand
 * - Used by TanStack Query `queryFn` / `mutationFn` only
 */
export const api: AxiosInstance = axios.create({
	baseURL: import.meta.env.PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL,
	timeout: 15_000,
	headers: {
		Accept: 'application/vnd.github+json',
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use((config) => {
	const { authToken } = httpStore.getState();
	const url = `${config.baseURL ?? ''}${config.url ?? ''}`;

	httpStore.getState().beginRequest(url);

	if (authToken) {
		config.headers.Authorization = `Bearer ${authToken}`;
	}

	return config;
});

api.interceptors.response.use(
	(response) => {
		httpStore.getState().endRequest();
		return response;
	},
	(error: unknown) => {
		httpStore.getState().endRequest();
		httpStore.getState().setLastError(getAxiosErrorMessage(error));
		return Promise.reject(error);
	},
);

export function getAxiosErrorMessage(error: unknown): string {
	if (axios.isAxiosError(error)) {
		const axiosError = error as AxiosError<{ message?: string }>;
		return (
			axiosError.response?.data?.message ??
			axiosError.message ??
			`HTTP ${axiosError.response?.status ?? 'error'}`
		);
	}

	if (error instanceof Error) {
		return error.message;
	}

	return 'Unknown network error';
}

import { beforeEach, describe, expect, it } from 'vitest';
import { httpStore } from '../stores/httpStore';

describe('httpStore (Axios ↔ Zustand)', () => {
	beforeEach(() => {
		httpStore.getState().clearHttpStatus();
		httpStore.getState().setAuthToken(null);
	});

	it('tracks pending requests', () => {
		httpStore.getState().beginRequest('/repos/withastro/astro');
		expect(httpStore.getState().pendingRequests).toBe(1);
		expect(httpStore.getState().lastRequestUrl).toContain('withastro');

		httpStore.getState().endRequest();
		expect(httpStore.getState().pendingRequests).toBe(0);
	});

	it('stores last error message', () => {
		httpStore.getState().setLastError('Network Error');
		expect(httpStore.getState().lastError).toBe('Network Error');
	});

	it('keeps auth token for Axios interceptor', () => {
		httpStore.getState().setAuthToken('demo-token');
		expect(httpStore.getState().authToken).toBe('demo-token');
	});
});

describe('getAxiosErrorMessage', () => {
	it('reads Axios error message', async () => {
		const { getAxiosErrorMessage } = await import('../lib/api/axios');
		const axios = (await import('axios')).default;

		const error = new axios.AxiosError('Request failed');
		expect(getAxiosErrorMessage(error)).toBe('Request failed');
		expect(getAxiosErrorMessage(new Error('boom'))).toBe('boom');
		expect(getAxiosErrorMessage('nope')).toBe('Unknown network error');
	});
});

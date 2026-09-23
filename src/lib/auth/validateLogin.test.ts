import { describe, expect, it } from 'vitest';
import { validateLogin } from './validateLogin';

describe('validateLogin', () => {
	it('accepts a valid email and password', () => {
		const result = validateLogin({
			email: 'ada@example.com',
			password: 'secret123',
		});
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.data.email).toBe('ada@example.com');
			expect(result.data.password).toBe('secret123');
		}
	});

	it('requires email and password', () => {
		const result = validateLogin({ email: '  ', password: '' });
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.errors.email).toMatch(/required/i);
			expect(result.errors.password).toMatch(/required/i);
		}
	});

	it('rejects invalid email', () => {
		const result = validateLogin({ email: 'not-an-email', password: 'secret123' });
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.errors.email).toMatch(/valid email/i);
		}
	});

	it('rejects short passwords', () => {
		const result = validateLogin({ email: 'ada@example.com', password: '123' });
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.errors.password).toMatch(/at least/i);
		}
	});
});

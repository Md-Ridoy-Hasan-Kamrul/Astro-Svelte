const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const LOGIN_PASSWORD_MIN = 6;

export type LoginInput = {
	email: string;
	password: string;
};

export type LoginFieldErrors = {
	email?: string;
	password?: string;
};

export type LoginValidation =
	| { ok: true; data: LoginInput }
	| { ok: false; errors: LoginFieldErrors };

export function validateLogin(raw: {
	email?: string;
	password?: string;
}): LoginValidation {
	const email = (raw.email ?? '').trim();
	const password = raw.password ?? '';
	const errors: LoginFieldErrors = {};

	if (!email) {
		errors.email = 'Email is required';
	} else if (!EMAIL_PATTERN.test(email)) {
		errors.email = 'Enter a valid email';
	}

	if (!password) {
		errors.password = 'Password is required';
	} else if (password.length < LOGIN_PASSWORD_MIN) {
		errors.password = `Password must be at least ${LOGIN_PASSWORD_MIN} characters`;
	}

	if (Object.keys(errors).length > 0) {
		return { ok: false, errors };
	}

	return { ok: true, data: { email, password } };
}

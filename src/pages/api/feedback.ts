import type { APIRoute } from 'astro';
import { handleFeedbackPayload } from '../../lib/feedback/handleFeedbackPayload';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	let raw: unknown;

	try {
		raw = await request.json();
	} catch {
		return Response.json({ ok: false, message: 'Invalid JSON body' }, { status: 400 });
	}

	const { status, body } = handleFeedbackPayload(raw);
	return Response.json(body, { status });
};

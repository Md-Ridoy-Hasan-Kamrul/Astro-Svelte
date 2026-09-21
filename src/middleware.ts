import { defineMiddleware } from 'astro:middleware';

/** Hashed build assets can be cached forever; the filename changes when the file changes. */
const IMMUTABLE_ASSET = /^\/_astro\//;

export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();

	if (IMMUTABLE_ASSET.test(context.url.pathname)) {
		response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	}

	return response;
});

<script lang="ts">
	/**
	 * Site-wide Lenis smooth scroll.
	 * Mount once from Layout + DashboardLayout with transition:persist.
	 */
	import { onMount } from 'svelte';
	import 'lenis/dist/lenis.css';
	import {
		destroySmoothScroll,
		initSmoothScroll,
		resumeSmoothScroll,
		scrollSmoothTo,
	} from '../../lib/smoothScroll';

	onMount(() => {
		initSmoothScroll();

		function onPageLoad() {
			initSmoothScroll();
			resumeSmoothScroll();
			const hash = window.location.hash;
			if (hash && hash.length > 1) {
				requestAnimationFrame(() => scrollSmoothTo(hash, { offset: -12 }));
			} else {
				scrollSmoothTo(0, { immediate: true });
			}
		}

		document.addEventListener('astro:page-load', onPageLoad);

		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
		const onReduce = () => {
			if (reduce.matches) destroySmoothScroll();
			else initSmoothScroll();
		};
		reduce.addEventListener?.('change', onReduce);

		return () => {
			document.removeEventListener('astro:page-load', onPageLoad);
			reduce.removeEventListener?.('change', onReduce);
			destroySmoothScroll();
		};
	});
</script>

<script lang="ts">
	let open = $state(false);

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
	}
</script>

<header class="nav">
	<div class="nav__inner">
		<a class="nav__brand" href="#top" onclick={close}>
			<i class="las la-layer-group" aria-hidden="true"></i>
			Astro Svelte
		</a>

		<button
			class="nav__toggle"
			type="button"
			aria-expanded={open}
			aria-controls="site-menu"
			onclick={toggle}
		>
			<span class="sr-only">Menu</span>
			<span class="nav__toggle-bar" class:open></span>
		</button>

		<nav id="site-menu" class="nav__links" class:open aria-label="Primary">
			<a href="#features" onclick={close}>Features</a>
			<a href="#how" onclick={close}>How it works</a>
			<a href="#live-repo" onclick={close}>Live</a>
			<a href="#stack" onclick={close}>Stack</a>
			<a href="#cta" onclick={close}>Get started</a>
		</nav>
	</div>
</header>

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 40;
		backdrop-filter: blur(12px);
		background: color-mix(in srgb, var(--mist) 82%, transparent);
		border-bottom: 1px solid var(--line);
	}

	.nav__inner {
		width: min(100% - (var(--space) * 2), var(--max));
		margin-inline: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		min-height: 4rem;
	}

	.nav__brand {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-family: var(--font-display);
		font-size: 1.2rem;
		font-weight: 800;
		letter-spacing: -0.03em;
		text-decoration: none;
		color: var(--ink);
	}

	.nav__brand i {
		font-size: 1.25rem;
		color: var(--sea);
	}

	.nav__links {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.nav__links a {
		text-decoration: none;
		font-weight: 600;
		font-size: 0.95rem;
		color: var(--ink-soft);
		transition: color 160ms ease;
	}

	.nav__links a:hover {
		color: var(--sea-deep);
	}

	.nav__toggle {
		display: none;
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid var(--line);
		border-radius: 0.4rem;
		background: var(--paper);
		cursor: pointer;
		place-items: center;
	}

	.nav__toggle-bar,
	.nav__toggle-bar::before,
	.nav__toggle-bar::after {
		display: block;
		width: 1.1rem;
		height: 2px;
		background: var(--ink);
		position: relative;
		transition: transform 180ms ease, opacity 180ms ease;
	}

	.nav__toggle-bar::before,
	.nav__toggle-bar::after {
		content: '';
		position: absolute;
		left: 0;
	}

	.nav__toggle-bar::before {
		top: -6px;
	}

	.nav__toggle-bar::after {
		top: 6px;
	}

	.nav__toggle-bar.open {
		background: transparent;
	}

	.nav__toggle-bar.open::before {
		top: 0;
		transform: rotate(45deg);
	}

	.nav__toggle-bar.open::after {
		top: 0;
		transform: rotate(-45deg);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}

	@media (max-width: 720px) {
		.nav__toggle {
			display: grid;
		}

		.nav__links {
			position: absolute;
			inset: 100% 0 auto;
			flex-direction: column;
			align-items: stretch;
			gap: 0;
			padding: 0.5rem var(--space) 1rem;
			background: color-mix(in srgb, var(--paper) 94%, transparent);
			border-bottom: 1px solid var(--line);
			display: none;
		}

		.nav__links.open {
			display: flex;
		}

		.nav__links a {
			padding: 0.75rem 0;
			border-bottom: 1px solid var(--line);
		}

		.nav__links a:last-child {
			border-bottom: 0;
		}
	}
</style>

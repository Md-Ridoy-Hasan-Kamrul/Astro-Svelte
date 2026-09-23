<script lang="ts">
	import InteractiveBook, { type BookPage } from './InteractiveBook.svelte';

	const skillPages: BookPage[] = [
		{
			title: 'Frontend Development',
			eyebrow: 'UI',
			items: [
				'React.js',
				'Next.js',
				'TypeScript',
				'JavaScript (ES6+)',
				'HTML5',
				'CSS3',
				'Tailwind CSS',
				'React Router',
				'Responsive Design',
				'Component-Based Architecture',
			],
		},
		{
			title: 'State Management & API Integration',
			eyebrow: 'Data',
			items: ['REST APIs', 'Axios', 'Redux', 'TanStack Query', 'Zustand', 'Postman'],
		},
		{
			title: 'Performance, Accessibility & Testing',
			eyebrow: 'Quality',
			items: [
				'Lighthouse',
				'Web Performance Optimization',
				'Accessibility',
				'SEO',
				'Cross-Browser Compatibility',
				'Unit Testing (Jest)',
			],
		},
		{
			title: 'Tools, Build & Deployment',
			eyebrow: 'Ops',
			items: [
				'Git',
				'GitHub',
				'Vite',
				'Webpack',
				'Figma',
				'Vercel',
				'Coolify',
				'Railway',
				'CI/CD',
			],
		},
		{
			title: 'Soft Skills & Methodologies',
			eyebrow: 'Work',
			items: [
				'Problem-Solving',
				'Agile',
				'Team Collaboration',
				'Communication',
				'Client Requirement Analysis',
			],
		},
	];
</script>

<section
	id="stack"
	class="mx-auto w-[min(100%-2rem,72rem)] py-14 md:py-20"
	aria-labelledby="stack-title"
>
	<p class="mb-3 font-display text-xs font-bold uppercase tracking-[0.14em] text-sea">
		Stack
	</p>
	<h2
		id="stack-title"
		class="mb-3 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl"
	>
		Skills in five pages
	</h2>
	<p class="mb-8 max-w-xl text-lg text-ink-soft">
		Flip through the interactive book for frontend, APIs, quality, tooling, and soft skills.
	</p>

	<div
		class="overflow-visible rounded-[1.25rem] border border-line bg-mist/40 px-4 py-12 min-[720px]:px-10"
	>
		<div class="mx-auto flex w-full max-w-[52rem] justify-center">
			<InteractiveBook
				pages={skillPages}
				coverTitle="Skills"
				coverSubtitle="Frontend · APIs · Quality · Tools · Soft skills"
				backTitle="That's the stack"
				backSubtitle="Click once more to close the book"
				width={400}
				height={600}
			/>
		</div>
		<p class="mt-8 text-center text-sm text-ink-soft">Click the book to open and turn pages</p>
	</div>
</section>

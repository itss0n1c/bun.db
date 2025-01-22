import { $, build } from 'bun';
import { rm } from 'node:fs/promises';

const clear_dist = () => rm('dist', { recursive: true, force: true });

const build_ts = () =>
	build({
		minify: true,
		target: 'node',
		entrypoints: ['lib/index.ts'],
		outdir: 'dist',
		packages: 'external',
		sourcemap: 'linked',
	});

const build_types = () => $`tsc -p .`;

async function clean_types() {
	const files = ['index.test.d.ts'];
	for (const file of files) await rm(`dist/${file}`);
}

clear_dist()
	.then(() => console.log('Cleared dist directory!'))
	.then(build_ts)
	.then(() => console.log('TypeScript build complete!'))
	.then(build_types)
	.then(clean_types)
	.then(() => console.log('Build complete!'));

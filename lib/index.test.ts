import { expect, test } from 'bun:test';
import { BunDB } from './index.js';

test('test hello', async () => {
	const db = new BunDB('test.sqlite');

	await db.set('hello', 'world');
	expect(await db.get<string>('hello')).toBe('world');
	await db.delete('hello');
	expect(await db.get<string>('hello')).toBe(null);
});

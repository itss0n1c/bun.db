import { expect, test } from 'bun:test';
import { BunDB } from './index.js';

const db = new BunDB('test.sqlite');

test('setting value', async () => {
	await db.set('hello', 'world');
	expect(await db.get<string>('hello')).toBe('world');
});

test('deleting value', async () => {
	await db.delete('hello');
	expect(await db.get<string>('hello')).toBe(null);
});

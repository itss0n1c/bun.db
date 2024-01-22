# bun.db

<a href="https://discord.gg/8bt5dbycDM"><img src="https://img.shields.io/discord/977286501756968971?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
<a href="https://www.npmjs.com/package/bun.db"><img src="https://img.shields.io/npm/v/bun.db?maxAge=3600" alt="npm version" /></a>
<a href="https://www.npmjs.com/package/bun.db"><img src="https://img.shields.io/npm/dt/bun.db.svg?maxAge=3600" alt="npm downloads" /></a>

### A wrapper of [quick.db](https://npmjs.com/package/quick.db) for [bun](https://bun.sh).

## Installation

```zsh
% bun add bun.db
```

## Usage

```ts
	const db = new BunDB('test.sqlite');

	await db.set('hello', 'world');
	let hello = await db.get<string>('hello') // "world"
```

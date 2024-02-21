import { Database } from 'bun:sqlite';
import { IDriver, QuickDB } from 'quick.db';

class BunSqliteDriver implements IDriver {
	private static instance: BunSqliteDriver | null = null;
	private readonly _database: Database;

	get database(): Database {
		return this._database;
	}

	constructor(path: string) {
		this._database = new Database(path);
	}

	public static createSingleton(path: string): BunSqliteDriver {
		if (!BunSqliteDriver.instance) {
			BunSqliteDriver.instance = new BunSqliteDriver(path);
		}
		return BunSqliteDriver.instance;
	}

	public async prepare(table: string): Promise<void> {
		this._database.exec(`CREATE TABLE IF NOT EXISTS ${table} (ID TEXT PRIMARY KEY, json TEXT)`);
	}

	public async getAllRows(table: string): Promise<{ id: string; value: unknown }[]> {
		const prep = this._database.prepare<{ ID: string; json: string }, []>(`SELECT * FROM ${table}`);
		const data = [];

		for (const row of prep.all()) {
			data.push({
				id: row.ID,
				value: JSON.parse(row.json),
			});
		}

		return data;
	}

	public async getRowByKey<T>(table: string, key: string): Promise<[T | null, boolean]> {
		const value = (await this._database
			.prepare(`SELECT json FROM ${table} WHERE ID = $key`)
			.get({ $key: key })) as {
			ID: string;
			json: string;
		};

		return value != null ? [JSON.parse(value.json), true] : [null, false];
	}

	public async getStartsWith(table: string, query: string): Promise<{ id: string; value: unknown }[]> {
		const prep = this._database.prepare<{ ID: string; json: string }, []>(
			`SELECT * FROM ${table} WHERE ID LIKE '${query}%'`,
		);

		const data = [];

		for (const row of prep.all()) {
			data.push({
				id: row.ID,
				value: JSON.parse(row.json),
			});
		}

		return data;
	}

	public async setRowByKey<T>(table: string, key: string, value: unknown, update: boolean): Promise<T> {
		const stringifiedJson = JSON.stringify(value);
		if (update) {
			this._database.prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`).run(stringifiedJson, key);
		} else {
			this._database.prepare(`INSERT INTO ${table} (ID,json) VALUES (?,?)`).run(key, stringifiedJson);
		}

		return value as T;
	}

	public async deleteAllRows(table: string): Promise<number> {
		this._database.prepare(`DELETE FROM ${table}`).run();
		return 1;
	}

	public async deleteRowByKey(table: string, key: string): Promise<number> {
		this._database.prepare(`DELETE FROM ${table} WHERE ID=$key`).run({ $key: key });
		return 1;
	}
}

export class BunDB extends QuickDB {
	constructor(path: string) {
		super({
			driver: new BunSqliteDriver(path),
		});
	}
}

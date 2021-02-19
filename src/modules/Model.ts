// Packages
import query from "@acai/query";
import { CustomException } from "@acai/utils";

// Interfaces
import FieldInfoInterface from "../interfaces/fieldInfo";

// Types
import * as dynamicTypes from "../types/index";

export default class Model {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	// static
	public static $table		: string;
	public static $primary	: string = "id";
	protected static $fields	: FieldInfoInterface[] = [];

	// instance
	private $values: Record<string, unknown> = {};
	public $databaseInitialized = false;

	// -------------------------------------------------
	// Constructor
	// -------------------------------------------------

	public constructor (fields: Record<string, unknown> = {}, databaseSaved = false) {
		const $allFields 			= (this.constructor as unknown as {$fields: FieldInfoInterface[]}).$fields;
		this.$databaseInitialized 	= databaseSaved;

		// set fields
		for (let i = 0; i < $allFields.length; i++) {
			const field = $allFields[i];

			this[field.name as keyof this] = Object.defineProperty(this, field.name, {
				set: (value) => {
					const onSet = dynamicTypes.get(field.type).onRetrieve;
					this.$values[field.name] = onSet ? onSet(value, this.$values, field.args) : value;
				},
				get: () => {
					return this.$values[field.name];
				}
			});
		}

		// save values
		Object.keys(fields).forEach(key => {
			// deno-lint-ignore no-explicit-any
			this[key as keyof this] = fields[key] as any;
		});
	}

	// -------------------------------------------------
	// Main Methods
	// -------------------------------------------------

	public toObject () {
		const serializedValues = {};

		Model.$fields.forEach(field => {
			const value = this.$values[field.name];
			const onSet = dynamicTypes.get(field.type).onSerialize;

			serializedValues[field.name] = onSet ? onSet(value, this.$values, field.args):value;
		});

		return serializedValues;
	}

	public toJson () {
		return JSON.stringify(this.$values);
	}

	// -------------------------------------------------
	// Query methods
	// -------------------------------------------------

	public static query () {
		return query().table(this.$table).parseResult((result: unknown) => {
			if (Array.isArray(result)) {
				return result.map(r => {
					return new this({...r}, true);
				});
			}

			return new this({...(result as Record<string, unknown>)}, true);
		});
	}

	public static async paginate <T extends typeof Model, I = InstanceType<T>> (this: T, page = 1, perPage = 25) {
		return this.query().paginate<I>(page, perPage);
	}

	public static async find <T extends typeof Model, I = InstanceType<T>> (this: T, id: string | number): Promise<I | undefined> {
		return (await this.query().orderBy(this.$primary).where(this.$primary, id).limit(1).get())[0] as unknown as I | undefined;
	}

	public static async findOrFail <T extends typeof Model, I = InstanceType<T>> (this: T, id: string | number): Promise<I | undefined> {
		const response = (await this.query().orderBy(this.$primary).where(this.$primary, id).limit(1).get())[0] as unknown as I | undefined;

		if (!response) {
			throw new CustomException("modelNotFound", `Model ${this.name} with ${this.$primary} ${id} not found`, {
				model		: this.name,
				primaryKey	: this.$primary,
				id			: id,
			});
		}

		return response as I;
	}

	public static async first <T extends typeof Model, I = InstanceType<T>> (this: T): Promise<I | undefined> {
		return this.query().first() as Promise<I | undefined>;
	}

	public static async last <T extends typeof Model, I = InstanceType<T>> (this: T): Promise<I | undefined> {
		return this.query().last() as Promise<I | undefined>;
	}

	public static async runMigration () {
		const exists = await query().existsTable(this.$table);
		const fields = {};

		// map fields
		this.$fields.forEach(field => {
			const typeObj = dynamicTypes.get(field.type).type || {type: "string"};

			fields[field.name] = {
				...typeObj,
				primary: this.$primary === field.name
			};
		});

		// update
		if (exists) {
			await query().alterTable(this.$table, fields);
		}
		// create
		else {
			await query().createTable(this.$table, fields);
		}
	}

	// -------------------------------------------------
	// Instance methods
	// -------------------------------------------------

	public async save () {
		const { $table, $primary } 	= this.constructor as any;
		const { $fields } 			= this.constructor.prototype;

		// get fields
		const fields = {};
		for (let i = 0; i < $fields.length; i++) {
			const field = $fields[i];
			const value = this.$values[field.name];
			const onSet = dynamicTypes.get(field.type).onSave;

			fields[field.name] = onSet ? onSet(value, this.$values, field.args):value;
		}

		// already on database, just update
		if (this.$databaseInitialized) {
			await query().table($table).where($primary, fields[$primary] as string).update(fields);
		}
		// not on database, create
		else {
			await query().table($table).where($primary, fields[$primary] as string).insert(fields);
		}

		// update fields
		this.fill(await query().table($table).where($primary, fields[$primary] as string).first());
	}

	public async delete () {
		const { $table, $primary } 	= this.constructor as any;

		// only should delete if already on database
		if (this.$databaseInitialized) {
			await query().table($table).where($primary, this.$values[$primary] as string).delete();
		}

		this.$databaseInitialized = false;
	}

	public fill (fields: Record<string, unknown>) {
		const $allFields = (this.constructor as {$fields?: FieldInfoInterface[]}).$fields;
		
		// set fields
		for (let i = 0; i < $allFields.length; i++) {
			const field = $allFields[i];

			if (fields[field.name]) {
				this.$values[field.name] 	= fields[field.name];
			}
		}
	}
}

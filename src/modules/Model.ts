// Packages
import query, { AbstractQuery } from "@acai/query";
import { CustomException } 		from "@acai/utils";

// Interfaces
import FieldInfoInterface 	from "../interfaces/fieldInfo";
import RelationDataInterface 	from "../interfaces/relationData";

// Types
import * as dynamicTypes from "../types/index";

// Utils
import foreignHandler from "../utils/foreignHandler";

export default class Model {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	// static
	public static $table		: string;
	public static $primary		: string = "id";
	public static $fields		: FieldInfoInterface[] = [];
	public static $relations	: RelationDataInterface[] = [];

	// instance
	public $values: Record<string, unknown> = {};
	public $databaseInitialized = false;

	// -------------------------------------------------
	// Constructor
	// -------------------------------------------------

	public constructor (fields: Record<string, unknown> = {}, databaseSaved = false) {
		const modelClass			= this.constructor.prototype as {$fields: FieldInfoInterface[], $relations: RelationDataInterface[]};
		const $allFields 			= modelClass.$fields;
		this.$databaseInitialized 	= databaseSaved;

		// set fields
		for (let i = 0; i < $allFields.length; i++) {
			const field 	= $allFields[i];
			const foreign	= modelClass.$relations.find((i) => i.name === field.name);
			const handler 	= foreign ? foreignHandler.bind(this)(foreign) : undefined;

			// define custom getter
			Object.defineProperty(this, field.name, {
				set: (value) => {
					// not a foreign
					if (!foreign) {
						const dynamictype 			= dynamicTypes.get(field.type);
						const callback 				= databaseSaved ? dynamictype.onRetrieve : dynamictype.onCreate;
						this.$values[field.name] 	= callback ? callback(value, this.$values, field.args) : value;
					}
				},
				get: () => {
					// custom getter
					if (handler) {
						return handler;
					}
					// not a foreign
					else {
						return this.$values[field.name];
					}
				}
			});

			// set value
			this[field.name] = fields ? fields[field.name]:undefined;
		}
	}

	// -------------------------------------------------
	// Main Methods
	// -------------------------------------------------

	public toObject () {
		const serializedValues = {};

		this.constructor.prototype.$fields.forEach(field => {
			const value 	= this.$values[field.name];
			const onSet 	= dynamicTypes.get(field.type).onSerialize;
			const foreign	= this.constructor.prototype.$relations.find(i => i.name === field.name);

			if (foreign) {
				if (foreign.type === "belongsTo") {
					serializedValues[foreign.foreignKey] = this.$values[foreign.foreignKey];
				}
			}
			else {
				serializedValues[field.name] = onSet ? onSet(value, this.$values, field.args):value;
			}
		});

		return serializedValues;
	}

	public toJson () {
		return JSON.stringify(this.toObject());
	}

	// -------------------------------------------------
	// Query methods
	// -------------------------------------------------

	public static query <T extends typeof Model, I = InstanceType<T>> (this: T): AbstractQuery<T> {
		return query().table(this.$table).parseResult((result: unknown) => {
			if (Array.isArray(result)) {
				return result.map(r => {
					return new this({...r}, true);
				});
			}

			return new this({...(result as Record<string, unknown>)}, true);
		}) as unknown as AbstractQuery<I>;
	}

	public static async paginate <T extends typeof Model, I = InstanceType<T>> (this: T, page = 1, perPage = 25) {
		return this.query().paginate<I>(page, perPage);
	}

	public static async find <T extends typeof Model, I = InstanceType<T>> (this: T, id: string | number): Promise<I | undefined> {
		return (await this.query().orderBy(this.$primary).where(this.$primary, id).limit(1).get())[0] as I | undefined;
	}

	public static async findOrFail <T extends typeof Model, I = InstanceType<T>> (this: T, id: string | number): Promise<I | undefined> {
		const response = (await this.query().orderBy(this.$primary).where(this.$primary, id).limit(1).get())[0] as I;

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
		return this.query().first<I>() as Promise<I | undefined>;
	}

	public static async last <T extends typeof Model, I = InstanceType<T>> (this: T): Promise<I | undefined> {
		return this.query().last<I>() as Promise<I | undefined>;
	}

	// -------------------------------------------------
	// Migration methods
	// -------------------------------------------------

	public static addMigration () {
		const fields = {};

		// map fields
		(this.prototype as unknown as {$fields: FieldInfoInterface[]}).$fields.forEach(field => {
			const typeObj = dynamicTypes.get(field.type).type || {type: "string"};

			fields[field.name] = {
				...typeObj,
				primary: this.$primary === field.name,
			};

			// check foreign key
			(this.prototype as unknown as {$relations: RelationDataInterface[]}).$relations.forEach(foreign => {
				if (foreign.type === "belongsTo" && foreign.name === field.name) {
					const primary 		= foreign.primaryKey || foreign.model().$primary;
					const primaryType 	= (foreign.model().prototype as any).$fields.find(i => i.name === primary);
					const typeObj 		= dynamicTypes.get(primaryType.type).type || {type: "string"};

					// unset field because we won't be using it
					delete fields[field.name];

					// add foreign key
					fields[foreign.foreignKey] = {
						...typeObj,
						foreign: {
							table	: foreign.model().$table,
							column	: primary,
							onDelete: "CASCADE",
						}
					};
				}
			});
		});

		query().addMigration(this.$table, fields);
	}

	// -------------------------------------------------
	// Instance methods
	// -------------------------------------------------

	public async save () {
		const { $table, $primary } 	= this.constructor as any;
		const { $fields } 			= this.constructor.prototype as any;

		// get fields
		const fields = {};
		for (let i = 0; i < $fields.length; i++) {
			const field = $fields[i];
			const value = this.$values[field.name];
			const onSet = dynamicTypes.get(field.type).onSave;

			fields[field.name] = onSet ? onSet(value, this.$values, field.args):value;
		}

		// already on database, just update
		let id;
		if (this.$databaseInitialized) {
			await query().table($table).where($primary, fields[$primary] as string).update(fields);
			id = fields[$primary];
		}
		// not on database, create
		else {
			id = await query().table($table).insert(fields) || fields[$primary];
			this.$databaseInitialized = true;
		}

		// update fields
		this.fill(await query().table($table).where($primary, id).first());
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
		const $allFields = (this.constructor.prototype as {$fields?: FieldInfoInterface[]}).$fields;
		
		// set fields
		for (let i = 0; i < $allFields.length; i++) {
			const field = $allFields[i];

			if (fields[field.name]) {
				this.$values[field.name] 	= fields[field.name];
			}
		}
	}
}

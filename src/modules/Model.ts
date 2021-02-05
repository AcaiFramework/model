// Packages
import query from "query/mod.ts";

// Interfaces
import FieldInfoInterface from "../interfaces/fieldInfo.ts";

// Types
import * as dynamicTypes from "../types/index.ts";

export default abstract class Model {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	// static
	protected static $table: string;
	protected static $fields: FieldInfoInterface[] = [];

	// instance
	private $values: Record<string, unknown> = {};

	// -------------------------------------------------
	// Constructor
	// -------------------------------------------------

	public constructor (fields: Record<string, unknown> = {}) {
		const $allFields = (this.constructor as {$fields?: FieldInfoInterface[]}).$fields;

		// set fields
		for (let i = 0; i < $allFields.length; i++) {
			const field = $allFields[i];

			this[field.name as keyof this] = Object.defineProperty(this, field.name, {
				configurable: false,
				enumerable: false,
				set: (value) => {
					const onSet = dynamicTypes.get(field.type).onUpdate;
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
		return this.$values;
	}

	public toJson () {
		return JSON.stringify(this.$values);
	}

	// -------------------------------------------------
	// Query methods
	// -------------------------------------------------

	public static query () {
		return query().table(this.$table);
	}
}
import { Model } from "../..";

// Interfaces
import RelationDataInterface from "../interfaces/relationData";

export default function foreignHandler(this: Model, foreign: RelationDataInterface) {
	// -------------------------------------------------
	// belongsTo
	// -------------------------------------------------

	if (foreign.type === "belongsTo") {
		return {
			get: async () => {
				const key = this.$values[foreign.foreignKey || "id"] as string;

				if (key) {
					return foreign.model().find(key as string);
				}
			},
			set: (value: string | number | Model) => {
				if (["string", "number"].includes(typeof value))
					this.$values[foreign.foreignKey] = value;
				else
					this.$values[foreign.foreignKey] = (value as Model).$values[foreign.primaryKey || "id"];
			}
		}
	}
	
	// -------------------------------------------------
	// hasMany
	// -------------------------------------------------

	if (foreign.type === "hasMany") {
		return {
			create: (fields?: Record<string, unknown>) => {
				const model 							= foreign.model();
				const instance 							= new model(fields);
				instance.$values[foreign.foreignKey] 	= this.$values[foreign.primaryKey || "id"] as string;

				return instance;
			},
			get: () => {
				return foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"] as string).get();
			},
			find:(id: string | number) => {
				return foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"] as string).find(id);
			},
			query:() => {
				return foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"] as string);
			},
		}
	}

	// -------------------------------------------------
	// hasOne
	// -------------------------------------------------

	if (foreign.type === "hasOne") {
		return {
			findOrCreate: async (fields?: Record<string, unknown>) => {
				const saved = await foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"] as string).first();

				if (saved) return saved;

				const model 							= foreign.model();
				const instance 							= new model(fields);
				instance.$values[foreign.foreignKey] 	= this.$values[foreign.primaryKey || "id"] as string;

				return instance;
			},
			get: () => {
				return foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"] as string).first();
			},
			delete: async (id: string | number) => {
				await foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"] as string).delete();
			},
			query:() => {
				return foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"] as string);
			},
		}
	}
}
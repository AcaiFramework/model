// Interfaces
import FieldInfoInterface 	from "../interfaces/fieldInfo";
import RelationDataInterface 	from "../interfaces/relationData";

// Parts
import Model from "./Model";

const BelongsTo = (modelcb:() => typeof Model, foreignKey: string, primaryKey?: string): PropertyDecorator => {
	return (target, key) => {
		const thismodel 	= target.constructor.prototype as { $fields?: FieldInfoInterface[], $relations?: RelationDataInterface[] };
		
		if (!thismodel.$fields) 	thismodel.$fields 		= [];
		if (!thismodel.$relations)	thismodel.$relations 	= [];

		// add field that will store the relation data
		thismodel.$fields.push({name: key as string, type: "string", args:{}});

		// add relation
		thismodel.$relations.push({
			model	: modelcb,
			type	: "belongsTo",
			name	: key as string,
			foreignKey,
			primaryKey,
		});
	}
}

export default BelongsTo;
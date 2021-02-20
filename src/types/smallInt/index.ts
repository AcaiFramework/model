// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

const toInt = (v: string, _: unknown, args?: {max?: number, min?: number}) => {
	const format = parseInt(v);

	if (args) {
		if (args.max && args.max < format)
			return args.max
		if (args.min && args.min > format)
			return args.min;
	}
		
	return format;
};

const smallIntType = {
	type: {
		type: "smallint"
	},

	onCreate	: toInt,
	onUpdate	: toInt,
	onSave		: toInt,
	onRetrieve	: toInt,
} as ModelTypeInterface;

export default smallIntType;
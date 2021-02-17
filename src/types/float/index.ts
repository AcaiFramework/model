// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

const toFloat = (v: string, _: unknown, args?: {max?: number, min?: number}) => {
	const format = parseFloat(v);

	if (args) {
		if (args.max && args.max < format)
			return args.max
		if (args.min && args.min > format)
			return args.min;
	}
		
	return format;
};

const floatType = {
	type: {
		type: "float"
	},

	onCreate	: toFloat,
	onUpdate	: toFloat,
	onSave		: toFloat,
	onRetrieve	: toFloat,
} as ModelTypeInterface;

export default floatType;
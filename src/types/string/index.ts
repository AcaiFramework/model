// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

const toString = (v: unknown, _: unknown, args?: {max?: number}) => {
	const format = `${v}`;

	if (args) {
		if (args.max && args.max < format.length)
			return format.substring(0, args.max);
	}
		
	return format;
};

const stringType = {
	onCreate	: toString,
	onUpdate	: toString,
	onSave		: toString,
	onRetrieve	: toString,
} as ModelTypeInterface;

export default stringType;
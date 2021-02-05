// Interfaces
import ModelTypeInterface from "../../interfaces/modelType.ts";

const toString = (v: unknown, _: unknown, [max]: [string?]) => {
	const format = `${v}`;

	if (max && parseInt(max) < format.length)
		return format.substring(0, parseInt(max));
		
	return format;
};

const stringType = {
	onCreate	: toString,
	onUpdate	: toString,
	onSave		: toString,
	onRetrieve	: toString,
} as ModelTypeInterface;

export default stringType;
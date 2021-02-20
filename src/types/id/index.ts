// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

const toInt = (v: string) => {
	const format = parseInt(v);
		
	return format;
};

const idType = {
	type: {
		type: "int",
		length: 21,
	},

	onCreate	: toInt,
	onUpdate	: toInt,
	onSave		: toInt,
	onRetrieve	: toInt,
} as ModelTypeInterface;

export default idType;
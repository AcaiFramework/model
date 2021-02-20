// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

const toJson = (v: unknown, _: unknown, args?: {max?: number}) => {
	if (typeof v === "string")
		return JSON.parse(v);
	if (v === undefined)
		return {};
		
	return v;
};

const jsonType = {
	type: {
		type: "json"
	},
	onCreate	: toJson,
	onUpdate	: toJson,
	onSave		: toJson,
	onRetrieve	: toJson,
} as ModelTypeInterface;

export default jsonType;
// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

const toSid = (v: unknown, _, args?: {length?: number}) => {
	if (v !== undefined && v !== null)
		return `${v}`;
	else
		return Math.random().toString(36).substring(2, 2 + (args?.length || 11));
};

const sidType = {
	onCreate	: toSid,
	onUpdate	: toSid,
	onSave		: toSid,
	onRetrieve	: toSid,
} as ModelTypeInterface;

export default sidType;
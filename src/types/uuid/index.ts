// Packages
import { v4 as uuid } from 'uuid';

// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

const toUuid = (v: unknown) => {
	if (v !== undefined && v !== null)
		return `${v}`;
	else
		return uuid();
};

const uuidType = {
	type: {
		type: "string",
		length: 36,
	},
	onCreate	: toUuid,
	onUpdate	: toUuid,
	onSave		: toUuid,
	onRetrieve	: toUuid,
} as ModelTypeInterface;

export default uuidType;
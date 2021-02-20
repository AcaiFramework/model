// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

const toBoolean = (v: unknown) => {
	return typeof v === "boolean" ? v:!!v;
};

const toDatabaseBoolean = (v: unknown) => {
	return !!v ? 1:0;
}

const booleanType = {
	type: {
		type: "int",
	},
	onSave		: toDatabaseBoolean,
	onCreate	: toBoolean,
	onRetrieve	: toBoolean,
	onSerialize	: toBoolean,
} as ModelTypeInterface;

export default booleanType;
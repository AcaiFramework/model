// Packages
import { DateTime } from "luxon";

// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

const toDate = (v: unknown) => {
	if (DateTime.isDateTime(v))
		return v;
	if (typeof v === "string")
		return DateTime.fromMillis(parseInt(v));
	if (typeof v === "number")
		return DateTime.fromMillis(v);
	if (v instanceof Date)
		return DateTime.fromJSDate(v);
		
	return v;
};

const toSerializeDate = (v: Date, _: unknown) => {
	const value = DateTime.isDateTime(v) ? v : DateTime.fromJSDate(v);
		
	return value.toMillis();
};

const timestampType = {
	type: {
		type: "timestamp",
	},
	onCreate	: toDate,
	onRetrieve	: toDate,
	onSave		: toSerializeDate,
	onSerialize	: toSerializeDate,
} as ModelTypeInterface;

export default timestampType;
// Packages
import { DateTime } from "luxon";

// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

const toDate = (v: unknown) => {
	if (DateTime.isDateTime(v))
		return v;
	if (typeof v === "string")
		return DateTime.fromISO(v);
	if (v instanceof Date)
		return DateTime.fromJSDate(v);
		
	return v;
};

const toSerializeDate = (v: Date, _: unknown, args?: {format?: string}) => {
	const value = DateTime.isDateTime(v) ? v : DateTime.fromJSDate(v);

	if (args) {
		if (args.format) {
			return value.toFormat(args.format);
		}
	}
		
	return value.toISO();
};

const datetimeType = {
	type: {
		type: "datetime",
	},
	onCreate	: toDate,
	onRetrieve	: toDate,
	onSave		: toSerializeDate,
	onSerialize	: toSerializeDate,
} as ModelTypeInterface;

export default datetimeType;
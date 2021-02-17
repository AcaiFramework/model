// Packages
import { DateTime } from "luxon";

// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

const toDate = (v: unknown, _: unknown, args?: {format?: string}) => {
	const value = DateTime[typeof v === "string" ? "fromISO":"fromJSDate"](v as string & Date);
		
	return value;
};

const toSerializeDate = (v: Date, _: unknown, args?: {format?: string}) => {
	const value = DateTime.isDateTime(v) ? v : DateTime.fromJSDate(v);

	if (args) {
		if (args.format) {
			return value.toFormat(args.format);
		}
	}
		
	return value.toISODate();
};

const dateType = {
	onCreate	: toDate,
	onRetrieve	: toDate,
	onSave		: toSerializeDate,
	onSerialize	: toSerializeDate,
} as ModelTypeInterface;

export default dateType;
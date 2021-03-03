// Interfaces
import FieldInfoInterface from "../interfaces/fieldInfo";

const Field = (type = "string", args?: Record<string, string | number | boolean | string[]>): PropertyDecorator => {
	return (target, key) => {
		const model = target.constructor.prototype as { $fields?: FieldInfoInterface[] };

		if (!model.$fields) model.$fields = [];

		model.$fields.push({
			name: key as string,
			type,
			args,
		});
	}
}

export default Field;
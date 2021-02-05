// Interfaces
import FieldInfoInterface from "../interfaces/fieldInfo.ts";

const Field = (type = "string"): PropertyDecorator => {
	const args 	= (type.split(":")[1] || "").split(",");

	return (target, key) => {
		const model = target.constructor as {$fields?: FieldInfoInterface[]};

		if (!model.$fields) model.$fields = [];

		model.$fields.push({
			name: key as string,
			type,
			args,
		});
	};
}

export default Field;
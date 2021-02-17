const models = [];

const Model = (table: string, primary = "id"): ClassDecorator => {
	return (target) => {
		const model 	= target as unknown as {$table: string, $primary: string};
		model.$table 	= table;
		model.$primary	= primary;

		models.push(model);
	};
}

export default Model;

export const getModels = () => models;
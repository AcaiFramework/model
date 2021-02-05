const Model = (table: string): ClassDecorator => {
	return (target) => {
		const model 	= target.constructor as unknown as {$table: string};
		model.$table 	= table;
	};
}

export default Model;
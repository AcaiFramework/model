import { DateTime } from "luxon";
import query, { setDefault } from "@acai/query";

import { Model, Field, Table } from ".";

@Table("data_test")
class Schema extends Model {
	@Field("int")
	public id: number;

	@Field()
	public name: string;

	@Field("int")
	public batch: number = 1;

	@Field()
	public comment: string;

	@Field("date")
	public migration_time: DateTime;
}

async function main () {
	try {
		await setDefault("sql", {
			user		: "root",
			password	: "",
			database	: "adonis_lexxer",
		});
	
		await Schema.runMigration();
	}
	catch (e) {
		console.log(e);
	}

	await query().close();
}

main();
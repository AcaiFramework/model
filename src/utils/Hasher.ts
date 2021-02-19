// Packages
import * as bcrypt from "bcrypt";

export default class Hasher {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	protected value				: string;
	protected saltOrRounds		: string | number | undefined;

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	constructor (value?: string, saltOrRounds?: string) {
		if (value) this.value = value;
		this.saltOrRounds 	= saltOrRounds;
	}

	// -------------------------------------------------
	// Instance methods
	// -------------------------------------------------

	public async hash (value: string) {
		this.value = await bcrypt.hash(value, this.saltOrRounds);
	}

	public toString () {
		return this.value;
	}

	public async compare (valueToCompare: string) {
		return await bcrypt.compare(valueToCompare, this.value);
	}
}